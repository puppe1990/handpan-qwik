import type { ScalePreset } from '../lib/types';

export const SCALE_PRESETS: ScalePreset[] = [
  {
    name: 'Celtic Minor',
    key: 'D Minor',
    description: 'Mysterious, deep, and reflective. The classic handpan scale.',
    ding: 'D3',
    notes: ['A3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C5'],
    frequencies: [146.83, 220.00, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25]
  },
  {
    name: 'Hijaz',
    key: 'G Phrygian Dominant',
    description: 'Exotic, warm, and Middle Eastern. Highly expressive and cinematic.',
    ding: 'G3',
    notes: ['C4', 'Db4', 'E4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5'],
    frequencies: [196.00, 261.63, 277.18, 329.63, 349.23, 392.00, 415.30, 466.16, 523.25]
  },
  {
    name: 'Pygmy',
    key: 'F Minor Pentatonic',
    description: 'Earthly, hypnotic, and tribal. Perfectly balanced for meditative play.',
    ding: 'F3',
    notes: ['Ab3', 'Bb3', 'C4', 'Eb4', 'F4', 'Ab4', 'Bb4', 'C5'],
    frequencies: [174.61, 207.65, 233.08, 261.63, 311.13, 349.23, 415.30, 466.16, 523.25]
  },
  {
    name: 'Akebono',
    key: 'C Pentatonic',
    description: 'Traditional Japanese scale. Highly spiritual, serene, and zen.',
    ding: 'C3',
    notes: ['D3', 'Eb3', 'G3', 'Ab3', 'C4', 'D4', 'Eb4', 'G4'],
    frequencies: [130.81, 146.83, 155.56, 196.00, 207.65, 261.63, 293.66, 311.13, 392.00]
  },
  {
    name: 'Astral G-Major',
    key: 'G Major',
    description: 'Celestial, bright, and uplifting. Excellent for joyful melodies.',
    ding: 'G3',
    notes: ['B3', 'C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4'],
    frequencies: [196.00, 246.94, 261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88]
  }
];
