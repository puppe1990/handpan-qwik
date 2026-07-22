import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { engine } from "../../audio/engine";

declare global {
  interface Window {
    __handpanWavBlob?: Blob;
    __handpanRecTimer?: ReturnType<typeof setInterval>;
  }
}

export const Looper = component$(() => {
  const state = useStore({
    looperRecording: engine.looperRecording,
    looperPlaying: engine.looperPlaying,
    eventCount: engine.looperEvents.length,
    isWavRecording: false,
    recordingSeconds: 0,
    hasBlob: false,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const interval = setInterval(() => {
      state.eventCount = engine.looperEvents.length;
      state.looperRecording = engine.looperRecording;
      state.looperPlaying = engine.looperPlaying;
    }, 400);
    cleanup(() => {
      clearInterval(interval);
      if (window.__handpanRecTimer) {
        clearInterval(window.__handpanRecTimer);
        window.__handpanRecTimer = undefined;
      }
    });
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-100 tracking-wide mb-1">
            Dynamic MIDI Looper
          </h2>
          <p class="text-xs text-slate-400 mb-4">
            Overdub and layer multiple live taps flawlessly
          </p>
          <p class="text-sm text-slate-300 leading-relaxed mb-6">
            Press <strong>Record</strong> and start tapping notes. Events are
            captured in an 8-second cyclical loop with original velocity.
          </p>

          <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 mb-6 space-y-2">
            <div class="flex justify-between items-center text-xs font-mono">
              <span class="text-slate-400">Loop Status:</span>
              <span
                class={
                  state.looperRecording
                    ? "text-rose-400 font-bold"
                    : state.looperPlaying
                      ? "text-emerald-400 font-bold"
                      : "text-slate-500"
                }
              >
                {state.looperRecording
                  ? "Recording & Playback"
                  : state.looperPlaying
                    ? "Playing"
                    : "Stopped"}
              </span>
            </div>
            <div class="flex justify-between items-center text-xs font-mono">
              <span class="text-slate-400">Stacked Layers:</span>
              <span class="text-slate-200">{state.eventCount} events</span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick$={() => {
              if (state.looperRecording) {
                engine.stopLooperRecording();
                state.looperRecording = false;
              } else {
                engine.startLooperRecording();
                state.looperRecording = true;
                state.looperPlaying = true;
              }
            }}
            class={[
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md",
              state.looperRecording
                ? "bg-rose-500 hover:bg-rose-600 text-slate-100"
                : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-rose-400",
            ].join(" ")}
          >
            {state.looperRecording ? "Stop Looper" : "Record Loop"}
          </button>

          <button
            type="button"
            disabled={state.eventCount === 0 && !state.looperPlaying}
            onClick$={() => {
              if (state.looperPlaying) {
                engine.stopLooperPlayback();
                state.looperPlaying = false;
                state.looperRecording = false;
              } else {
                engine.startLooperPlayback();
                state.looperPlaying = true;
              }
            }}
            class={[
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-40",
              state.looperPlaying
                ? "bg-indigo-500 text-slate-100"
                : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-300",
            ].join(" ")}
          >
            {state.looperPlaying ? "Stop Loop" : "Play Loop"}
          </button>

          <button
            type="button"
            disabled={state.eventCount === 0}
            onClick$={() => {
              engine.clearLooper();
              state.looperPlaying = false;
              state.looperRecording = false;
              state.eventCount = 0;
            }}
            class="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>

      <div class="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-100 tracking-wide mb-1">
            Master Audio Recorder
          </h2>
          <p class="text-xs text-slate-400 mb-4">
            Capture direct soundboard mix to studio-grade WAV
          </p>
          <p class="text-sm text-slate-300 leading-relaxed mb-6">
            Record sequencers, loops, effects, and live play as high-definition
            stereo PCM.
          </p>

          <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class={[
                  "w-3 h-3 rounded-full",
                  state.isWavRecording
                    ? "bg-rose-500 animate-ping"
                    : "bg-zinc-700",
                ].join(" ")}
              />
              <span class="font-mono text-lg font-bold text-slate-200">
                {formatTime(state.recordingSeconds)}
              </span>
            </div>
            <span class="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              16-bit Stereo PCM
            </span>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            onClick$={() => {
              if (state.isWavRecording) {
                const blob = engine.stopAudioRecording();
                state.isWavRecording = false;
                if (blob) {
                  window.__handpanWavBlob = blob;
                  state.hasBlob = true;
                }
                if (window.__handpanRecTimer) {
                  clearInterval(window.__handpanRecTimer);
                  window.__handpanRecTimer = undefined;
                }
              } else {
                window.__handpanWavBlob = undefined;
                state.hasBlob = false;
                state.recordingSeconds = 0;
                engine.startAudioRecording();
                state.isWavRecording = true;
                window.__handpanRecTimer = setInterval(() => {
                  state.recordingSeconds += 1;
                }, 1000);
              }
            }}
            class={[
              "flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md",
              state.isWavRecording
                ? "bg-rose-500 text-slate-100 animate-pulse"
                : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-rose-400",
            ].join(" ")}
          >
            {state.isWavRecording ? "Stop Recording" : "Start Audio Capture"}
          </button>

          <button
            type="button"
            disabled={!state.hasBlob}
            onClick$={() => {
              const blob = window.__handpanWavBlob;
              if (!blob) return;
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `handpan_tongue_jam_${Date.now()}.wav`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            class="flex-1 flex items-center justify-center gap-2.5 px-5 py-3 bg-emerald-400 hover:bg-emerald-500 text-zinc-950 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            Export WAV
          </button>
        </div>
      </div>
    </div>
  );
});
