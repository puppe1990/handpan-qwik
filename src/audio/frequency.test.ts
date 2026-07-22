import { describe, expect, it } from "vitest";
import {
  clampFrequency,
  frequencyToNoteName,
  noteNameToFrequency,
  resolveFrequencyVoice,
} from "./frequency";

describe("clampFrequency", () => {
  it("returns finite frequency within audible musical range", () => {
    expect(clampFrequency(440)).toBe(440);
    expect(clampFrequency(10)).toBe(20);
    expect(clampFrequency(20000)).toBe(5000);
  });

  it("rejects non-finite values by falling back to A4", () => {
    expect(clampFrequency(NaN)).toBe(440);
    expect(clampFrequency(Infinity)).toBe(440);
    expect(clampFrequency(-100)).toBe(20);
  });
});

describe("noteNameToFrequency", () => {
  it("converts standard note names to Hz (A4=440)", () => {
    expect(noteNameToFrequency("A4")).toBeCloseTo(440, 1);
    expect(noteNameToFrequency("C4")).toBeCloseTo(261.63, 1);
    expect(noteNameToFrequency("D3")).toBeCloseTo(146.83, 1);
  });

  it("supports sharps and flats", () => {
    expect(noteNameToFrequency("C#4")).toBeCloseTo(277.18, 1);
    expect(noteNameToFrequency("Db4")).toBeCloseTo(277.18, 1);
  });

  it("returns null for invalid names", () => {
    expect(noteNameToFrequency("")).toBeNull();
    expect(noteNameToFrequency("H9")).toBeNull();
    expect(noteNameToFrequency("not-a-note")).toBeNull();
  });
});

describe("frequencyToNoteName", () => {
  it("maps frequency back to nearest note name", () => {
    expect(frequencyToNoteName(440)).toBe("A4");
    expect(frequencyToNoteName(261.63)).toBe("C4");
  });
});

describe("resolveFrequencyVoice", () => {
  it("builds handpan voice params for a frequency", () => {
    const voice = resolveFrequencyVoice(220, "handpan");
    expect(voice.frequency).toBe(220);
    expect(voice.overtoneRatio2).toBe(2.0);
    expect(voice.overtoneRatio3).toBe(3.0);
    expect(voice.oscType).toBe("sine");
    expect(voice.attack).toBeGreaterThan(0);
    expect(voice.decay).toBeGreaterThan(0);
  });

  it("builds tongue drum voice params with longer decay and different ratios", () => {
    const voice = resolveFrequencyVoice(220, "tongue");
    expect(voice.overtoneRatio2).toBe(2.4);
    expect(voice.overtoneRatio3).toBe(3.8);
    expect(voice.oscType).toBe("triangle");
    expect(voice.decay).toBeGreaterThan(
      resolveFrequencyVoice(220, "handpan").decay,
    );
  });

  it("clamps frequency and accepts velocity/envelope overrides", () => {
    const voice = resolveFrequencyVoice(5, "handpan", {
      velocity: 0.5,
      attack: 0.01,
      decay: 1.2,
      volume: 0.7,
    });
    expect(voice.frequency).toBe(20);
    expect(voice.velocity).toBe(0.5);
    expect(voice.attack).toBe(0.01);
    expect(voice.decay).toBe(1.2);
    expect(voice.volume).toBe(0.7);
  });

  it("labels the nearest musical note for UI display", () => {
    const voice = resolveFrequencyVoice(440, "handpan");
    expect(voice.label).toBe("A4");
  });
});
