import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useKyrexis } from "@/lib/photonic/store";
import { cn } from "@/lib/utils";

export function CycleControls({ compact = false }: { compact?: boolean }) {
  const running = useKyrexis((s) => s.running);
  const tau = useKyrexis((s) => s.tau);
  const duration = useKyrexis((s) => s.duration);
  const setRunning = useKyrexis((s) => s.setRunning);
  const setTau = useKyrexis((s) => s.setTau);
  const setDuration = useKyrexis((s) => s.setDuration);
  const reset = useKyrexis((s) => s.reset);

  return (
    <div className={cn("flex flex-col gap-3", compact && "gap-2")}>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => {
            if (tau >= 1) reset();
            setRunning(!running);
          }}
          className="min-w-32"
        >
          {running ? (
            <>
              <Pause /> Pause
            </>
          ) : tau >= 1 ? (
            <>
              <Play /> Run again
            </>
          ) : (
            <>
              <Play /> Run cycle
            </>
          )}
        </Button>
        <Button variant="secondary" onClick={reset} aria-label="Reset cycle">
          <RotateCcw />
          Reset
        </Button>
        <div className="ml-auto flex rounded-md bg-elevated p-1">
          <button
            type="button"
            onClick={() => setDuration("demo")}
            className={cn(
              "h-9 rounded px-3 text-xs font-medium",
              duration === "demo" ? "bg-surface text-fg" : "text-muted",
            )}
          >
            Demo 42s
          </button>
          <button
            type="button"
            onClick={() => setDuration("ritual")}
            className={cn(
              "h-9 rounded px-3 text-xs font-medium",
              duration === "ritual" ? "bg-surface text-fg" : "text-muted",
            )}
          >
            Ritual 5m
          </button>
        </div>
      </div>
      {!compact && (
        <div className="flex items-center gap-3">
          <span className="w-8 font-mono text-[11px] text-muted">τ</span>
          <Slider
            min={0}
            max={1}
            step={0.001}
            value={[tau]}
            onValueChange={([v]) => {
              setRunning(false);
              setTau(v ?? 0);
            }}
          />
          <span className="w-14 text-right font-mono text-xs tabular-nums text-primary">
            {tau.toFixed(3)}
          </span>
        </div>
      )}
    </div>
  );
}
