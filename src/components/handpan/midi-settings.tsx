import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { engine } from "../../audio/engine";

export const MidiSettings = component$(() => {
  const state = useStore({
    devices: [] as string[],
    learnId: null as number | null,
    mappings: [...engine.midiMappings],
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    engine.init();
    state.devices = engine.getMidiDevices();
    state.mappings = [...engine.midiMappings];
    state.learnId = engine.midiLearnActiveNoteId;

    engine.onMidiStateChange = () => {
      state.devices = engine.getMidiDevices();
      state.mappings = [...engine.midiMappings];
      state.learnId = engine.midiLearnActiveNoteId;
    };
    cleanup(() => {
      engine.onMidiStateChange = null;
    });
  });

  const getMidiNoteName = (midiNum: number) => {
    const notes = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const octave = Math.floor(midiNum / 12) - 1;
    return `${notes[midiNum % 12]}${octave} (${midiNum})`;
  };

  return (
    <div class="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-6 shadow-xl">
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-100">
                Web MIDI Integration
              </h2>
              <p class="text-xs text-slate-400">
                Connect external hardware & DAWs
              </p>
            </div>
            <button
              type="button"
              onClick$={() => {
                engine.init();
                state.devices = engine.getMidiDevices();
                state.mappings = [...engine.midiMappings];
              }}
              class="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Refresh
            </button>
          </div>

          <div class="space-y-3">
            <h3 class="text-xs font-mono uppercase tracking-widest text-slate-500">
              Connected Hardware
            </h3>
            {state.devices.length === 0 ? (
              <div class="bg-zinc-900/30 border border-zinc-900 rounded-xl p-4">
                <p class="text-xs text-slate-300 font-semibold">
                  No MIDI devices detected
                </p>
                <p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Connect a MIDI controller via USB and allow browser access.
                  Chrome/Edge recommended for Web MIDI.
                </p>
              </div>
            ) : (
              <div class="space-y-2">
                {state.devices.map((device, idx) => (
                  <div
                    key={idx}
                    class="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 flex justify-between items-center"
                  >
                    <span class="text-xs text-slate-200 font-bold">
                      {device}
                    </span>
                    <span class="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div class="flex-1 space-y-4">
          <h3 class="text-xs font-mono uppercase tracking-widest text-slate-500">
            MIDI Learn & Mapping
          </h3>
          <div class="bg-zinc-900/20 rounded-xl border border-zinc-900 p-4 max-h-[290px] overflow-y-auto custom-scrollbar space-y-1.5">
            {Array(9)
              .fill(0)
              .map((_, idx) => {
                const mapping = state.mappings.find((m) => m.noteId === idx);
                const isLearning = state.learnId === idx;
                return (
                  <div
                    key={idx}
                    class="flex items-center justify-between bg-zinc-900/40 border border-zinc-900/50 px-3 py-2 rounded-lg"
                  >
                    <span class="text-xs text-slate-200 font-mono font-bold">
                      {idx === 0 ? "Ding (Pad 0)" : `Tone Pad ${idx}`}
                    </span>
                    <div class="flex items-center gap-2">
                      <span class="text-[11px] font-mono text-slate-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                        {isLearning
                          ? "WAITING KEY..."
                          : mapping
                            ? getMidiNoteName(mapping.midiNote)
                            : "UNMAPPED"}
                      </span>
                      <button
                        type="button"
                        onClick$={() => {
                          if (state.learnId === idx) {
                            engine.midiLearnActiveNoteId = null;
                            state.learnId = null;
                          } else {
                            engine.midiLearnActiveNoteId = idx;
                            state.learnId = idx;
                          }
                        }}
                        class={[
                          "px-2.5 py-1 text-[10px] font-bold rounded-md transition-all",
                          isLearning
                            ? "bg-rose-500 text-slate-100 animate-pulse"
                            : "bg-zinc-800 hover:bg-zinc-700 text-slate-300 border border-zinc-700/50",
                        ].join(" ")}
                      >
                        {isLearning ? "Cancel" : "Learn"}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
});
