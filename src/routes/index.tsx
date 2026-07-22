import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { AppShell } from "../components/handpan/app-shell";

export default component$(() => {
  return <AppShell />;
});

export const head: DocumentHead = {
  title: "Handpan & Tongue Drum Simulator · Qwik",
  meta: [
    {
      name: "description",
      content:
        "Interactive low-latency Handpan and Steel Tongue Drum simulator with sequencing, looper, DSP, Web MIDI, and physical modeling synthesis. Built with Qwik.",
    },
  ],
};
