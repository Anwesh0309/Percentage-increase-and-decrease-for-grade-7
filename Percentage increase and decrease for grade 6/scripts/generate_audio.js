/**
 * Offline ElevenLabs audio generation (see AUDIO_PIPELINE.md)
 *
 *   node scripts/generate_audio.js                  -> generate every missing .mp3, then rewrite the maps
 *   node scripts/generate_audio.js --force          -> regenerate everything
 *   node scripts/generate_audio.js --manifest-only  -> only rewrite src/data/narration.js + src/utils/audioMap.js (no API calls)
 *
 * Policy: audio is generated ONLY for paragraph text and questions — never titles/headings.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { coreScript } from '../src/data/coreScript.js';
import { staticQuestionBank } from '../src/data/questionBank.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
dotenv.config({ path: path.join(ROOT, '.env.local') });

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const MODEL_ID = 'eleven_multilingual_v2';
const RATE_LIMIT_MS = 500;

const args = new Set(process.argv.slice(2));
const MANIFEST_ONLY = args.has('--manifest-only');
const FORCE = args.has('--force');

// Voice settings by style (same table as the numberbound pipeline)
const VOICE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

/* ---------- Spell out numbers & symbols so ElevenLabs pronounces them perfectly ---------- */
const ONES = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

function intToWords(n) {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + intToWords(n % 100) : '');
  if (n < 1000000) return intToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + intToWords(n % 1000) : '');
  return String(n);
}
function numToWords(str) {
  const [whole, dec] = String(str).split('.');
  let out = intToWords(parseInt(whole, 10));
  if (dec !== undefined) out += ' point ' + dec.split('').map((d) => ONES[parseInt(d, 10)]).join(' ');
  return out;
}

export function sanitizePhonetics(text) {
  if (!text) return '';
  return text
    .replace(/(\d),(?=\d{3}\b)/g, '$1')                                  // 3,600 -> 3600
    .replace(/\$(\d+(?:\.\d+)?)/g, (_, n) => `${numToWords(n)} dollars`)  // $50 -> fifty dollars
    .replace(/(\d+(?:\.\d+)?)\s*%/g, (_, n) => `${numToWords(n)} percent`)
    .replace(/\bMr\b/g, 'Mister')
    .replace(/(\d)\s*cm\b/g, '$1 centimetres')
    .replace(/(\d)\s*kg\b/g, '$1 kilograms')
    .replace(/(\d)\s*km\b/g, '$1 kilometres')
    .replace(/(\d)\s*g\b/g, '$1 grams')
    .replace(/\bcm\b/g, 'centimetres')
    .replace(/\bkm\b/g, 'kilometres')
    .replace(/\bkg\b/g, 'kilograms')
    .replace(/×/g, ' times ')
    .replace(/÷/g, ' divided by ')
    .replace(/−/g, ' minus ')
    .replace(/\+/g, ' plus ')
    .replace(/=/g, ' equals ')
    .replace(/→/g, ' to ')
    .replace(/\d+(?:\.\d+)?/g, (n) => numToWords(n))
    .replace(/%/g, ' percent')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,!?])/g, '$1')
    .trim()
    .replace(/(^|[.!?]\s+)([a-z])/g, (_, pre, ch) => pre + ch.toUpperCase()); // sentences start with a capital
}

/* ---------- Build the phrase list ---------- */
function buildPhrases() {
  const phrases = coreScript.map((p) => ({ key: p.key, style: p.style, text: p.text }));
  Object.values(staticQuestionBank).forEach((questions) => {
    questions.forEach((q, i) => {
      phrases.push({ key: `w${q.worldId}_q${i + 1}_prompt`, style: 'question', text: q.prompt });
      phrases.push({ key: `w${q.worldId}_q${i + 1}_hint`, style: 'thinking', text: q.hint });
    });
  });
  return phrases;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function requestAudio(spokenText, style, attempt = 1) {
  const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { Accept: 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
    body: JSON.stringify({ text: spokenText, model_id: MODEL_ID, voice_settings: settings }),
  });
  if (response.status === 429 && attempt < 4) {
    console.warn(`   ⏳ Rate limited — waiting before retry ${attempt}...`);
    await sleep(3000 * attempt);
    return requestAudio(spokenText, style, attempt + 1);
  }
  if (!response.ok) {
    throw new Error(`ElevenLabs API Error (${response.status}): ${await response.text()}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function run() {
  const outputDir = path.join(ROOT, 'public/assets/audio');
  fs.mkdirSync(outputDir, { recursive: true });

  const phrases = buildPhrases();
  const narrationScript = {};
  const narrationStyles = {};
  const audioMap = {};
  const missing = [];

  for (const p of phrases) {
    const spoken = sanitizePhonetics(p.text);
    const file = `${p.key}.mp3`;
    const url = `/assets/audio/${file}`;
    narrationScript[p.key] = spoken;
    narrationStyles[p.key] = p.style;
    audioMap[spoken] = url;
    audioMap[`key:${p.key}`] = url;
    const exists = fs.existsSync(path.join(outputDir, file)) && fs.statSync(path.join(outputDir, file)).size > 0;
    if (FORCE || !exists) missing.push({ ...p, spoken, file });
  }

  if (MANIFEST_ONLY) {
    console.log(`📋 Manifest only: ${phrases.length} phrases (${missing.length} .mp3 files still to generate).`);
  } else {
    if (!API_KEY) throw new Error('Missing VITE_ELEVENLABS_API_KEY in .env.local');
    console.log(`🎙️  Generating ${missing.length}/${phrases.length} audio files with Alice (${VOICE_ID})...`);
    let ok = 0;
    for (let i = 0; i < missing.length; i++) {
      const p = missing[i];
      console.log(`🗣️  [${i + 1}/${missing.length}] ${p.file} (${p.style}) — "${p.spoken.slice(0, 60)}..."`);
      try {
        const buf = await requestAudio(p.spoken, p.style);
        fs.writeFileSync(path.join(outputDir, p.file), buf);
        ok++;
      } catch (e) {
        console.error(`❌ ${p.key}: ${e.message}`);
      }
      await sleep(RATE_LIMIT_MS);
    }
    console.log(`✅ Saved ${ok}/${missing.length} new files.`);
  }

  // Auto-generated maps
  fs.writeFileSync(
    path.join(ROOT, 'src/utils/audioMap.js'),
    `// Auto-generated Audio Asset Map (do not edit — run: npm run audio:generate)\nexport const audioMap = ${JSON.stringify(audioMap, null, 2)};\nexport default audioMap;\n`,
    'utf-8',
  );
  fs.writeFileSync(
    path.join(ROOT, 'src/data/narration.js'),
    `// Auto-generated Narration Script Dictionary (spoken form of every narrated line)\nexport const narrationScript = ${JSON.stringify(narrationScript, null, 2)};\n\n// Voice style used for each line (drives ElevenLabs voice settings)\nexport const narrationStyles = ${JSON.stringify(narrationStyles, null, 2)};\n\nexport default narrationScript;\n`,
    'utf-8',
  );
  console.log('🗺️  Wrote src/utils/audioMap.js and src/data/narration.js');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
