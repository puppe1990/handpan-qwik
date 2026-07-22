import { describe, expect, it } from "vitest";
import { SCALE_PRESETS } from "./scales";

describe("SCALE_PRESETS", () => {
  it("includes the classic Celtic Minor scale", () => {
    const celtic = SCALE_PRESETS.find((s) => s.name === "Celtic Minor");
    expect(celtic).toBeDefined();
    expect(celtic!.frequencies).toHaveLength(9);
    expect(celtic!.notes).toHaveLength(8);
  });

  it("has unique names and 9 frequencies each", () => {
    const names = SCALE_PRESETS.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);

    for (const scale of SCALE_PRESETS) {
      expect(scale.frequencies).toHaveLength(9);
      expect(scale.frequencies.every((f) => f > 0)).toBe(true);
      expect(scale.ding.length).toBeGreaterThan(0);
    }
  });
});
