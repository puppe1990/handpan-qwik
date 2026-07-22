# Handpan & Tongue Drum Simulator (Qwik)

Interactive low-latency **Handpan** and **Steel Tongue Drum** simulator rebuilt with [Qwik City](https://qwik.dev/).

**Live:** [https://rad-bunny-cfb122.netlify.app](https://rad-bunny-cfb122.netlify.app)  
**GitHub:** [puppe1990/handpan-qwik](https://github.com/puppe1990/handpan-qwik)

Port of [puppe1990/handpan-tongue-drum-simulator](https://github.com/puppe1990/handpan-tongue-drum-simulator) with full feature parity and a hybrid architecture: imperative Web Audio engine + progressive Qwik UI.

## Features

- Physical-model synthesis (handpan / tongue) via Web Audio API
- Interactive multi-touch drum (keyboard `1`–`9`)
- Scale presets: Celtic Minor, Hijaz, Pygmy, Akebono, Astral G-Major
- Step sequencer (BPM, 8/16/32 steps)
- Live event looper + master WAV recorder
- DSP Lab (Schroeder reverb, compressor, per-note synth params)
- Web MIDI learn & mapping
- Cloud scale library (static packs)
- LFO modulation automation
- Undo/redo history, JSON preset import/export
- Frequency spectrum analyzer

## Stack

- **Qwik City** + Vite + TypeScript
- **Tailwind CSS** v4
- Web Audio API / Web MIDI (browser-only)

## Quick start

```bash
cd handpan-qwik
npm install
npm start
```

Open the URL Vite prints (usually `http://localhost:5173`). **Tap the page once** to unlock audio (browser autoplay policy).

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm start`       | Dev server (SSR mode)    |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`    | ESLint                   |

## Architecture

```
src/
  audio/          # Imperative engine (DSP, sequencer, looper, MIDI)
  components/handpan/  # Qwik UI panels
  lib/            # types, cloud packs, shared UI revision
  routes/         # Qwik City page
```

The audio engine is a singleton outside Qwik reactivity so note triggering stays low-latency. UI state is mirrored via `useStore` + engine callbacks.

## Deploy

Static SSG via `adapters/static`. Netlify publishes `dist/`.

```bash
npm run build
netlify deploy --prod --dir=dist
```

Or connect the GitHub repo in the [Netlify dashboard](https://app.netlify.com/projects/rad-bunny-cfb122) for continuous deploys on push to `master`.

## Notes

- No Gemini / AI Studio dependency (unused in the original).
- Web MIDI works best in Chromium-based browsers.
- Tap the page once to unlock audio (browser autoplay policy).
