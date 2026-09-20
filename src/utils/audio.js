import { audioMap } from './audioMap';
import { narrationScript, narrationStyles } from '../data/narration';

/**
 * Hybrid audio engine (see AUDIO_PIPELINE.md)
 *  1. Pre-generated ElevenLabs .mp3 (audioMap)  -> zero latency
 *  2. Dynamic fallback: request the same line live from ElevenLabs with the same per-style voice settings
 *  3. Sequential queue with eager preloading; stop() halts everything immediately
 *
 * playText() / enqueue() accept either a narration KEY (e.g. "story_slide_1") or the exact narrated text.
 */

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const MODEL_ID = 'eleven_multilingual_v2';
const API_KEY = import.meta.env?.VITE_ELEVENLABS_API_KEY;

export const VOICE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// Resolve a key or a raw text string into { key, text, style, path }
function resolveEntry(input) {
  if (!input) return null;
  if (narrationScript[input]) {
    return {
      key: input,
      text: narrationScript[input],
      style: narrationStyles[input] || 'statement',
      path: audioMap[`key:${input}`] || null,
    };
  }
  const keyed = audioMap[`key:${input}`];
  if (keyed) {
    return { key: input, text: narrationScript[input] || input, style: narrationStyles[input] || 'statement', path: keyed };
  }
  return { key: null, text: input, style: 'statement', path: audioMap[input] || null };
}

class SoundEngine {
  constructor() {
    this.currentAudio = null;
    this.audioEnabled = true;
    this.isPlaying = false;
    this.queue = [];
    this.lastClickTime = 0;
    this.token = 0;               // invalidates stale async work after stop()
    this.dynamicCache = new Map(); // "style|text" -> blob URL
    this.pendingGesture = null;   // entry blocked by browser autoplay policy
    this.audioCtx = null;
    this.warnedNoKey = false;

    if (typeof window !== 'undefined') {
      const unlock = () => {
        if (this.pendingGesture && this.audioEnabled && !this.isPlaying) {
          const entry = this.pendingGesture;
          this.pendingGesture = null;
          this._start(entry, this.token);
        } else {
          this.pendingGesture = null;
        }
      };
      window.addEventListener('pointerdown', unlock, { capture: true });
      window.addEventListener('keydown', unlock, { capture: true });
    }
  }

  setAudioEnabled(enabled) {
    this.audioEnabled = enabled;
    if (!enabled) this.stop();
  }

  stop() {
    this.token += 1;
    if (this.currentAudio) {
      try {
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) { /* ignore */ }
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.queue = [];
    this.pendingGesture = null;
  }

  /* ---------- Short UI sound effects (Web Audio, no files needed) ---------- */
  _ctx() {
    const AudioCtx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (!AudioCtx) return null;
    if (!this.audioCtx) this.audioCtx = new AudioCtx();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => {});
    return this.audioCtx;
  }

