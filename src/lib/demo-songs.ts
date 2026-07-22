import type { DrumType } from "./types";

/** Built-in playable compositions for the step sequencer. */
export interface DemoSong {
  id: string;
  name: string;
  description: string;
  scaleName: string;
  drumType: DrumType;
  bpm: number;
  stepsCount: 16 | 32;
  /** noteId 0–8 → step hits */
  pattern: Record<number, number[]>;
  reverb?: { roomSize: number; damping: number; mix: number };
}

function emptyGrid(steps: number): Record<number, boolean[]> {
  const grid: Record<number, boolean[]> = {};
  for (let i = 0; i < 9; i++) {
    grid[i] = Array(steps).fill(false);
  }
  return grid;
}

/** Expand compact pattern into sequencer boolean grid. */
export function songPatternToGrid(
  song: DemoSong,
): Record<number, boolean[]> {
  const grid = emptyGrid(song.stepsCount);
  for (const [noteIdStr, steps] of Object.entries(song.pattern)) {
    const noteId = Number(noteIdStr);
    for (const step of steps) {
      if (step >= 0 && step < song.stepsCount && grid[noteId]) {
        grid[noteId][step] = true;
      }
    }
  }
  return grid;
}

/**
 * Demo compositions.
 * Celtic Minor pads: 0 Ding D3 · 1 A3 · 2 C4 · 3 D4 · 4 E4 · 5 F4 · 6 G4 · 7 A4 · 8 C5
 * Hijaz pads:        0 Ding G3 · 1 C4 · 2 Db4 · 3 E4 · 4 F4 · 5 G4 · 6 Ab4 · 7 Bb4 · 8 C5
 * Akebono pads:      0 Ding C3 · 1 D3 · 2 Eb3 · 3 G3 · 4 Ab3 · 5 C4 · 6 D4 · 7 Eb4 · 8 G4
 */
export const DEMO_SONGS: DemoSong[] = [
  {
    id: "forest-pulse",
    name: "Forest Pulse",
    description:
      "Meditative Celtic Minor loop — ding anchors and rising melody over 16 steps.",
    scaleName: "Celtic Minor",
    drumType: "handpan",
    bpm: 88,
    stepsCount: 16,
    reverb: { roomSize: 0.82, damping: 0.3, mix: 0.42 },
    // Melody: D4 E4 F4 G4 | A4 G4 F4 E4 | D4 C4 A3 C4 | D4 E4 F4 D4
    pattern: {
      0: [0, 4, 8, 12], // Ding pulse
      1: [10, 14], // A3
      2: [9, 11], // C4
      3: [0, 8, 12, 15], // D4
      4: [1, 7, 13], // E4
      5: [2, 6, 14], // F4
      6: [3, 5], // G4
      7: [4], // A4 peak
      8: [], // rest
    },
  },
  {
    id: "ember-waltz",
    name: "Ember Waltz",
    description:
      "Warm 32-step Celtic piece with call-and-response and soft high-tone sparkles.",
    scaleName: "Celtic Minor",
    drumType: "handpan",
    bpm: 96,
    stepsCount: 32,
    reverb: { roomSize: 0.78, damping: 0.35, mix: 0.38 },
    pattern: {
      // Ding: every bar start + half
      0: [0, 8, 16, 24],
      // Bass A3: groove
      1: [2, 6, 10, 14, 18, 22, 26, 30],
      // C4 harmony
      2: [4, 12, 20, 28],
      // Melody line (bars 1–2)
      3: [1, 5, 9, 17, 21, 25], // D4
      4: [3, 11, 19, 27], // E4
      5: [7, 15, 23], // F4
      6: [13, 29], // G4
      7: [15, 31], // A4 accents
      8: [31], // C5 sparkle at end
    },
  },
  {
    id: "desert-mirage",
    name: "Desert Mirage",
    description:
      "Cinematic Hijaz motif — exotic steps with a slow, hypnotic ding.",
    scaleName: "Hijaz",
    drumType: "handpan",
    bpm: 100,
    stepsCount: 16,
    reverb: { roomSize: 0.72, damping: 0.45, mix: 0.36 },
    // Pads: 0 G3 · 1 C4 · 2 Db4 · 3 E4 · 4 F4 · 5 G4 · 6 Ab4 · 7 Bb4 · 8 C5
    pattern: {
      0: [0, 8], // sparse ding
      1: [0, 4, 8, 12], // C4 pedal
      2: [2, 6, 10], // Db4 color
      3: [1, 5, 9, 13], // E4
      4: [3, 7, 11, 15], // F4
      5: [4, 12], // G4
      6: [6, 14], // Ab4
      7: [7, 15], // Bb4
      8: [15], // C5 finish
    },
  },
  {
    id: "zen-garden",
    name: "Zen Garden",
    description:
      "Sparse Akebono tongue-drum meditation — long spaces, pure tones.",
    scaleName: "Akebono",
    drumType: "tongue",
    bpm: 72,
    stepsCount: 16,
    reverb: { roomSize: 0.9, damping: 0.2, mix: 0.55 },
    // Pads: 0 C3 · 1 D3 · 2 Eb3 · 3 G3 · 4 Ab3 · 5 C4 · 6 D4 · 7 Eb4 · 8 G4
    pattern: {
      0: [0, 8], // deep bass
      1: [2, 10], // D3
      2: [4], // Eb3
      3: [6, 14], // G3
      4: [12], // Ab3
      5: [1, 9], // C4
      6: [5, 13], // D4
      7: [7], // Eb4
      8: [15], // G4 release
    },
  },
];

export function getDemoSong(id: string): DemoSong | undefined {
  return DEMO_SONGS.find((s) => s.id === id);
}
