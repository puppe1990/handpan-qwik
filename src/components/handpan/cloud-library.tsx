import { component$, useStore } from "@builder.io/qwik";
import { CLOUD_LIBRARY_DATA } from "../../lib/cloud-packs";
import { engine } from "../../audio/engine";
import { historyManager } from "../../audio/history";
import { appUi } from "../../lib/app-state";

export const CloudLibrary = component$(() => {
  const state = useStore({
    searchTerm: "",
    activeCategory: "All",
    justLoadedId: null as string | null,
  });

  const categories = ["All", "Spiritual", "Cosmic", "Forest", "Traditional"];

  const filtered = CLOUD_LIBRARY_DATA.filter((pack) => {
    const term = state.searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      pack.name.toLowerCase().includes(term) ||
      pack.description.toLowerCase().includes(term);
    const matchesCategory =
      state.activeCategory === "All" || pack.category === state.activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div class="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-6 shadow-xl">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 class="text-lg font-bold text-slate-100 tracking-wide">
            Cloud Scale Explorer
          </h2>
          <p class="text-xs text-slate-400">
            Premium acoustic profiles and presets
          </p>
        </div>
        <input
          type="text"
          placeholder="Search clouds..."
          value={state.searchTerm}
          onInput$={(_, el) => {
            state.searchTerm = el.value;
          }}
          class="w-full md:w-64 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
        />
      </div>

      <div class="flex flex-wrap gap-1.5 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick$={() => {
              state.activeCategory = cat;
            }}
            class={[
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              state.activeCategory === cat
                ? "bg-sky-500 text-zinc-950 font-bold"
                : "bg-zinc-900/50 text-slate-400 hover:text-slate-200 border border-zinc-800",
            ].join(" ")}
          >
            {cat}
          </button>
        ))}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((pack) => {
          const isJustLoaded = state.justLoadedId === pack.id;
          return (
            <div
              key={pack.id}
              class="bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all"
            >
              <div class="space-y-2">
                <div class="flex justify-between items-center text-[10px] font-mono">
                  <div class="flex gap-1.5">
                    <span class="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold uppercase">
                      {pack.drumType}
                    </span>
                    <span class="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-slate-400 font-semibold uppercase">
                      {pack.category}
                    </span>
                  </div>
                  <span class="text-slate-500">{pack.downloads} downloads</span>
                </div>
                <h3 class="text-sm font-bold text-slate-100">{pack.name}</h3>
                <p class="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {pack.description}
                </p>
                <div class="text-[10px] font-mono text-slate-500 flex gap-4 pt-1">
                  <span>
                    Scale: <strong class="text-slate-300">{pack.scale}</strong>
                  </span>
                  <span>
                    Keys:{" "}
                    <strong class="text-slate-300">
                      {pack.preset.notes.length} pads
                    </strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick$={() => {
                  historyManager.saveState();
                  engine.importPreset(pack.preset);
                  appUi.bump();
                  state.justLoadedId = pack.id;
                  setTimeout(() => {
                    if (state.justLoadedId === pack.id) {
                      state.justLoadedId = null;
                    }
                  }, 2000);
                }}
                class={[
                  "w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                  isJustLoaded
                    ? "bg-emerald-500 text-zinc-950"
                    : "bg-zinc-800 hover:bg-sky-500 hover:text-zinc-950 text-slate-200 border border-zinc-700/50",
                ].join(" ")}
              >
                {isJustLoaded ? "Pack Sync Success" : "Load cloud profile"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
});
