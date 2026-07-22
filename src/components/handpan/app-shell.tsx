import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DrumType, NoteConfig, PresetData } from "../../lib/types";
import { engine, SCALE_PRESETS } from "../../audio/engine";
import { historyManager } from "../../audio/history";
import { appUi } from "../../lib/app-state";
import { DrumModel } from "./drum-model";
import { Analyzer } from "./analyzer";
import { Sequencer } from "./sequencer";
import { Looper } from "./looper";
import { DspLab } from "./dsp-lab";
import { MidiSettings } from "./midi-settings";
import { CloudLibrary } from "./cloud-library";
import { AutomationPanel } from "./automation";

type TabId =
  | "sequencer"
  | "looper"
  | "dsp"
  | "midi"
  | "cloud"
  | "automation";

const THEME_KEY = "handpan-theme";

export const AppShell = component$(() => {
  const state = useStore({
    drumType: engine.drumType as DrumType,
    notes: [...engine.notes] as NoteConfig[],
    scaleName: engine.scaleName,
    activeTab: "sequencer" as TabId,
    canUndo: false,
    canRedo: false,
    audioReady: false,
    theme: "dark" as "dark" | "light",
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    // Restore theme preference
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") {
        state.theme = saved;
      }
    } catch {
      /* ignore */
    }
    document.documentElement.dataset.theme = state.theme;

    historyManager.saveState();
    const sync = () => {
      state.drumType = engine.drumType;
      state.notes = [...engine.notes];
      state.scaleName = engine.scaleName;
      state.canUndo = historyManager.canUndo();
      state.canRedo = historyManager.canRedo();
    };
    historyManager.onHistoryChange = sync;
    sync();

    // Poll for external engine mutations (cloud packs, etc.)
    let lastRev = appUi.revision;
    const poll = setInterval(() => {
      if (appUi.revision !== lastRev) {
        lastRev = appUi.revision;
        sync();
      }
    }, 200);

    cleanup(() => {
      historyManager.onHistoryChange = null;
      clearInterval(poll);
    });
  });

  const tabs: { id: TabId; label: string; active: string }[] = [
    { id: "sequencer", label: "Sequencer", active: "bg-emerald-400 text-zinc-950" },
    { id: "looper", label: "Looper & Rec", active: "bg-rose-500 text-slate-100" },
    { id: "dsp", label: "DSP Lab", active: "bg-purple-500 text-slate-100" },
    { id: "automation", label: "Modulation", active: "bg-amber-500 text-zinc-950" },
    { id: "midi", label: "Web MIDI", active: "bg-blue-500 text-slate-100" },
    { id: "cloud", label: "Cloud Scales", active: "bg-sky-500 text-zinc-950" },
  ];

  return (
    <div
      class="min-h-screen bg-zinc-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950"
      onClick$={() => {
        engine.init();
        state.audioReady = true;
      }}
      onPointerDown$={() => {
        engine.init();
        state.audioReady = true;
      }}
    >
      <header class="border-b border-zinc-900 bg-zinc-950/85 backdrop-blur-md sticky top-0 z-50 px-4 py-4 md:px-8">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-indigo-600 p-[1.5px] shadow-lg shadow-emerald-500/5">
              <div class="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-emerald-400 text-lg">
                ✦
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-lg font-bold tracking-tight text-slate-100">
                  Handpan & Tongue Drum
                </h1>
                <span class="text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-mono">
                  QWIK · ULTRA-LOW LATENCY
                </span>
              </div>
              <p class="text-xs text-slate-400">
                Physical synthesis modeling and live performance loop station
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="btn-theme-toggle"
              aria-label={
                state.theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                state.theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              onClick$={(e) => {
                e.stopPropagation();
                const next = state.theme === "dark" ? "light" : "dark";
                state.theme = next;
                document.documentElement.dataset.theme = next;
                try {
                  localStorage.setItem(THEME_KEY, next);
                } catch {
                  /* ignore */
                }
              }}
              class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-slate-300 transition-all"
            >
              <span class="text-sm leading-none" aria-hidden="true">
                {state.theme === "dark" ? "☀" : "☾"}
              </span>
              {state.theme === "dark" ? "Light" : "Dark"}
            </button>

            <button
              type="button"
              disabled={!state.canUndo}
              onClick$={() => {
                historyManager.undo();
              }}
              class={[
                "flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all",
                state.canUndo
                  ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-slate-200"
                  : "bg-zinc-950 border-zinc-900 text-slate-600 cursor-not-allowed opacity-45",
              ].join(" ")}
            >
              Undo
            </button>
            <button
              type="button"
              disabled={!state.canRedo}
              onClick$={() => {
                historyManager.redo();
              }}
              class={[
                "flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all",
                state.canRedo
                  ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-slate-200"
                  : "bg-zinc-950 border-zinc-900 text-slate-600 cursor-not-allowed opacity-45",
              ].join(" ")}
            >
              Redo
            </button>

            <div class="w-[1px] h-5 bg-zinc-800 mx-1 hidden sm:block" />

            <button
              type="button"
              onClick$={() => {
                historyManager.saveState();
                const activeScale =
                  SCALE_PRESETS.find((s) => s.name === state.scaleName) ||
                  SCALE_PRESETS[0];
                engine.loadDefaultNotes(activeScale);
                state.notes = [...engine.notes];
              }}
              class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-slate-300"
            >
              Reset Scale
            </button>

            <button
              type="button"
              onClick$={() => {
                const preset = engine.exportPreset(
                  `Preset_${state.scaleName}_${Date.now()}`,
                );
                const dataStr =
                  "data:text/json;charset=utf-8," +
                  encodeURIComponent(JSON.stringify(preset, null, 2));
                const a = document.createElement("a");
                a.setAttribute("href", dataStr);
                a.setAttribute(
                  "download",
                  `${preset.name.toLowerCase().replace(/\s+/g, "_")}.json`,
                );
                a.click();
              }}
              class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-slate-300"
            >
              Save Preset
            </button>

            <label class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-slate-300 cursor-pointer">
              Load Preset
              <input
                type="file"
                accept=".json"
                class="hidden"
                onChange$={async (_, el) => {
                  const file = el.files?.[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    const parsed: PresetData = JSON.parse(text);
                    historyManager.saveState();
                    engine.importPreset(parsed);
                    state.drumType = engine.drumType;
                    state.scaleName = engine.scaleName;
                    state.notes = [...engine.notes];
                  } catch {
                    alert(
                      "Error parsing Preset file. Please upload a valid JSON configuration.",
                    );
                  }
                  el.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </header>

      <main class="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
        {!state.audioReady && (
          <div class="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200 font-mono text-center">
            Tap anywhere to enable audio (browser autoplay policy)
          </div>
        )}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/20 border border-zinc-900 rounded-3xl p-6">
          <div class="space-y-2">
            <span class="text-xs font-mono text-slate-500 uppercase tracking-widest block">
              Instrument Architecture
            </span>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick$={() => {
                  historyManager.saveState();
                  engine.setDrumType("handpan");
                  state.drumType = "handpan";
                  state.notes = [...engine.notes];
                }}
                class={[
                  "py-4 rounded-2xl flex flex-col items-center gap-1.5 border transition-all text-center",
                  state.drumType === "handpan"
                    ? "bg-gradient-to-b from-slate-900 to-zinc-950 border-amber-500/80 text-amber-400 shadow-md"
                    : "bg-zinc-900/30 hover:bg-zinc-900/60 border-zinc-800 text-slate-400",
                ].join(" ")}
              >
                <div
                  class={[
                    "w-2.5 h-2.5 rounded-full",
                    state.drumType === "handpan"
                      ? "bg-amber-400 animate-pulse"
                      : "bg-zinc-700",
                  ].join(" ")}
                />
                <span class="text-sm font-bold tracking-wide">
                  Pantam / Handpan
                </span>
                <span class="text-[10px] font-mono text-slate-500">
                  1:2:3 Harmonic Overtone Matrix
                </span>
              </button>

              <button
                type="button"
                onClick$={() => {
                  historyManager.saveState();
                  engine.setDrumType("tongue");
                  state.drumType = "tongue";
                  state.notes = [...engine.notes];
                }}
                class={[
                  "py-4 rounded-2xl flex flex-col items-center gap-1.5 border transition-all text-center",
                  state.drumType === "tongue"
                    ? "bg-gradient-to-b from-indigo-950/40 to-neutral-950 border-indigo-500/80 text-indigo-400 shadow-md"
                    : "bg-zinc-900/30 hover:bg-zinc-900/60 border-zinc-800 text-slate-400",
                ].join(" ")}
              >
                <div
                  class={[
                    "w-2.5 h-2.5 rounded-full",
                    state.drumType === "tongue"
                      ? "bg-indigo-400 animate-pulse"
                      : "bg-zinc-700",
                  ].join(" ")}
                />
                <span class="text-sm font-bold tracking-wide">
                  Steel Tongue Drum
                </span>
                <span class="text-[10px] font-mono text-slate-500">
                  Enhanced Metallic Resonance Bloom
                </span>
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <span class="text-xs font-mono text-slate-500 uppercase tracking-widest block">
              Harmonic Scale Tuning
            </span>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SCALE_PRESETS.map((scale) => (
                <button
                  key={scale.name}
                  type="button"
                  onClick$={() => {
                    historyManager.saveState();
                    engine.loadDefaultNotes(scale);
                    state.scaleName = scale.name;
                    state.notes = [...engine.notes];
                  }}
                  class={[
                    "px-3 py-3 rounded-xl border text-xs font-semibold text-center transition-all flex flex-col justify-between items-center h-[76px]",
                    state.scaleName === scale.name
                      ? "bg-zinc-900 border-emerald-500/60 text-emerald-400 shadow-md"
                      : "bg-zinc-900/30 hover:bg-zinc-900/60 border-zinc-800 text-slate-400",
                  ].join(" ")}
                >
                  <span class="font-bold tracking-wide">{scale.name}</span>
                  <span class="text-[10px] font-mono opacity-70 block mt-1">
                    {scale.key}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div class="xl:col-span-5 space-y-6 flex flex-col">
            <div class="bg-zinc-950/50 border border-zinc-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex-1">
              <div class="absolute top-2 right-4 text-[10px] font-mono text-zinc-800 tracking-widest uppercase pointer-events-none">
                Stereo spectrum
              </div>
              <Analyzer />
              <DrumModel notes={state.notes} drumType={state.drumType} />
            </div>
          </div>

          <div class="xl:col-span-7 space-y-6">
            <div class="flex flex-wrap gap-1.5 bg-zinc-900/30 p-1.5 rounded-2xl border border-zinc-900">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick$={() => {
                    state.activeTab = tab.id;
                  }}
                  class={[
                    "flex-1 py-3 px-3 rounded-xl text-xs font-bold transition-all min-w-[100px]",
                    state.activeTab === tab.id
                      ? tab.active + " shadow"
                      : "text-slate-400 hover:text-slate-200 hover:bg-zinc-900/50",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div>
              {state.activeTab === "sequencer" && (
                <Sequencer notes={state.notes} />
              )}
              {state.activeTab === "looper" && <Looper />}
              {state.activeTab === "dsp" && <DspLab notes={state.notes} />}
              {state.activeTab === "midi" && <MidiSettings />}
              {state.activeTab === "cloud" && <CloudLibrary />}
              {state.activeTab === "automation" && <AutomationPanel />}
            </div>
          </div>
        </div>
      </main>

      <footer class="border-t border-zinc-900 bg-zinc-950/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Handpan and Steel Tongue Drum Virtual Soundboard — rebuilt with
            Qwik.
          </p>
          <div class="flex gap-4 font-mono text-[10px]">
            <span>ENGINE: WEB AUDIO API</span>
            <span>MIDI: WEB MIDI ACCESS</span>
            <span>PCM: 16-BIT STEREO WAV</span>
          </div>
        </div>
      </footer>
    </div>
  );
});
