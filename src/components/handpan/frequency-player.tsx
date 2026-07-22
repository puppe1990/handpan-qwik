import { component$, useStore } from "@builder.io/qwik";
import { engine } from "../../audio/engine";
import {
  noteNameToFrequency,
  frequencyToNoteName,
} from "../../audio/frequency";

const PRESETS: { label: string; hz: number }[] = [
  { label: "C3", hz: 130.81 },
  { label: "D3", hz: 146.83 },
  { label: "A3", hz: 220.0 },
  { label: "C4", hz: 261.63 },
  { label: "D4", hz: 293.66 },
  { label: "E4", hz: 329.63 },
  { label: "G4", hz: 392.0 },
  { label: "A4", hz: 440.0 },
  { label: "C5", hz: 523.25 },
];

export const FrequencyPlayer = component$(() => {
  const state = useStore({
    hz: 440,
    noteInput: "A4",
    velocity: 0.85,
    lastLabel: "A4",
    lastHz: 440,
    played: false,
  });

  return (
    <div class="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-6 shadow-xl space-y-6">
      <div>
        <h2 class="text-lg font-bold text-slate-100 tracking-wide">
          Frequency Player
        </h2>
        <p class="text-xs text-slate-400 mt-1">
          Play pure handpan/tongue synthesis at any frequency in Hz — not only
          fixed pad notes.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs font-mono">
              <span class="text-slate-400">Frequency (Hz)</span>
              <span class="text-cyan-400 font-bold">
                {state.hz.toFixed(2)} Hz
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={1200}
              step={0.1}
              value={state.hz}
              onInput$={(_, el) => {
                const hz = Number(el.value);
                state.hz = hz;
                state.noteInput = frequencyToNoteName(hz);
              }}
              class="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <input
              type="number"
              min={20}
              max={5000}
              step={0.01}
              value={state.hz}
              onInput$={(_, el) => {
                const hz = Number(el.value);
                if (!Number.isFinite(hz)) return;
                state.hz = hz;
                state.noteInput = frequencyToNoteName(hz);
              }}
              class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm font-mono text-cyan-400 font-bold"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-mono text-slate-400">
              Note name → Hz
            </label>
            <div class="flex gap-2">
              <input
                type="text"
                value={state.noteInput}
                placeholder="e.g. D3, F#4, Bb3"
                onInput$={(_, el) => {
                  state.noteInput = el.value;
                }}
                class="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200"
              />
              <button
                type="button"
                onClick$={() => {
                  const hz = noteNameToFrequency(state.noteInput);
                  if (hz == null) {
                    alert("Invalid note name. Try A4, C#4, or Db3.");
                    return;
                  }
                  state.hz = Math.round(hz * 100) / 100;
                }}
                class="px-3 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-200"
              >
                Apply
              </button>
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="flex justify-between text-xs font-mono">
              <span class="text-slate-400">Velocity</span>
              <span class="text-cyan-400 font-bold">
                {(state.velocity * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.01}
              value={state.velocity}
              onInput$={(_, el) => {
                state.velocity = Number(el.value);
              }}
              class="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <button
            type="button"
            onClick$={() => {
              engine.init();
              const voice = engine.triggerFrequency(state.hz, state.velocity);
              state.lastLabel = voice.label;
              state.lastHz = voice.frequency;
              state.played = true;
            }}
            class="w-full py-3 rounded-xl text-sm font-bold bg-cyan-400 hover:bg-cyan-300 text-zinc-950 shadow-md transition-all"
          >
            Play {state.hz.toFixed(1)} Hz
          </button>

          {state.played && (
            <p class="text-[11px] font-mono text-slate-400 text-center">
              Last voice:{" "}
              <span class="text-cyan-400 font-bold">{state.lastLabel}</span>
              {" · "}
              {state.lastHz.toFixed(2)} Hz
            </p>
          )}
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-mono uppercase tracking-widest text-slate-500">
            Quick presets
          </h3>
          <div class="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick$={() => {
                  state.hz = p.hz;
                  state.noteInput = p.label;
                  engine.init();
                  const voice = engine.triggerFrequency(p.hz, state.velocity);
                  state.lastLabel = voice.label;
                  state.lastHz = voice.frequency;
                  state.played = true;
                }}
                class="py-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all flex flex-col items-center gap-0.5"
              >
                <span class="text-sm font-bold font-mono text-slate-100">
                  {p.label}
                </span>
                <span class="text-[10px] font-mono text-slate-500">
                  {p.hz.toFixed(1)} Hz
                </span>
              </button>
            ))}
          </div>
          <p class="text-[10px] font-mono text-slate-500 leading-relaxed pt-2">
            Timbre follows current instrument (Handpan / Tongue). Overtones and
            strike noise use the same physical model as the pads.
          </p>
        </div>
      </div>
    </div>
  );
});
