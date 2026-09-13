import { PHASES } from "@/lib/photonic/phases";
import { useKyrexis } from "@/lib/photonic/store";
import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  primary: "bg-primary",
  crimson: "bg-crimson",
  indigo: "bg-indigo",
  amber: "bg-amber",
  emerald: "bg-emerald",
};

export function PhaseTimeline() {
  const tau = useKyrexis((s) => s.tau);
  const setTau = useKyrexis((s) => s.setTau);
  const setRunning = useKyrexis((s) => s.setRunning);

  return (
    <div>
      <div className="relative h-2 rounded-full bg-elevated">
        {PHASES.map((p) => {
          const left = p.range[0] * 100;
          const width = (p.range[1] - p.range[0]) * 100;
          return (
            <button
              key={p.key}
              type="button"
              title={p.label}
              onClick={() => {
                setRunning(false);
                setTau(p.range[0] + 0.001);
              }}
              className={cn(
                "absolute top-0 h-2 opacity-50 hover:opacity-90",
                TONE[p.colorToken],
              )}
              style={{ left: `${left}%`, width: `${width}%` }}
            />
          );
        })}
        <div
          className="pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg"
          style={{ left: `${tau * 100}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {PHASES.map((p) => {
          const active = tau >= p.range[0] && tau < p.range[1] || (p.key === "newbeing" && tau >= 0.88);
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => {
                setRunning(false);
                setTau(p.range[0] + 0.001);
              }}
              className={cn(
                "rounded-md px-1.5 py-2 text-left transition-[background-color,color] duration-150",
                active ? "bg-elevated text-fg" : "text-subtle hover:text-muted",
              )}
            >
              <div className="font-mono text-[10px] tabular-nums">
                {p.range[0].toFixed(2)}
              </div>
              <div className="text-[11px] font-medium leading-tight">{p.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
