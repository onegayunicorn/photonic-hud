import { cn } from "@/lib/utils";

export function MetricRow({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: string;
  tone?: "primary" | "emerald" | "crimson" | "indigo" | "amber" | "muted";
}) {
  const toneClass = {
    primary: "text-primary",
    emerald: "text-emerald",
    crimson: "text-crimson",
    indigo: "text-indigo",
    amber: "text-amber",
    muted: "text-fg",
  }[tone];

  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/70 py-2 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className={cn("font-mono text-sm tabular-nums", toneClass)}>{value}</span>
    </div>
  );
}
