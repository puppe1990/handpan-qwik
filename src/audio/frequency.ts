import type { DrumType } from "../lib/types";

export interface FrequencyVoiceOptions {
  velocity?: number;
  volume?: number;
  attack?: number;
  decay?: number;
  reverbSend?: number;
  fineTuneCents?: number;
}

export interface FrequencyVoiceConfig {
  frequency: number;
  label: string;
  velocity: number;
  volume: number;
  attack: number;
  decay: number;
  reverbSend: number;
  overtoneRatio2: number;
  overtoneRatio3: number;
  overtoneGain2: number;
  overtoneGain3: number;
  oscType: OscillatorType;
  noiseBandHz: number;
  compressorThreshold: number;
}

const NOTE_OFFSETS: Record<string, number> = {
  C: 0,
  "C#": 1,
  DB: 1,
  D: 2,
  "D#": 3,
  EB: 3,
  E: 4,
  F: 5,
  "F#": 6,
  GB: 6,
  G: 7,
  "G#": 8,
  AB: 8,
  A: 9,
  "A#": 10,
  BB: 10,
  B: 11,
};

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

/**
 * Clamp Hz into a safe musical synthesis range.
 * Non-finite values fall back to A4 (440 Hz).
 */
export function clampFrequency(
  hz: number,
  min = 20,
  max = 5000,
  fallback = 440,
): number {
  if (!Number.isFinite(hz)) return fallback;
  return Math.min(max, Math.max(min, hz));
}

/** Convert scientific pitch notation (e.g. A4, Db3) to Hz. */
export function noteNameToFrequency(name: string, a4 = 440): number | null {
  const cleaned = name.trim().toUpperCase().replace(/\s+/g, "");
  const match = cleaned.match(/^([A-G])([#B]?)(-?\d+)$/);
  if (!match) return null;

  const letter = match[1];
  const accidental = match[2] === "B" ? "B" : match[2]; // flat as B, sharp as #
  const octave = Number(match[3]);
  if (!Number.isFinite(octave)) return null;

  const key =
    accidental === "#"
      ? `${letter}#`
      : accidental === "B"
        ? `${letter}B`
        : letter;

  // Normalize flats like DB -> DB key in map
  const mapKey = key.replace("B", "B"); // keep as is; NOTE_OFFSETS uses DB, EB, etc.
  const semitone = NOTE_OFFSETS[mapKey];
  if (semitone === undefined) return null;

  // MIDI note number: C-1 = 0 ... A4 = 69
  const midi = (octave + 1) * 12 + semitone;
  return a4 * Math.pow(2, (midi - 69) / 12);
}

/** Nearest note name for a frequency. */
export function frequencyToNoteName(hz: number, a4 = 440): string {
  const f = clampFrequency(hz, 20, 5000, a4);
  const midi = Math.round(69 + 12 * Math.log2(f / a4));
  const noteIndex = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

/**
 * Resolve handpan/tongue synthesis parameters for an arbitrary frequency.
 * Pure function — no AudioContext required (easy to unit test).
 */
export function resolveFrequencyVoice(
  hz: number,
  drumType: DrumType,
  options: FrequencyVoiceOptions = {},
): FrequencyVoiceConfig {
  const frequency = clampFrequency(hz);
  const isHandpan = drumType === "handpan";

  const fineTune = options.fineTuneCents ?? 0;
  const tuned = frequency * Math.pow(2, fineTune / 1200);

  return {
    frequency: tuned,
    label: frequencyToNoteName(tuned),
    velocity: clampUnit(options.velocity ?? 0.8),
    volume: clampUnit(options.volume ?? 0.85),
    attack: options.attack ?? 0.002,
    decay: options.decay ?? (isHandpan ? 1.5 : 2.8),
    reverbSend: clampUnit(options.reverbSend ?? 0.4),
    overtoneRatio2: isHandpan ? 2.0 : 2.4,
    overtoneRatio3: isHandpan ? 3.0 : 3.8,
    overtoneGain2: isHandpan ? 0.35 : 0.45,
    overtoneGain3: isHandpan ? 0.2 : 0.25,
    oscType: isHandpan ? "sine" : "triangle",
    noiseBandHz: isHandpan ? 1200 : 2200,
    compressorThreshold: -15,
  };
}

function clampUnit(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
