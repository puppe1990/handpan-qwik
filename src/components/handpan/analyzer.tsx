import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { engine } from "../../audio/engine";

export const Analyzer = component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    engine.onAnalyserUpdate = (dataArray) => {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = canvasCtx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#f59e0b");
      gradient.addColorStop(0.5, "#10b981");
      gradient.addColorStop(1, "#6366f1");
      canvasCtx.fillStyle = gradient;

      const barWidth = (canvas.width / dataArray.length) * 2.2;
      let x = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.95;
        canvasCtx.fillRect(
          x,
          canvas.height - barHeight,
          barWidth - 1.5,
          barHeight,
        );
        x += barWidth;
      }
    };

    cleanup(() => {
      engine.onAnalyserUpdate = null;
    });
  });

  return (
    <div class="w-full h-14 bg-zinc-950 border border-zinc-900/80 rounded-2xl overflow-hidden p-0.5">
      <canvas
        ref={canvasRef}
        width={420}
        height={52}
        class="w-full h-full rounded-[14px]"
        aria-label="Frequency spectrum analyzer"
      />
    </div>
  );
});
