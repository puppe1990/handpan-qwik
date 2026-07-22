import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DrumType, NoteConfig } from "../../lib/types";
import { engine } from "../../audio/engine";

interface DrumModelProps {
  notes: NoteConfig[];
  drumType: DrumType;
}

export const DrumModel = component$<DrumModelProps>(({ notes, drumType }) => {
  const activeNotes = useSignal<Record<number, boolean>>({});

  const handleTrigger = $((id: number) => {
    engine.triggerNote(id);
    activeNotes.value = { ...activeNotes.value, [id]: true };
    setTimeout(() => {
      activeNotes.value = { ...activeNotes.value, [id]: false };
    }, 200);
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const onKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase() || "";
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      const map: Record<string, number> = {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 3,
        "5": 4,
        "6": 5,
        "7": 6,
        "8": 7,
        "9": 8,
      };
      if (e.key in map) {
        engine.triggerNote(map[e.key]);
        activeNotes.value = { ...activeNotes.value, [map[e.key]]: true };
        setTimeout(() => {
          activeNotes.value = { ...activeNotes.value, [map[e.key]]: false };
        }, 200);
      }
    };
    window.addEventListener("keydown", onKey);
    cleanup(() => window.removeEventListener("keydown", onKey));
  });

  const getAngle = (id: number) => {
    if (id === 0) return { x: 0, y: 0 };
    const angleRad = (((id - 1) * 360) / 8 - 90) * (Math.PI / 180);
    const radius = drumType === "handpan" ? 140 : 130;
    return {
      x: Math.cos(angleRad) * radius,
      y: Math.sin(angleRad) * radius,
    };
  };

  return (
    <div class="relative py-8 select-none">
      <div class="flex flex-col items-center">
        {drumType === "handpan" ? (
          <div class="relative w-full aspect-square max-w-[480px] mx-auto rounded-full bg-radial-handpan p-2 shadow-2xl border border-slate-700/50 flex items-center justify-center">
            <div class="absolute inset-2 rounded-full border-4 border-amber-600/35 pointer-events-none opacity-80" />
            <div class="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />

            {notes[0] && (
              <button
                type="button"
                id="note-pad-0"
                aria-label={`Play ding note ${notes[0].label}`}
                onPointerDown$={(e) => {
                  e.preventDefault();
                  handleTrigger(0);
                }}
                class={[
                  "absolute w-36 h-36 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-100 select-none z-20 shadow-inner",
                  activeNotes.value[0]
                    ? "bg-amber-400/90 shadow-amber-500/50 ring-4 ring-amber-300"
                    : "bg-gradient-to-br from-zinc-800 via-slate-900 to-zinc-950 hover:from-slate-800 hover:to-zinc-900 border border-slate-700/60",
                ].join(" ")}
              >
                <div
                  class={[
                    "w-12 h-12 rounded-full transition-all duration-150 flex items-center justify-center shadow-lg",
                    activeNotes.value[0]
                      ? "bg-amber-300"
                      : "bg-zinc-950 border border-amber-800/20",
                  ].join(" ")}
                >
                  <span
                    class={[
                      "text-[10px] font-mono tracking-wider",
                      activeNotes.value[0]
                        ? "text-zinc-950 font-bold"
                        : "text-amber-500/80",
                    ].join(" ")}
                  >
                    DING
                  </span>
                </div>
                <span
                  class={[
                    "text-xs mt-2 font-semibold tracking-wider font-mono",
                    activeNotes.value[0] ? "text-zinc-950" : "text-slate-300",
                  ].join(" ")}
                >
                  {notes[0].label.replace(" (Ding)", "")}
                </span>
              </button>
            )}

            {notes.slice(1).map((note) => {
              const pos = getAngle(note.id);
              const isActive = !!activeNotes.value[note.id];
              return (
                <div
                  key={note.id}
                  style={{
                    position: "absolute",
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                  }}
                  class="z-10"
                >
                  <button
                    type="button"
                    id={`note-pad-${note.id}`}
                    aria-label={`Play note ${note.label}`}
                    onPointerDown$={(e) => {
                      e.preventDefault();
                      handleTrigger(note.id);
                    }}
                    class={[
                      "w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-100 select-none shadow-lg",
                      isActive
                        ? "bg-emerald-400 shadow-emerald-500/50 ring-4 ring-emerald-300 text-zinc-950"
                        : "bg-gradient-to-br from-zinc-800/90 to-slate-900 border border-slate-700/50 hover:border-slate-500 text-slate-300",
                    ].join(" ")}
                  >
                    <div
                      class={[
                        "w-8 h-8 rounded-full mb-1 transition-all flex items-center justify-center",
                        isActive
                          ? "bg-emerald-300"
                          : "bg-zinc-900/60 border border-zinc-700",
                      ].join(" ")}
                    >
                      <span
                        class={[
                          "text-[9px] font-mono",
                          isActive
                            ? "text-zinc-950 font-bold"
                            : "text-slate-500",
                        ].join(" ")}
                      >
                        {note.id}
                      </span>
                    </div>
                    <span class="text-sm font-bold font-mono tracking-tight">
                      {note.label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div class="relative w-full aspect-square max-w-[480px] mx-auto rounded-full bg-radial-tongue p-3 shadow-2xl border border-indigo-900/40 flex items-center justify-center">
            <div class="absolute inset-3 rounded-full border border-zinc-800 pointer-events-none" />
            <div class="absolute w-28 h-28 rounded-full bg-indigo-950/25 border border-indigo-500/10 pointer-events-none blur-md" />

            {notes.map((note) => {
              const isDing = note.id === 0;
              const pos = getAngle(note.id);
              const isActive = !!activeNotes.value[note.id];
              const angleDeg = isDing ? 0 : ((note.id - 1) * 360) / 8;

              return (
                <div
                  key={note.id}
                  style={{
                    position: "absolute",
                    transform: isDing
                      ? "translate(0, 0)"
                      : `translate(${pos.x}px, ${pos.y}px) rotate(${angleDeg}deg)`,
                  }}
                  class={isDing ? "z-20" : "z-10"}
                >
                  <button
                    type="button"
                    id={`note-pad-${note.id}`}
                    aria-label={`Play note ${note.label}`}
                    onPointerDown$={(e) => {
                      e.preventDefault();
                      handleTrigger(note.id);
                    }}
                    class={[
                      "cursor-pointer transition-all duration-100 select-none flex items-center justify-center shadow-lg",
                      isDing
                        ? `w-28 h-28 rounded-full ${
                            isActive
                              ? "bg-indigo-400 ring-4 ring-indigo-300 shadow-indigo-500/50"
                              : "bg-gradient-to-br from-indigo-950 to-zinc-950 border border-indigo-700/40"
                          }`
                        : `w-16 h-28 rounded-t-3xl rounded-b-lg ${
                            isActive
                              ? "bg-indigo-400 ring-4 ring-indigo-300 shadow-indigo-500/50"
                              : "bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-indigo-900/20 hover:border-indigo-700/35"
                          }`,
                    ].join(" ")}
                  >
                    <div
                      style={{
                        transform: isDing ? "none" : `rotate(${-angleDeg}deg)`,
                      }}
                      class="flex flex-col items-center justify-center pointer-events-none"
                    >
                      <span
                        class={[
                          "text-[9px] font-mono uppercase tracking-widest",
                          isActive
                            ? "text-zinc-950 font-bold"
                            : "text-indigo-400/75",
                        ].join(" ")}
                      >
                        {isDing ? "Bass" : `T${note.id}`}
                      </span>
                      <span
                        class={[
                          "text-base font-bold font-mono",
                          isActive ? "text-zinc-950" : "text-slate-100",
                        ].join(" ")}
                      >
                        {note.label.replace(" (Ding)", "")}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div class="mt-6 flex items-center gap-2 bg-zinc-900/65 border border-zinc-800/80 px-4 py-2 rounded-full text-xs text-slate-400 font-mono">
          <span class="text-amber-500">Keyboard:</span>
          <div class="flex gap-1.5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((key) => (
              <kbd
                key={key}
                class="bg-zinc-800 text-slate-200 px-1.5 py-0.5 rounded border border-zinc-700"
              >
                {key}
              </kbd>
            ))}
          </div>
          <span class="text-slate-500 ml-1">(Ding is 1)</span>
        </div>
      </div>
    </div>
  );
});