  _tone(freqStart, freqEnd, duration, volume = 0.06, type = 'sine', delay = 0) {
    try {
      const ctx = this._ctx();
      if (!ctx) return;
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, t0);
      osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), t0 + duration);
      gain.gain.setValueAtTime(volume, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + duration);
    } catch (e) { /* ignore web audio errors */ }
  }

  playDragClick() {
    if (!this.audioEnabled) return;
    const now = Date.now();
    if (this.lastClickTime && now - this.lastClickTime < 45) return; // throttled for smooth drag sound
    this.lastClickTime = now;
    this._tone(900, 250, 0.018, 0.06);
  }

  playChime() {
    if (!this.audioEnabled) return;
    this._tone(660, 660, 0.14, 0.06, 'sine', 0);
    this._tone(880, 880, 0.14, 0.06, 'sine', 0.12);
    this._tone(1175, 1175, 0.22, 0.06, 'sine', 0.24);
  }

  playBuzz() {
    if (!this.audioEnabled) return;
    this._tone(220, 160, 0.2, 0.05, 'triangle');
  }

  playWhirr() {
    if (!this.audioEnabled) return;
    this._tone(180, 520, 0.45, 0.04, 'sawtooth');
  }

  /* ---------- Narration ---------- */
  async _getDynamicUrl(entry) {
    const cacheKey = `${entry.style}|${entry.text}`;
    if (this.dynamicCache.has(cacheKey)) return this.dynamicCache.get(cacheKey);
    if (!API_KEY) {
      if (!this.warnedNoKey) {
        console.warn('[SoundEngine] No static audio and no VITE_ELEVENLABS_API_KEY — narration skipped.');
        this.warnedNoKey = true;
      }
      return null;
    }
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: { Accept: 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
      body: JSON.stringify({
        text: entry.text,
        model_id: MODEL_ID,
        voice_settings: VOICE_SETTINGS[entry.style] || VOICE_SETTINGS.statement,
      }),
    });
    if (!response.ok) throw new Error(`ElevenLabs ${response.status}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    this.dynamicCache.set(cacheKey, url);
    return url;
  }

  // Warm the next queued line so there is no gap between sentences
  _preload(entry) {
    if (!entry) return;
    if (entry.path) {
      try {
        const a = new Audio(entry.path);
        a.preload = 'auto';
      } catch (e) { /* ignore */ }
    } else {
      this._getDynamicUrl(entry).catch(() => {});
    }
  }

  _playUrl(url, entry, token, isFallback) {
    return new Promise((resolve) => {
      if (token !== this.token) return resolve(false);
      const audio = new Audio(url);
      this.currentAudio = audio;
      this.isPlaying = true;

      audio.onended = () => {
        if (token !== this.token) return resolve(true);
        this.isPlaying = false;
        this.currentAudio = null;
        this._next(token);
        resolve(true);
      };

      audio.onerror = () => {
        if (token !== this.token) return resolve(false);
        this.currentAudio = null;
        this.isPlaying = false;
        if (!isFallback) {
          // static file missing -> ask ElevenLabs live
          this._playDynamic(entry, token).then(resolve);
        } else {
          this._next(token);
          resolve(false);
        }
      };

      audio.play().catch((err) => {
        if (token !== this.token) return resolve(false);
        if (err && err.name === 'NotAllowedError') {
          // Browser autoplay policy — replay after the first tap/click
          this.isPlaying = false;
          this.currentAudio = null;
          this.pendingGesture = entry;
          return resolve(false);
        }
        // Other failures (e.g. unsupported source) are handled by onerror
      });
    });
  }

  async _playDynamic(entry, token) {
    try {
      const url = await this._getDynamicUrl(entry);
      if (!url || token !== this.token) return false;
      return this._playUrl(url, entry, token, true);
    } catch (e) {
      console.warn('[SoundEngine] Dynamic narration failed:', e.message);
      this.isPlaying = false;
      this._next(token);
      return false;
    }
  }

  _start(entry, token) {
    if (!entry || token !== this.token) return;
    this.isPlaying = true;
    if (this.queue.length) this._preload(resolveEntry(this.queue[0]));
    if (entry.path) {
      this._playUrl(entry.path, entry, token, false);
    } else {
      this._playDynamic(entry, token);
    }
  }

  _next(token) {
    if (token !== this.token) return;
    if (this.queue.length > 0) {
      const nextInput = this.queue.shift();
      this._start(resolveEntry(nextInput), token);
    }
  }

  // Play a narration key (or exact text). Interrupts anything that is playing.
  playText(input) {
    if (!this.audioEnabled || !input) return;
    this.stop();
    const entry = resolveEntry(input);
    if (!entry) return;
    this._start(entry, this.token);
  }

  // Queue a narration key (or exact text) after whatever is playing.
  enqueue(input) {
    if (!this.audioEnabled || !input) return;
    if (!this.isPlaying) {
      this.playText(input);
    } else {
      this.queue.push(input);
      if (this.queue.length === 1) this._preload(resolveEntry(input));
    }
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
