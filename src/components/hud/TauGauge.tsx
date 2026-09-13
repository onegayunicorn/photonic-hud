import { useCallback, useEffect, useRef } from "react";
import { useKyrexis } from "@/lib/photonic/store";
import { phaseAt } from "@/lib/photonic/phases";

const PHASE_MARKS = [0, 0.33, 0.4, 0.66, 0.75, 0.88, 1.0] as const;

/**
 * Linear dual-curve τ gauge.
 * Cyan solid = coherence, crimson dashed = entropy.
 * Collapse flash zone at τ ≈ 0.33. Gnomon tracks live τ.
 * Fully driven by the existing useKyrexis store.
 */
export function TauGauge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const lastTs = useRef<number>(0);

  const tau = useKyrexis((s) => s.tau);
  const running = useKyrexis((s) => s.running);
  const metrics = useKyrexis((s) => s.metrics);
  const setTau = useKyrexis((s) => s.setTau);
  const setRunning = useKyrexis((s) => s.setRunning);
  const reset = useKyrexis((s) => s.reset);
  const seal = useKyrexis((s) => s.seal);
  const tick = useKyrexis((s) => s.tick);

  const phase = phaseAt(tau);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const padX = 40;
    const padY = 32;
    const usableW = W - padX * 2;
    const usableH = H - padY * 2;

    ctx.clearRect(0, 0, W, H);

    // Subtle grid
    ctx.strokeStyle = "rgba(232,229,223,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = padX + (i / 10) * usableW;
      ctx.beginPath();
      ctx.moveTo(x, padY);
      ctx.lineTo(x, H - padY);
      ctx.stroke();
      const y = padY + (i / 10) * usableH;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(W - padX, y);
      ctx.stroke();
    }

    // Collapse flash zone (τ ≈ 0.33)
    const collapseX = padX + 0.33 * usableW;
    ctx.fillStyle = "rgba(220,20,60,0.10)";
    ctx.fillRect(collapseX - usableW * 0.025, padY, usableW * 0.05, usableH);

    // Coherence curve (cyan solid) — sample real metricsAt curve shape
    ctx.beginPath();
    ctx.strokeStyle = "#00d4ff";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "rgba(0,212,255,0.45)";
    ctx.shadowBlur = 10;
    for (let i = 0; i <= usableW; i++) {
      const t = i / usableW;
      // Approximate the engine's COHERENCE_KEYS for visual smoothness
      let c = 0.54;
      if (t < 0.33) c = 0.54 + (0.56 - 0.54) * (t / 0.33);
      else if (t < 0.36) c = 0.56 + (0.92 - 0.56) * ((t - 0.33) / 0.03);
      else if (t < 0.4) c = 0.92 + (0.998 - 0.92) * ((t - 0.36) / 0.04);
      else if (t < 0.66) c = 0.998;
      else if (t < 0.72) c = 0.998 + (0.94 - 0.998) * ((t - 0.66) / 0.06);
      else if (t < 0.82) c = 0.94 + (0.85 - 0.94) * ((t - 0.72) / 0.1);
      else if (t < 0.9) c = 0.85 + (0.92 - 0.85) * ((t - 0.82) / 0.08);
      else c = 0.92 + (0.99997 - 0.92) * ((t - 0.9) / 0.1);

      const y = padY + usableH - Math.min(1, Math.max(0, c)) * usableH;
      if (i === 0) ctx.moveTo(padX + i, y);
      else ctx.lineTo(padX + i, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Entropy curve (crimson dashed)
    ctx.beginPath();
    ctx.strokeStyle = "#dc143c";
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 4]);
    for (let i = 0; i <= usableW; i++) {
      const t = i / usableW;
      let e = 1.85;
      if (t < 0.33) e = 1.85 + (1.68 - 1.85) * (t / 0.33);
      else if (t < 0.4) e = 1.68 + (0.28 - 1.68) * ((t - 0.33) / 0.07);
      else if (t < 0.66) e = 0.28 + (0.1 - 0.28) * ((t - 0.4) / 0.26);
      else if (t < 0.75) e = 0.1 + (0.42 - 0.1) * ((t - 0.66) / 0.09);
      else if (t < 0.88) e = 0.42 + (1.18 - 0.42) * ((t - 0.75) / 0.13);
      else e = 1.18 + (0.22 - 1.18) * ((t - 0.88) / 0.12);

      // Normalize entropy into 0–1 visual range (max ~1.85)
      const norm = Math.min(1, Math.max(0, e / 2.0));
      const y = padY + usableH - norm * usableH;
      if (i === 0) ctx.moveTo(padX + i, y);
      else ctx.lineTo(padX + i, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Phase tick marks
    PHASE_MARKS.forEach((p) => {
      const x = padX + p * usableW;
      ctx.strokeStyle = "rgba(232,229,223,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, H - padY + 4);
      ctx.lineTo(x, H - padY + 12);
      ctx.stroke();
    });

    // Crimson gnomon needle
    const tx = padX + tau * usableW;
    ctx.fillStyle = "#dc143c";
    ctx.shadowColor = "#dc143c";
    ctx.shadowBlur = 14;
    ctx.fillRect(tx - 1.5, padY - 8, 3, usableH + 16);
    ctx.shadowBlur = 0;

    // Cyan τ indicator dot
    ctx.beginPath();
    ctx.arc(tx, padY - 4, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#00d4ff";
    ctx.shadowColor = "#00d4ff";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#0a0a14";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#7a7a8a";
    ctx.font = "11px ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.fillText("C", 8, padY + 4);
    ctx.fillStyle = "#dc143c";
    ctx.fillText("S", 8, padY + 20);
    ctx.fillStyle = "#7a7a8a";
    ctx.textAlign = "right";
    ctx.fillText("τ →", W - 8, H - 8);
  }, [tau]);

  // Redraw on τ change
  useEffect(() => {
    draw();
  }, [draw]);

  // Animation loop — uses the real store tick so duration modes stay consistent
  useEffect(() => {
    if (!running) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      lastTs.current = 0;
      return;
    }

    const step = (ts: number) => {
      if (!lastTs.current) lastTs.current = ts;
      const dt = Math.min(0.05, (ts - lastTs.current) / 1000);
      lastTs.current = ts;
      tick(dt);
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [running, tick]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        <canvas
          ref={canvasRef}
          width={720}
          height={260}
          className="block w-full"
          style={{ height: 260 }}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setRunning(!running)}
          className="rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-crimson/20"
        >
          {running ? "Pause" : "Play"}
        </button>

        <button
          type="button"
          onClick={() => {
            setRunning(false);
            reset();
          }}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted transition hover:text-foreground"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={() =>
            void seal(
              "manual",
              `Manual seal at τ=${tau.toFixed(4)} · ${phase.label}`,
              "L1",
            )
          }
          className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-primary/20"
        >
          Seal to Vault
        </button>

        <div className="min-w-[180px] flex-1">
          <input
            type="range"
            min={0}
            max={1}
            step={0.0001}
            value={tau}
            onChange={(e) => {
              if (running) setRunning(false);
              setTau(parseFloat(e.target.value));
            }}
            className="w-full accent-cyan"
          />
        </div>

        <div className="text-right font-mono text-sm">
          <div>
            <span className="text-muted">τ = </span>
            <span className="font-semibold text-cyan">{tau.toFixed(4)}</span>
          </div>
          <div className="text-xs text-muted">
            {phase.label} · C {metrics.coherence.toFixed(3)} · S{" "}
            {metrics.entropy.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
