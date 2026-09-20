# Percentage Increase & Decrease — Grade 6 Gamified Math Module

Same architecture as the "Angles Around a Point" module:
Home → Wonder → Story → Simulate (Stations A–D) → Practice (10 Worlds) → Reflect.

## Run

```bash
npm install
npm run dev
```

## Audio / voice (ElevenLabs — Alice, `Xb7hH8MSUJpSbSDYk0k2`)

The API key is stored in `.env.local` as `VITE_ELEVENLABS_API_KEY`.

```bash
npm run audio:generate   # generates every missing .mp3 into public/assets/audio and rewrites src/utils/audioMap.js
npm run audio:manifest   # rewrites narration.js + audioMap.js only (no API calls)
npm run audio:clean      # deletes .mp3 files that are no longer referenced
```

Until the `.mp3` files exist, the app automatically falls back to requesting the same
line live from ElevenLabs (with the same per-style voice settings) and caches it in memory.
Only paragraph text and questions are narrated — never titles.

See `AUDIO_PIPELINE.md` for the full pipeline description.
