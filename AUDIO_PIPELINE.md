# Percentage Increase & Decrease — Audio & Narration Pipeline

Same hybrid pipeline as the Number Bonds / Angles modules, using ElevenLabs.

## Voice profile
- Provider: ElevenLabs · Voice: **Alice** (`Xb7hH8MSUJpSbSDYk0k2`) · Model: `eleven_multilingual_v2`
- API key: `.env.local` → `VITE_ELEVENLABS_API_KEY`

| Style | Stability | Similarity | Style | Speaker Boost |
|-------|-----------|-----------|-------|---------------|
| `celebration` | 0.12 | 0.45 | 0.75 | ✅ |
| `encouragement` | 0.16 | 0.50 | 0.65 | ✅ |
| `question` | 0.20 | 0.55 | 0.55 | ✅ |
| `emphasis` | 0.16 | 0.50 | 0.60 | ✅ |
| `thinking` | 0.24 | 0.60 | 0.35 | ✅ |
| `statement` / `instruction` | 0.20 | 0.55 | 0.50 | ✅ |

**Content policy:** audio is generated ONLY for paragraph text and questions. Titles, headings and labels are never narrated.

## Files
| File | Role |
|------|------|
| `src/data/coreScript.js` | Source of truth for core lines `{ key, text, style }` (story slides + reflect topics are imported from their data files, so on-screen text = audio text) |
| `src/data/questionBank.js` | 100 questions — each prompt (`style: question`) and hint (`style: thinking`) is narrated |
| `scripts/generate_audio.js` | Spells out numbers/symbols (`$50` → "fifty dollars", `×0.8` → "times zero point eight"), calls ElevenLabs with per-style settings (500 ms rate limit), saves `public/assets/audio/<key>.mp3`, writes `src/utils/audioMap.js` and `src/data/narration.js` |
| `scripts/clean_audio.js` | Deletes `.mp3` files no longer referenced by `audioMap.js` |
| `src/utils/audioMap.js` | Auto-generated: spoken text and `key:<key>` → mp3 path |
| `src/data/narration.js` | Auto-generated: `narrationScript` (key → spoken text) and `narrationStyles` (key → style) |
| `src/utils/audio.js` | `soundEngine`: plays static mp3 → falls back to live ElevenLabs (same style settings, cached) → sequential queue with preloading; `stop()` halts immediately |

## Workflow
```bash
npm run audio:generate   # generate all missing mp3 files (add --force via: node scripts/generate_audio.js --force)
npm run audio:manifest   # refresh audioMap.js / narration.js without calling the API
npm run audio:clean      # remove orphaned mp3 files
```
To add or change a line: edit `coreScript.js` (or the question/story/reflect data), run `npm run audio:generate`, then call `soundEngine.playText('<key>')` in the component.
Components reference lines by **key** (e.g. `story_slide_2`, `w5_q3_prompt`, `correct_cheer`).
