import { useEffect, useRef } from "react";
import { sampleSpectrum } from "@/lib/photonic/engine";
import { PALETTE } from "@/lib/photonic/palette";
import { useKyrexis } from "@/lib/photonic/store";
import { cn } from "@/lib/utils";

export function PolarField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tau = useKyrexis((s) => s.tau);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paint = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      canvas.width = w;
      canvas.height = h;

      const t = useKyrexis.getState().tau;
      const { G } = sampleSpectrum(t, 24);
      const max = Math.max(...G, 1e-9);
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.46;

      ctx.fillStyle = PALETTE.elevated;
      ctx.fillRect(0, 0, w, h);

      const rings = 7;
      const segs = 28;
      for (let ring = 0; ring < rings; ring++) {
        const r0 = (ring / rings) * maxR;
        const r1 = ((ring + 1) / rings) * maxR;
        for (let s = 0; s < segs; s++) {
          const a0 = (s / segs) * Math.PI * 2 + t * Math.PI;
          const a1 = ((s + 1) / segs) * Math.PI * 2 + t * Math.PI;
          const idx = Math.floor((s / segs) * G.length) % G.length;
          const val = G[idx] / max;
          const mix = val * (0.4 + ring / rings);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0);
          ctx.lineTo(cx + Math.cos(a1) * r0, cy + Math.sin(a1) * r0);
          ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
          ctx.lineTo(cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1);
          ctx.closePath();
          const hue = 186 - mix * 28;
          ctx.fillStyle = `hsla(${hue}, 78%, ${48 + mix * 22}%, ${0.22 + mix * 0.62})`;
          ctx.fill();
        }
      }

      ctx.beginPath();
      ctx.arc(cx, cy, 3 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = PALETTE.primary;
      ctx.fill();
    };

    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [tau]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block h-full w-full rounded-md", className)}
      aria-label="Photonic field polar density"
    />
  );
}
