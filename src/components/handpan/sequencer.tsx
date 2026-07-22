import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { NoteConfig } from "../../lib/types";
import { engine } from "../../audio/engine";
import { historyManager } from "../../audio/history";
import { DEMO_SONGS } from "../../lib/demo-songs";
import { appUi } from "../../lib/app-state";

interface SequencerProps {
  notes: NoteConfig[];
}

export const Sequencer = component$<SequencerProps>(({ notes }) => {
  const state = useStore({
    bpm: engine.sequencerState.bpm,
    stepsCount: engine.sequencerState.stepsCount,
    isPlaying: engine.sequencerState.isPlaying,
    activeStep: engine.sequencerState.activeStep,
    grid: JSON.parse(JSON.stringify(engine.sequencerState.grid)) as Record<
      number,
      boolean[]
    >,
    showClearConfirm: false,
    selectedSongId: DEMO_SONGS[0]?.id || "forest-pulse",
    loadedSongName: "" as string,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    engine.onSequencerStep = (step) => {
      state.activeStep = step;
      state.isPlaying = engine.sequencerState.isPlaying;
    };
    cleanup(() => {
      engine.onSequencerStep = null;
    });
  });

  return (
    <div class="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Demo songs library */}
      <div class="mb-6 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-bold text-emerald-400 tracking-wide">
              Demo Songs
            </h3>
            <p class="text-[11px] text-slate-400 mt-0.5">
              Load a composed handpan piece into the sequencer and press play
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <select
              value={state.selectedSongId}
              onChange$={(_, el) => {
                state.selectedSongId = el.value;
              }}
              class="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 min-w-[160px]"
            >
              {DEMO_SONGS.map((song) => (
                <option key={song.id} value={song.id}>
                  {`${song.name} · ${song.bpm} BPM`}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick$={() => {
                historyManager.saveState();
                engine.init();
                const ok = engine.loadDemoSong(state.selectedSongId, false);
                if (!ok) return;
                state.bpm = engine.sequencerState.bpm;
                state.stepsCount = engine.sequencerState.stepsCount;
                state.grid = JSON.parse(
                  JSON.stringify(engine.sequencerState.grid),
                );
                state.isPlaying = false;
                state.activeStep = -1;
                const song = DEMO_SONGS.find(
                  (s) => s.id === state.selectedSongId,
                );
                state.loadedSongName = song?.name || "";
                appUi.bump();
              }}
              class="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-200 transition-all"
            >
              Load
            </button>
            <button
              type="button"
              onClick$={() => {
                historyManager.saveState();
                engine.init();
                const ok = engine.loadDemoSong(state.selectedSongId, true);
                if (!ok) return;
                state.bpm = engine.sequencerState.bpm;
                state.stepsCount = engine.sequencerState.stepsCount;
                state.grid = JSON.parse(
                  JSON.stringify(engine.sequencerState.grid),
                );
                state.isPlaying = true;
                const song = DEMO_SONGS.find(
                  (s) => s.id === state.selectedSongId,
                );
                state.loadedSongName = song?.name || "";
                appUi.bump();
              }}
              class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-500 text-zinc-950 shadow-md transition-all"
            >
              Load & Play ▶
            </button>
          </div>
        </div>
        {(() => {
          const song = DEMO_SONGS.find((s) => s.id === state.selectedSongId);
          if (!song) return null;
          return (
            <p class="text-[11px] text-slate-400 leading-relaxed">
              <span class="text-slate-300 font-semibold">{song.name}</span>
              {" — "}
              {song.description}{" "}
              <span class="font-mono text-slate-500">
                ({song.scaleName} · {song.drumType} · {song.stepsCount} steps)
              </span>
              {state.loadedSongName === song.name && (
                <span class="ml-2 text-emerald-400 font-semibold">
                  ● Loaded
                </span>
              )}
            </p>
          );
        })()}
      </div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-900">
        <div>
          <h2 class="text-lg font-bold text-slate-100 tracking-wide">
            Rhythm Step Sequencer
          </h2>
          <p class="text-xs text-slate-400">
            Program, synchronize, and play customizable drum loops
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <span class="text-xs text-slate-400 font-mono">BPM:</span>
            <input
              type="number"
              value={state.bpm}
              onFocus$={() => historyManager.saveState()}
              onInput$={(_, el) => {
                const bounded = Math.max(40, Math.min(240, Number(el.value)));
                state.bpm = bounded;
                engine.setSequencerBpm(bounded);
              }}
              class="w-14 bg-transparent border-none text-slate-100 text-sm font-bold focus:outline-none font-mono text-center"
            />
            <input
              type="range"
              min={50}
              max={200}
              value={state.bpm}
              onPointerDown$={() => historyManager.saveState()}
              onInput$={(_, el) => {
                const bounded = Number(el.value);
                state.bpm = bounded;
                engine.setSequencerBpm(bounded);
              }}
              class="w-20 accent-emerald-500 h-1 cursor-pointer"
            />
          </div>

          <div class="flex rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 p-0.5">
            {[8, 16, 32].map((num) => (
              <button
                key={num}
                type="button"
                onClick$={() => {
                  historyManager.saveState();
                  state.stepsCount = num;
                  engine.setSequencerStepsCount(num);
                  state.grid = JSON.parse(
                    JSON.stringify(engine.sequencerState.grid),
                  );
                }}
                class={[
                  "px-3 py-1 text-xs font-mono transition-all",
                  state.stepsCount === num
                    ? "bg-emerald-500 text-zinc-950 font-bold rounded-lg"
                    : "text-slate-400 hover:text-slate-100",
                ].join(" ")}
              >
                {num}
              </button>
            ))}
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              onClick$={() => {
                if (state.isPlaying) {
                  engine.stopSequencer();
                  state.isPlaying = false;
                  state.activeStep = -1;
                } else {
                  engine.startSequencer();
                  state.isPlaying = true;
                }
              }}
              class={[
                "flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md",
                state.isPlaying
                  ? "bg-rose-500 hover:bg-rose-600 text-slate-100"
                  : "bg-emerald-400 hover:bg-emerald-500 text-zinc-950",
              ].join(" ")}
            >
              {state.isPlaying ? "Stop" : "Start"}
            </button>

            <button
              type="button"
              title="Generate Random Rhythm"
              onClick$={() => {
                historyManager.saveState();
                const updated: Record<number, boolean[]> = {};
                Object.keys(state.grid).forEach((key) => {
                  const noteId = Number(key);
                  updated[noteId] = Array(state.stepsCount)
                    .fill(false)
                    .map((_, i) => {
                      const density = noteId === 0 ? 0.15 : 0.22;
                      const trigger = Math.random() < density;
                      engine.setSequencerGrid(noteId, i, trigger);
                      return trigger;
                    });
                });
                state.grid = updated;
              }}
              class="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-slate-300 hover:text-emerald-400 transition-all text-xs font-bold"
            >
              🎲
            </button>

            <button
              type="button"
              onClick$={() => {
                state.showClearConfirm = true;
              }}
              class="flex items-center gap-2 p-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-slate-300 hover:text-rose-400 transition-all text-xs font-semibold"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto custom-scrollbar">
        <div class="min-w-[640px] flex flex-col gap-2">
          <div class="flex items-center mb-1">
            <div class="w-24 text-right pr-4 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              Beats
            </div>
            <div class="flex-1 flex justify-between">
              {Array(state.stepsCount)
                .fill(0)
                .map((_, idx) => {
                  const isBeatStart = idx % 4 === 0;
                  return (
                    <div
                      key={idx}
                      class={[
                        "flex-1 text-center font-mono text-[10px] transition-all py-1",
                        state.activeStep === idx
                          ? "text-emerald-400 font-bold scale-110"
                          : isBeatStart
                            ? "text-slate-400 font-bold"
                            : "text-slate-600",
                      ].join(" ")}
                    >
                      {isBeatStart ? `${idx / 4 + 1}` : `.${idx % 4}`}
                    </div>
                  );
                })}
            </div>
          </div>

          {notes.map((note) => (
            <div key={note.id} class="flex items-center h-8 group">
              <button
                type="button"
                onClick$={() => engine.triggerNote(note.id)}
                class="w-24 text-left font-mono text-xs font-semibold px-2 py-1 rounded bg-zinc-900/40 border border-zinc-800/40 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 transition-all flex justify-between items-center mr-4"
              >
                <span>{note.id === 0 ? "Ding" : `T${note.id}`}</span>
                <span class="text-[10px] opacity-60 text-slate-400">
                  {note.label.replace(" (Ding)", "")}
                </span>
              </button>

              <div class="flex-1 flex gap-1.5 h-full">
                {Array(state.stepsCount)
                  .fill(0)
                  .map((_, stepIdx) => {
                    const isActive = state.grid[note.id]?.[stepIdx] || false;
                    const isCurrent = state.activeStep === stepIdx;
                    const isFourth = stepIdx % 4 === 0;
                    return (
                      <button
                        key={stepIdx}
                        type="button"
                        title={`Trigger ${note.label} at step ${stepIdx + 1}`}
                        onClick$={() => {
                          historyManager.saveState();
                          const currentVal =
                            state.grid[note.id]?.[stepIdx] || false;
                          const next = !currentVal;
                          if (!state.grid[note.id]) {
                            state.grid[note.id] = Array(state.stepsCount).fill(
                              false,
                            );
                          }
                          state.grid[note.id][stepIdx] = next;
                          // reassign for reactivity
                          state.grid = { ...state.grid };
                          engine.setSequencerGrid(note.id, stepIdx, next);
                        }}
                        class={[
                          "flex-1 h-full rounded transition-all focus:outline-none",
                          isActive
                            ? isCurrent
                              ? "bg-amber-400 scale-95 shadow-lg shadow-amber-500/20"
                              : "bg-emerald-400 hover:bg-emerald-300"
                            : isCurrent
                              ? "bg-zinc-700/60 ring-1 ring-emerald-400/40"
                              : isFourth
                                ? "bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/30"
                                : "bg-zinc-900/60 hover:bg-zinc-800/60 border border-zinc-900/20",
                        ].join(" ")}
                      />
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>Click note handles to audition sounds.</span>
        <div class="flex gap-4">
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 rounded bg-emerald-400" /> Active Step
          </span>
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 rounded bg-zinc-800" /> Beat Start
          </span>
        </div>
      </div>

      {state.showClearConfirm && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div class="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h3 class="text-lg font-bold text-slate-100 mb-2">
              Clear Sequencer Patterns?
            </h3>
            <p class="text-sm text-slate-400 mb-6">
              This will wipe all active programmed patterns for all notes in the
              sequencer.
            </p>
            <div class="flex justify-end gap-3">
              <button
                type="button"
                onClick$={() => {
                  state.showClearConfirm = false;
                }}
                class="px-4 py-2 rounded-xl text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-slate-200 border border-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick$={() => {
                  historyManager.saveState();
                  const updated: Record<number, boolean[]> = {};
                  Object.keys(state.grid).forEach((key) => {
                    const noteId = Number(key);
                    updated[noteId] = Array(state.stepsCount).fill(false);
                    for (let s = 0; s < state.stepsCount; s++) {
                      engine.setSequencerGrid(noteId, s, false);
                    }
                  });
                  state.grid = updated;
                  state.showClearConfirm = false;
                }}
                class="px-4 py-2 rounded-xl text-sm font-bold bg-rose-500 hover:bg-rose-600 text-slate-100"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
