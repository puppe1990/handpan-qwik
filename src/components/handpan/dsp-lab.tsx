import { component$, useStore, useTask$ } from "@builder.io/qwik";
import type { NoteConfig } from "../../lib/types";
import { engine } from "../../audio/engine";
import { historyManager } from "../../audio/history";

interface DspLabProps {
  notes: NoteConfig[];
}

export const DspLab = component$<DspLabProps>((props) => {
  const state = useStore({
    selectedNoteId: 0,
    notes: props.notes.map((n) => ({ ...n })) as NoteConfig[],
    reverbMix: engine.reverbMix,
    reverbRoomSize: engine.reverbRoomSize,
    reverbDamping: engine.reverbDamping,
    compThreshold: engine.compressorThreshold,
    compRatio: engine.compressorRatio,
    compAttack: engine.compressorAttack,
    compRelease: engine.compressorRelease,
  });

  useTask$(({ track }) => {
    track(() => props.notes);
    state.notes = props.notes.map((n) => ({ ...n }));
    state.reverbMix = engine.reverbMix;
    state.reverbRoomSize = engine.reverbRoomSize;
    state.reverbDamping = engine.reverbDamping;
    state.compThreshold = engine.compressorThreshold;
    state.compRatio = engine.compressorRatio;
    state.compAttack = engine.compressorAttack;
    state.compRelease = engine.compressorRelease;
  });

  const selectedNote = state.notes[state.selectedNoteId] || state.notes[0];

  return (
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-6 shadow-xl">
        <h2 class="text-base font-bold text-slate-100 mb-1">
          Schroeder Algorithmic Reverb
        </h2>
        <p class="text-[11px] text-slate-400 mb-6">
          Simulate spherical iron plate resonance
        </p>
        <div class="space-y-5">
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs font-mono">
              <span class="text-slate-400">Reverb Wet Mix</span>
              <span class="text-purple-400 font-bold">
                {(state.reverbMix * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={state.reverbMix}
              onPointerDown$={() => historyManager.saveState()}
              onInput$={(_, el) => {
                const v = Number(el.value);
                state.reverbMix = v;
                engine.reverbMix = v;
                engine.updateReverbParams();
              }}
              class="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs font-mono">
              <span class="text-slate-400">Resonant Room Size</span>
              <span class="text-purple-400 font-bold">
                {(state.reverbRoomSize * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={0.98}
              step={0.01}
              value={state.reverbRoomSize}
              onPointerDown$={() => historyManager.saveState()}
              onInput$={(_, el) => {
                const v = Number(el.value);
                state.reverbRoomSize = v;
                engine.reverbRoomSize = v;
                engine.updateReverbParams();
              }}
              class="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs font-mono">
              <span class="text-slate-400">High-Freq Damping</span>
              <span class="text-purple-400 font-bold">
                {(state.reverbDamping * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={state.reverbDamping}
              onPointerDown$={() => historyManager.saveState()}
              onInput$={(_, el) => {
                const v = Number(el.value);
                state.reverbDamping = v;
                engine.reverbDamping = v;
                engine.updateReverbParams();
              }}
              class="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      </div>

      <div class="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-6 shadow-xl">
        <h2 class="text-base font-bold text-slate-100 mb-1">
          Dynamics Compressor / Glue
        </h2>
        <p class="text-[11px] text-slate-400 mb-6">
          Warm peaks, sustain notes, glue the mix
        </p>
        <div class="space-y-5">
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs font-mono">
              <span class="text-slate-400">Threshold</span>
              <span class="text-emerald-400 font-bold">
                {state.compThreshold} dB
              </span>
            </div>
            <input
              type="range"
              min={-60}
              max={-5}
              step={1}
              value={state.compThreshold}
              onPointerDown$={() => historyManager.saveState()}
              onInput$={(_, el) => {
                const v = Number(el.value);
                state.compThreshold = v;
                engine.compressorThreshold = v;
                engine.updateCompressor();
              }}
              class="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs font-mono">
              <span class="text-slate-400">Ratio</span>
              <span class="text-emerald-400 font-bold">
                {state.compRatio}:1
              </span>
            </div>
            <input
              type="range"
              min={1.5}
              max={12}
              step={0.5}
              value={state.compRatio}
              onPointerDown$={() => historyManager.saveState()}
              onInput$={(_, el) => {
                const v = Number(el.value);
                state.compRatio = v;
                engine.compressorRatio = v;
                engine.updateCompressor();
              }}
              class="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <span class="text-[11px] text-slate-400 font-mono">Attack</span>
              <input
                type="number"
                step={0.005}
                min={0.001}
                max={0.2}
                value={state.compAttack}
                onFocus$={() => historyManager.saveState()}
                onInput$={(_, el) => {
                  const v = Number(el.value);
                  state.compAttack = v;
                  engine.compressorAttack = v;
                  engine.updateCompressor();
                }}
                class="w-full bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg text-xs font-mono text-slate-200"
              />
            </div>
            <div class="space-y-1.5">
              <span class="text-[11px] text-slate-400 font-mono">Release</span>
              <input
                type="number"
                step={0.01}
                min={0.02}
                max={1.0}
                value={state.compRelease}
                onFocus$={() => historyManager.saveState()}
                onInput$={(_, el) => {
                  const v = Number(el.value);
                  state.compRelease = v;
                  engine.compressorRelease = v;
                  engine.updateCompressor();
                }}
                class="w-full bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg text-xs font-mono text-slate-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-6 shadow-xl">
        {selectedNote && (
          <div>
            <h2 class="text-base font-bold text-slate-100 mb-1">
              Per-Note Synthesizer
            </h2>
            <p class="text-[11px] text-slate-400 mb-4">
              Tune overtones, envelopes & sends
            </p>

            <div class="flex flex-wrap gap-1 mb-5 bg-zinc-900/50 p-1 rounded-xl border border-zinc-900">
              {state.notes.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick$={() => {
                    state.selectedNoteId = n.id;
                    engine.triggerNote(n.id, 0.7);
                  }}
                  class={[
                    "flex-1 min-w-[28px] text-center py-1 text-[10px] font-mono font-bold rounded transition-all",
                    state.selectedNoteId === n.id
                      ? "bg-amber-400 text-zinc-950 shadow"
                      : "text-slate-400 hover:text-slate-200",
                  ].join(" ")}
                >
                  {n.id === 0 ? "D" : `T${n.id}`}
                </button>
              ))}
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3 pb-3 border-b border-zinc-900">
                <div>
                  <label class="text-[11px] font-mono text-slate-400">
                    Note Volume
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={selectedNote.volume}
                    onPointerDown$={() => historyManager.saveState()}
                    onInput$={(_, el) => {
                      const value = Number(el.value);
                      const id = state.selectedNoteId;
                      state.notes = state.notes.map((n) =>
                        n.id === id ? { ...n, volume: value } : n,
                      );
                      engine.notes = state.notes.map((n) => ({ ...n }));
                    }}
                    class="w-full accent-amber-500 h-1 mt-1"
                  />
                </div>
                <div>
                  <label class="text-[11px] font-mono text-slate-400">
                    Frequency (Hz)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={1200}
                    step={0.1}
                    value={selectedNote.baseFreq}
                    onFocus$={() => historyManager.saveState()}
                    onInput$={(_, el) => {
                      const value = Number(el.value);
                      const id = state.selectedNoteId;
                      state.notes = state.notes.map((n) =>
                        n.id === id ? { ...n, baseFreq: value } : n,
                      );
                      engine.notes = state.notes.map((n) => ({ ...n }));
                    }}
                    class="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-xs text-amber-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 pb-3 border-b border-zinc-900">
                <div>
                  <label class="text-[11px] font-mono text-slate-400">
                    Attack (s)
                  </label>
                  <input
                    type="range"
                    min={0.001}
                    max={0.3}
                    step={0.005}
                    value={selectedNote.attack}
                    onPointerDown$={() => historyManager.saveState()}
                    onInput$={(_, el) => {
                      const value = Number(el.value);
                      const id = state.selectedNoteId;
                      state.notes = state.notes.map((n) =>
                        n.id === id ? { ...n, attack: value } : n,
                      );
                      engine.notes = state.notes.map((n) => ({ ...n }));
                    }}
                    class="w-full accent-amber-500 h-1 mt-1"
                  />
                  <span class="text-[9px] font-mono text-slate-500">
                    {selectedNote.attack.toFixed(3)}s
                  </span>
                </div>
                <div>
                  <label class="text-[11px] font-mono text-slate-400">
                    Decay (s)
                  </label>
                  <input
                    type="range"
                    min={0.2}
                    max={6.0}
                    step={0.1}
                    value={selectedNote.decay}
                    onPointerDown$={() => historyManager.saveState()}
                    onInput$={(_, el) => {
                      const value = Number(el.value);
                      const id = state.selectedNoteId;
                      state.notes = state.notes.map((n) =>
                        n.id === id ? { ...n, decay: value } : n,
                      );
                      engine.notes = state.notes.map((n) => ({ ...n }));
                    }}
                    class="w-full accent-amber-500 h-1 mt-1"
                  />
                  <span class="text-[9px] font-mono text-slate-500">
                    {selectedNote.decay.toFixed(1)}s
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 pb-3 border-b border-zinc-900">
                <div>
                  <label class="text-[11px] font-mono text-slate-400">
                    Overtone 2 Ratio
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step={0.01}
                    value={selectedNote.overtoneRatio2}
                    onFocus$={() => historyManager.saveState()}
                    onInput$={(_, el) => {
                      const value = Number(el.value);
                      const id = state.selectedNoteId;
                      state.notes = state.notes.map((n) =>
                        n.id === id ? { ...n, overtoneRatio2: value } : n,
                      );
                      engine.notes = state.notes.map((n) => ({ ...n }));
                    }}
                    class="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-xs text-slate-200 font-mono mt-1"
                  />
                </div>
                <div>
                  <label class="text-[11px] font-mono text-slate-400">
                    Overtone 3 Ratio
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    step={0.01}
                    value={selectedNote.overtoneRatio3}
                    onFocus$={() => historyManager.saveState()}
                    onInput$={(_, el) => {
                      const value = Number(el.value);
                      const id = state.selectedNoteId;
                      state.notes = state.notes.map((n) =>
                        n.id === id ? { ...n, overtoneRatio3: value } : n,
                      );
                      engine.notes = state.notes.map((n) => ({ ...n }));
                    }}
                    class="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-xs text-slate-200 font-mono mt-1"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-mono text-slate-400">
                    Reverb Send
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={selectedNote.reverbSend}
                    onPointerDown$={() => historyManager.saveState()}
                    onInput$={(_, el) => {
                      const value = Number(el.value);
                      const id = state.selectedNoteId;
                      state.notes = state.notes.map((n) =>
                        n.id === id ? { ...n, reverbSend: value } : n,
                      );
                      engine.notes = state.notes.map((n) => ({ ...n }));
                    }}
                    class="w-full accent-amber-500 h-1 mt-1"
                  />
                </div>
                <div>
                  <label class="text-[11px] font-mono text-slate-400">
                    Fine Tune (Cents)
                  </label>
                  <input
                    type="range"
                    min={-100}
                    max={100}
                    step={1}
                    value={selectedNote.fineTune || 0}
                    onPointerDown$={() => historyManager.saveState()}
                    onInput$={(_, el) => {
                      const value = Number(el.value);
                      const id = state.selectedNoteId;
                      state.notes = state.notes.map((n) =>
                        n.id === id ? { ...n, fineTune: value } : n,
                      );
                      engine.notes = state.notes.map((n) => ({ ...n }));
                    }}
                    class="w-full accent-amber-500 h-1 mt-1"
                  />
                  <span class="text-[9px] font-mono text-slate-500">
                    {selectedNote.fineTune || 0} cents
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
