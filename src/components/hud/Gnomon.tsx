import { PALETTE, PHASE_HEX } from "@/lib/photonic/palette";
import { useKyrexis } from "@/lib/photonic/store";
import { phaseAt } from "@/lib/photonic/phases";
import { cn } from "@/lib/utils";

export function Gnomon({ className }: { className?: string }) {
  const tau = useKyrexis((s) => s.tau);
  const coherence = useKyrexis((s) => s.metrics.coherence);
  const phase = phaseAt(tau);
  const angle = tau * 180;
  const color = PHASE_HEX[phase.key] ?? PALETTE.primary;

  return (
    <div className={cn("relative mx-auto aspect-square w-full max-w-[220px]", className)}>
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth="1"
        />
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth="0.6"
          strokeDasharray="2 3"
        />
        {[0, 45, 90, 135, 180].map((d) => {
          const a = ((d - 90) * Math.PI) / 180;
          const x1 = 60 + Math.cos(a) * 48;
          const y1 = 60 + Math.sin(a) * 48;
          const x2 = 60 + Math.cos(a) * 52;
          const y2 = 60 + Math.sin(a) * 52;
          return (
            <line
              key={d}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={PALETTE.muted}
              strokeWidth="0.8"
            />
          );
        })}
        <line
          x1="60"
          y1="60"
          x2={60 + Math.cos(((angle - 90) * Math.PI) / 180) * 44}
          y2={60 + Math.sin(((angle - 90) * Math.PI) / 180) * 44}
          stroke={PALETTE.crimson}
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{
            transitionProperty: "x2, y2",
            transitionDuration: "150ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        <circle
          cx="60"
          cy="60"
          r={3 + coherence * 3}
          fill={color}
          opacity={0.9}
        />
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-1 text-center">
        <div className="font-mono text-xs tabular-nums text-crimson">
          {angle.toFixed(1)}°
        </div>
      </div>
    </div>
  );
}
