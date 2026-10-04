import { describe, expect, it } from "vitest";
import {
  DEMO_SONGS,
  getDemoSong,
  songPatternToGrid,
} from "./demo-songs";

describe("demo songs library", () => {
  it("exports at least one demo song", () => {
    expect(DEMO_SONGS.length).toBeGreaterThan(0);
  });

  it("finds a song by id", () => {
    const first = DEMO_SONGS[0];
    expect(getDemoSong(first.id)).toEqual(first);
    expect(getDemoSong("does-not-exist")).toBeUndefined();
  });

  it("expands patterns to full 9-row grids", () => {
    for (const song of DEMO_SONGS) {
      const grid = songPatternToGrid(song);
      expect(Object.keys(grid)).toHaveLength(9);
      for (let noteId = 0; noteId < 9; noteId++) {
        expect(grid[noteId]).toHaveLength(song.stepsCount);
        expect(grid[noteId].every((v) => typeof v === "boolean")).toBe(true);
      }
    }
  });

  it("marks only listed pattern steps as active", () => {
    const song = DEMO_SONGS[0];
    const grid = songPatternToGrid(song);
    for (const [noteIdStr, steps] of Object.entries(song.pattern)) {
      const noteId = Number(noteIdStr);
      const active = steps.filter((s) => s >= 0 && s < song.stepsCount);
      const hitCount = grid[noteId].filter(Boolean).length;
      expect(hitCount).toBe(active.length);
      for (const step of active) {
        expect(grid[noteId][step]).toBe(true);
      }
    }
  });

  it("keeps songs within valid bpm and step counts", () => {
    for (const song of DEMO_SONGS) {
      expect(song.bpm).toBeGreaterThanOrEqual(40);
      expect(song.bpm).toBeLessThanOrEqual(240);
      expect([16, 32]).toContain(song.stepsCount);
      expect(["handpan", "tongue"]).toContain(song.drumType);
    }
  });
});
