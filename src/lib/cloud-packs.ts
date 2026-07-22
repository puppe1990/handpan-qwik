import type { CloudSamplePack } from './types';

export const CLOUD_LIBRARY_DATA: CloudSamplePack[] = [
  {
    id: 'pack_1',
    name: 'Siberian Forest D-Minor',
    creator: 'Yuri G.',
    downloads: 1420,
    category: 'Forest',
    scale: 'Celtic Minor',
    description: 'Earthy, deep, and heavily resonant. Handcrafted with an organic wood strike transient and extremely long reverb bloom.',
    drumType: 'handpan',
    preset: {
      name: 'Siberian Forest D-Minor',
      drumType: 'handpan',
      scaleName: 'Celtic Minor',
      tempo: 105,
      reverbConfig: { roomSize: 0.88, damping: 0.25, mix: 0.55 },
      compressorConfig: { threshold: -18, ratio: 6.0, attack: 0.008, release: 0.2 },
      notes: [
        { id: 0, label: 'D3', baseFreq: 146.83, fineTune: 0, volume: 1.0, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.45, overtoneGain3: 0.35, attack: 0.002, decay: 2.5, reverbSend: 0.65, compressorThreshold: -15 },
        { id: 1, label: 'A3', baseFreq: 220.00, fineTune: 0, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.4, overtoneGain3: 0.3, attack: 0.002, decay: 2.2, reverbSend: 0.55, compressorThreshold: -15 },
        { id: 2, label: 'C4', baseFreq: 261.63, fineTune: 0, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.4, overtoneGain3: 0.3, attack: 0.002, decay: 2.1, reverbSend: 0.55, compressorThreshold: -15 },
        { id: 3, label: 'D4', baseFreq: 293.66, fineTune: 0, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.4, overtoneGain3: 0.3, attack: 0.002, decay: 2.0, reverbSend: 0.5, compressorThreshold: -15 },
        { id: 4, label: 'E4', baseFreq: 329.63, fineTune: 0, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.4, overtoneGain3: 0.3, attack: 0.002, decay: 1.9, reverbSend: 0.5, compressorThreshold: -15 },
        { id: 5, label: 'F4', baseFreq: 349.23, fineTune: 0, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.4, overtoneGain3: 0.3, attack: 0.002, decay: 1.8, reverbSend: 0.5, compressorThreshold: -15 },
        { id: 6, label: 'G4', baseFreq: 392.00, fineTune: 0, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.4, overtoneGain3: 0.3, attack: 0.002, decay: 1.7, reverbSend: 0.5, compressorThreshold: -15 },
        { id: 7, label: 'A4', baseFreq: 440.00, fineTune: 0, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.4, overtoneGain3: 0.3, attack: 0.002, decay: 1.6, reverbSend: 0.5, compressorThreshold: -15 },
        { id: 8, label: 'C5', baseFreq: 523.25, fineTune: 0, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.4, overtoneGain3: 0.3, attack: 0.002, decay: 1.5, reverbSend: 0.5, compressorThreshold: -15 }
      ]
    }
  },
  {
    id: 'pack_2',
    name: 'Desert Wind Hijaz G',
    creator: 'Amir S.',
    downloads: 984,
    category: 'Spiritual',
    scale: 'Hijaz',
    description: 'Cinematic, warm, and highly expressive. Configured with rapid attacks, intense velocity mapping, and custom micro-tuned overtones.',
    drumType: 'handpan',
    preset: {
      name: 'Desert Wind Hijaz G',
      drumType: 'handpan',
      scaleName: 'Hijaz',
      tempo: 120,
      reverbConfig: { roomSize: 0.7, damping: 0.5, mix: 0.35 },
      compressorConfig: { threshold: -12, ratio: 4.5, attack: 0.002, release: 0.15 },
      notes: [
        { id: 0, label: 'G3', baseFreq: 196.00, fineTune: 4, volume: 1.0, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.3, overtoneGain3: 0.2, attack: 0.002, decay: 1.6, reverbSend: 0.4, compressorThreshold: -15 },
        { id: 1, label: 'C4', baseFreq: 261.63, fineTune: -2, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.25, overtoneGain3: 0.18, attack: 0.002, decay: 1.5, reverbSend: 0.3, compressorThreshold: -15 },
        { id: 2, label: 'Db4', baseFreq: 277.18, fineTune: 6, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.25, overtoneGain3: 0.18, attack: 0.002, decay: 1.5, reverbSend: 0.3, compressorThreshold: -15 },
        { id: 3, label: 'E4', baseFreq: 329.63, fineTune: 1, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.25, overtoneGain3: 0.18, attack: 0.002, decay: 1.4, reverbSend: 0.3, compressorThreshold: -15 },
        { id: 4, label: 'F4', baseFreq: 349.23, fineTune: -3, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.25, overtoneGain3: 0.18, attack: 0.002, decay: 1.4, reverbSend: 0.3, compressorThreshold: -15 },
        { id: 5, label: 'G4', baseFreq: 392.00, fineTune: 0, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.25, overtoneGain3: 0.18, attack: 0.002, decay: 1.3, reverbSend: 0.3, compressorThreshold: -15 },
        { id: 6, label: 'Ab4', baseFreq: 415.30, fineTune: 5, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.25, overtoneGain3: 0.18, attack: 0.002, decay: 1.3, reverbSend: 0.3, compressorThreshold: -15 },
        { id: 7, label: 'Bb4', baseFreq: 466.16, fineTune: 0, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.25, overtoneGain3: 0.18, attack: 0.002, decay: 1.2, reverbSend: 0.3, compressorThreshold: -15 },
        { id: 8, label: 'C5', baseFreq: 523.25, fineTune: -1, volume: 0.85, overtoneRatio2: 2.0, overtoneRatio3: 3.0, overtoneGain2: 0.25, overtoneGain3: 0.18, attack: 0.002, decay: 1.1, reverbSend: 0.3, compressorThreshold: -15 }
      ]
    }
  },
  {
    id: 'pack_3',
    name: 'Cosmic Zenith Akebono',
    creator: 'Nova Labs',
    downloads: 2110,
    category: 'Cosmic',
    scale: 'Akebono',
    description: 'Highly ethereal and dreamy. Leverages heavy algorithmic reverb with custom tuned overtones for a cosmic bell-like space pad effect.',
    drumType: 'tongue',
    preset: {
      name: 'Cosmic Zenith Akebono',
      drumType: 'tongue',
      scaleName: 'Akebono',
      tempo: 90,
      reverbConfig: { roomSize: 0.96, damping: 0.15, mix: 0.7 },
      compressorConfig: { threshold: -26, ratio: 8.0, attack: 0.015, release: 0.35 },
      notes: [
        { id: 0, label: 'C3', baseFreq: 130.81, fineTune: 0, volume: 1.0, overtoneRatio2: 2.4, overtoneRatio3: 3.8, overtoneGain2: 0.6, overtoneGain3: 0.3, attack: 0.005, decay: 4.8, reverbSend: 0.75, compressorThreshold: -20 },
        { id: 1, label: 'D3', baseFreq: 146.83, fineTune: 0, volume: 0.85, overtoneRatio2: 2.4, overtoneRatio3: 3.8, overtoneGain2: 0.5, overtoneGain3: 0.25, attack: 0.005, decay: 4.5, reverbSend: 0.65, compressorThreshold: -20 },
        { id: 2, label: 'Eb3', baseFreq: 155.56, fineTune: 0, volume: 0.85, overtoneRatio2: 2.4, overtoneRatio3: 3.8, overtoneGain2: 0.5, overtoneGain3: 0.25, attack: 0.005, decay: 4.4, reverbSend: 0.65, compressorThreshold: -20 },
        { id: 3, label: 'G3', baseFreq: 196.00, fineTune: 0, volume: 0.85, overtoneRatio2: 2.4, overtoneRatio3: 3.8, overtoneGain2: 0.5, overtoneGain3: 0.25, attack: 0.005, decay: 4.1, reverbSend: 0.65, compressorThreshold: -20 },
        { id: 4, label: 'Ab3', baseFreq: 207.65, fineTune: 0, volume: 0.85, overtoneRatio2: 2.4, overtoneRatio3: 3.8, overtoneGain2: 0.5, overtoneGain3: 0.25, attack: 0.005, decay: 4.0, reverbSend: 0.65, compressorThreshold: -20 },
        { id: 5, label: 'C4', baseFreq: 261.63, fineTune: 0, volume: 0.85, overtoneRatio2: 2.4, overtoneRatio3: 3.8, overtoneGain2: 0.5, overtoneGain3: 0.25, attack: 0.005, decay: 3.8, reverbSend: 0.6, compressorThreshold: -20 },
        { id: 6, label: 'D4', baseFreq: 293.66, fineTune: 0, volume: 0.85, overtoneRatio2: 2.4, overtoneRatio3: 3.8, overtoneGain2: 0.5, overtoneGain3: 0.25, attack: 0.005, decay: 3.6, reverbSend: 0.6, compressorThreshold: -20 },
        { id: 7, label: 'Eb4', baseFreq: 311.13, fineTune: 0, volume: 0.85, overtoneRatio2: 2.4, overtoneRatio3: 3.8, overtoneGain2: 0.5, overtoneGain3: 0.25, attack: 0.005, decay: 3.5, reverbSend: 0.6, compressorThreshold: -20 },
        { id: 8, label: 'G4', baseFreq: 392.00, fineTune: 0, volume: 0.85, overtoneRatio2: 2.4, overtoneRatio3: 3.8, overtoneGain2: 0.5, overtoneGain3: 0.25, attack: 0.005, decay: 3.2, reverbSend: 0.6, compressorThreshold: -20 }
      ]
    }
  },
  {
    id: 'pack_4',
    name: 'Zen Temple Gongs',
    creator: 'Master Kenji',
    downloads: 1850,
    category: 'Traditional',
    scale: 'Akebono',
    description: 'Deep, heavy gong-like resonance. Slow decay, warm low-end weight, and vintage organic compression.',
    drumType: 'tongue',
    preset: {
      name: 'Zen Temple Gongs',
      drumType: 'tongue',
      scaleName: 'Akebono',
      tempo: 80,
      reverbConfig: { roomSize: 0.9, damping: 0.35, mix: 0.45 },
      compressorConfig: { threshold: -20, ratio: 5.0, attack: 0.012, release: 0.3 },
      notes: [
        { id: 0, label: 'C3', baseFreq: 130.81, fineTune: -5, volume: 1.0, overtoneRatio2: 2.38, overtoneRatio3: 3.75, overtoneGain2: 0.55, overtoneGain3: 0.28, attack: 0.008, decay: 5.2, reverbSend: 0.55, compressorThreshold: -15 },
        { id: 1, label: 'D3', baseFreq: 146.83, fineTune: -4, volume: 0.85, overtoneRatio2: 2.38, overtoneRatio3: 3.75, overtoneGain2: 0.48, overtoneGain3: 0.22, attack: 0.008, decay: 4.8, reverbSend: 0.45, compressorThreshold: -15 },
        { id: 2, label: 'Eb3', baseFreq: 155.56, fineTune: -3, volume: 0.85, overtoneRatio2: 2.38, overtoneRatio3: 3.75, overtoneGain2: 0.48, overtoneGain3: 0.22, attack: 0.008, decay: 4.7, reverbSend: 0.45, compressorThreshold: -15 },
        { id: 3, label: 'G3', baseFreq: 196.00, fineTune: -2, volume: 0.85, overtoneRatio2: 2.38, overtoneRatio3: 3.75, overtoneGain2: 0.48, overtoneGain3: 0.22, attack: 0.008, decay: 4.5, reverbSend: 0.45, compressorThreshold: -15 },
        { id: 4, label: 'Ab3', baseFreq: 207.65, fineTune: -1, volume: 0.85, overtoneRatio2: 2.38, overtoneRatio3: 3.75, overtoneGain2: 0.48, overtoneGain3: 0.22, attack: 0.008, decay: 4.4, reverbSend: 0.45, compressorThreshold: -15 },
        { id: 5, label: 'C4', baseFreq: 261.63, fineTune: 0, volume: 0.85, overtoneRatio2: 2.38, overtoneRatio3: 3.75, overtoneGain2: 0.48, overtoneGain3: 0.22, attack: 0.008, decay: 4.2, reverbSend: 0.4, compressorThreshold: -15 },
        { id: 6, label: 'D4', baseFreq: 293.66, fineTune: 1, volume: 0.85, overtoneRatio2: 2.38, overtoneRatio3: 3.75, overtoneGain2: 0.48, overtoneGain3: 0.22, attack: 0.008, decay: 4.0, reverbSend: 0.4, compressorThreshold: -15 },
        { id: 7, label: 'Eb4', baseFreq: 311.13, fineTune: 2, volume: 0.85, overtoneRatio2: 2.38, overtoneRatio3: 3.75, overtoneGain2: 0.48, overtoneGain3: 0.22, attack: 0.008, decay: 3.9, reverbSend: 0.4, compressorThreshold: -15 },
        { id: 8, label: 'G4', baseFreq: 392.00, fineTune: 3, volume: 0.85, overtoneRatio2: 2.38, overtoneRatio3: 3.75, overtoneGain2: 0.48, overtoneGain3: 0.22, attack: 0.008, decay: 3.6, reverbSend: 0.4, compressorThreshold: -15 }
      ]
    }
  }
];
