import { component$, useStore, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { AutomationTarget, LfoState } from "../../lib/types";
import { engine } from "../../audio/engine";

const MOD_TARGETS: AutomationTarget[] = [
  { id: "reverbMix", name: "Reverb Wet Mix", paramPath: "reverbMix" },
  {
    id: "reverbRoomSize",
    name: "Resonant Room Size",
    paramPath: "reverbRoomSize",
  },
  {
    id: "compressorThreshold",
    name: "Compressor Threshold",
    paramPath: "compressorThreshold",
  },
  { id: "globalDecay", name: "Global Note Decays", paramPath: "globalDecay" },
  {
    id: "overtoneRatio",
    name: "Overtone Pitch Vibrato",
    paramPath: "overtoneRatio",
  },
];

export const AutomationPanel = component$(() => {
  const lfo = useStore<LfoState>({ ...engine.lfoState });
  const canvasRef = useSignal<HTMLCanvasElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup, track }) => {
    track(() => lfo.enabled);
    track(() => lfo.frequency);
    track(() => lfo.depth);
    track(() => lfo.waveform);

    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;
    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      if (lfo.enabled) {
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        phase += 0.012 * lfo.frequency;
        if (phase > 1) phase -= 1;
        for (let i = 0; i < canvas.width; i++) {
          const evalPhase = (i / canvas.width) * 2 + phase;
          const p = evalPhase % 1;
          let val = 0;
          if (lfo.waveform === "sine") val = Math.sin(p * Math.PI * 2);
          else if (lfo.waveform === "triangle")
            val = p < 0.5 ? p * 4 - 1 : 3 - p * 4;
          else val = p * 2 - 1;
          const y =
            canvas.height / 2 - val * lfo.depth * (canvas.height / 2.3);
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
      frame = requestAnimationFrame(render);
    };
    render();
    cleanup(() => cancelAnimationFrame(frame));
  });

  return (
    <div class="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-6 shadow-xl">
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1 space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-100">
                Automated Parameter LFO
              </h2>
              <p class="text-xs text-slate-400">
                Map low-frequency oscillations to expand tone depth
              </p>
            </div>
            <button
              type="button"
              onClick$={() => {
                lfo.enabled = !lfo.enabled;
                engine.lfoState = { ...lfo };
              }}
              class={[
                "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                lfo.enabled
                  ? "bg-amber-500 text-zinc-950 border-amber-400"
                  : "bg-zinc-900 text-slate-400 border-zinc-800",
              ].join(" ")}
            >
              {lfo.enabled ? "ON" : "OFF"}
            </button>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-mono text-slate-400">
              Modulation Destination
            </label>
            <select
              value={lfo.target}
              onChange$={(_, el) => {
                lfo.target = el.value;
                engine.lfoState = { ...lfo };
              }}
              class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              {MOD_TARGETS.map((target) => (
                <option key={target.id} value={target.id}>
                  {target.name}
                </option>
              ))}
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-mono text-slate-400">
              Oscillator Waveform
            </label>
            <div class="grid grid-cols-3 gap-2">
              {(["sine", "triangle", "sawtooth"] as const).map((wave) => (
                <button
                  key={wave}
                  type="button"
                  onClick$={() => {
                    lfo.waveform = wave;
                    engine.lfoState = { ...lfo };
                  }}
                  class={[
                    "py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border",
                    lfo.waveform === wave
                      ? "bg-amber-500/10 border-amber-500 text-amber-500"
                      : "bg-zinc-900 border-zinc-800 text-slate-400",
                  ].join(" ")}
                >
                  {wave}
                </button>
              ))}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-mono">
                <span class="text-slate-400">Speed (Hz)</span>
                <span class="text-amber-500 font-bold">
                  {lfo.frequency.toFixed(2)} Hz
                </span>
              </div>
              <input
                type="range"
                min={0.05}
                max={12}
                step={0.05}
                value={lfo.frequency}
                onInput$={(_, el) => {
                  lfo.frequency = Number(el.value);
                  engine.lfoState = { ...lfo };
                }}
                class="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-mono">
                <span class="text-slate-400">Mod Depth</span>
                <span class="text-amber-500 font-bold">
                  {(lfo.depth * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={lfo.depth}
                onInput$={(_, el) => {
                  lfo.depth = Number(el.value);
                  engine.lfoState = { ...lfo };
                }}
                class="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col justify-between">
          <div class="space-y-1">
            <span class="text-xs font-mono text-slate-400">
              Real-Time Oscillation Path
            </span>
            <div class="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950 p-1">
              <canvas
                ref={canvasRef}
                width={360}
                height={150}
                class="w-full h-[150px] rounded-lg"
              />
            </div>
          </div>
          <p class="mt-4 text-[10px] font-mono text-slate-500">
            Active parameters fluctuate around current preset values based on
            this LFO curve.
          </p>
        </div>
      </div>
    </div>
  );
});
