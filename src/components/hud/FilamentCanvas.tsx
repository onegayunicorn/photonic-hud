import { useEffect, useRef } from "react";
import { PALETTE, PHASE_HEX } from "@/lib/photonic/palette";
import { useKyrexis } from "@/lib/photonic/store";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export function FilamentCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const t0 = performance.now();

    const paint = (now: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const { tau, coherence, gammaFreq, filaments, phase } =
        useKyrexis.getState().metrics;
      const color = PHASE_HEX[phase] ?? PALETTE.primary;
      const time = reduced ? 0 : (now - t0) / 1000;
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h);

      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(232,244,246,0.04)";
      ctx.lineWidth = dpr;
      for (let r = 0.12; r <= 0.42; r += 0.1) {
        ctx.beginPath();
        ctx.arc(cx, cy, scale * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < filaments; i++) {
        const base = (i / filaments) * Math.PI * 2 + tau * Math.PI;
        const pulse = Math.sin(time * gammaFreq * Math.PI * 2 + i * 1.3);
        const len = scale * (0.18 + 0.16 * coherence + 0.05 * pulse);
        const wobble = 0.18 * pulse * (0.35 + coherence);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const mx = cx + Math.cos(base + wobble) * len * 0.55;
        const my = cy + Math.sin(base + wobble) * len * 0.55;
        const ex = cx + Math.cos(base - wobble * 0.6) * len;
        const ey = cy + Math.sin(base - wobble * 0.6) * len;
        ctx.quadraticCurveTo(mx, my, ex, ey);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.28 + 0.55 * coherence;
        ctx.lineWidth = (1.2 + coherence * 1.6) * dpr;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ex, ey, (1.6 + coherence * 2.2) * dpr, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      const coreR = (3 + 8 * coherence) * dpr;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 4);
      g.addColorStop(0, color);
      g.addColorStop(0.35, `${color}55`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = PALETTE.fg;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5 * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = (now: number) => {
      paint(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block h-full w-full", className)}
      aria-hidden="true"
    />
  );
}
