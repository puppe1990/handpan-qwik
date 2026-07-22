import { describe, expect, it } from "vitest";
import { AudioEngine } from "./engine";

describe("AudioEngine frequency API", () => {
  it("buildFrequencyVoice resolves handpan params for Hz", () => {
    const eng = new AudioEngine();
    eng.drumType = "handpan";
    const voice = eng.buildFrequencyVoice(293.66);
    expect(voice.frequency).toBeCloseTo(293.66, 2);
    expect(voice.label).toBe("D4");
    expect(voice.oscType).toBe("sine");
    expect(voice.overtoneRatio2).toBe(2);
  });

  it("buildFrequencyVoice follows tongue drum timbre", () => {
    const eng = new AudioEngine();
    eng.drumType = "tongue";
    const voice = eng.buildFrequencyVoice(196);
    expect(voice.oscType).toBe("triangle");
    expect(voice.overtoneRatio2).toBe(2.4);
    expect(voice.decay).toBeGreaterThan(2);
  });

  it("triggerFrequency returns voice config and is safe before AudioContext init", () => {
    const eng = new AudioEngine();
    // No user gesture / no real browser AudioContext in Node —
    // method must not throw; returns resolved voice for UI feedback.
    const voice = eng.triggerFrequency(440, 0.9);
    expect(voice).not.toBeNull();
    expect(voice!.label).toBe("A4");
    expect(voice!.velocity).toBeCloseTo(0.9);
  });

  it("triggerFrequency rejects unusable frequencies by clamping", () => {
    const eng = new AudioEngine();
    const voice = eng.triggerFrequency(NaN);
    expect(voice!.frequency).toBe(440);
  });
});
