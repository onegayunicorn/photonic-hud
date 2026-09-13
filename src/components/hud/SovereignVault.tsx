import { useKyrexis } from "@/lib/photonic/store";
import { shortHash } from "@/lib/photonic/hash";
import { EVIDENCE_LEVELS, type EvidenceLevel } from "@/lib/photonic/merkle";
import { phaseAt } from "@/lib/photonic/phases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function levelTone(level: EvidenceLevel): "primary" | "crimson" | "amber" | "emerald" | "indigo" {
  switch (level) {
    case "L0":
      return "amber";
    case "L1":
      return "primary";
    case "L2":
      return "indigo";
    case "L3":
      return "emerald";
    default:
      return "primary";
  }
}

export function SovereignVault() {
  const chain = useKyrexis((s) => s.chain);
  const chainOk = useKyrexis((s) => s.chainOk);
  const sealing = useKyrexis((s) => s.sealing);
  const tau = useKyrexis((s) => s.tau);
  const seal = useKyrexis((s) => s.seal);
  const verify = useKyrexis((s) => s.verify);

  const phase = phaseAt(tau);
  const leaf = chain.length ? chain[chain.length - 1] : undefined;
  const rootPreview = leaf ? shortHash(leaf.hash, 16) : "—";

  // Newest first for display
  const rows = [...chain].reverse().slice(0, 24);

  return (
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-2 rounded-full",
              chainOk ? "bg-emerald" : "bg-crimson",
            )}
          />
          <span className="font-mono text-xs text-muted">
            {chainOk ? "Chain verified" : "Chain breached"}
          </span>
          <span className="font-mono text-xs text-muted">·</span>
          <span className="font-mono text-xs text-muted">
            {chain.length} sealed
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={sealing}
            onClick={() => verify()}
          >
            Verify
          </Button>
          <Button
            size="sm"
            disabled={sealing}
            onClick={() =>
              void seal(
                "manual",
                `Manual seal · τ=${tau.toFixed(4)} · ${phase.label}`,
                "L1",
              )
            }
          >
            {sealing ? "Sealing…" : "Seal current"}
          </Button>
        </div>
      </div>

      {/* Merkle root preview */}
      <div className="rounded-md bg-elevated px-3 py-2">
        <p className="mb-1 text-[10px] uppercase tracking-wider text-muted">
          Latest leaf / root tip
        </p>
        <p className="break-all font-mono text-xs text-primary">{rootPreview}</p>
        {leaf && (
          <p className="mt-1 font-mono text-[11px] text-muted">
            #{leaf.index} · {leaf.module} · {leaf.timestamp.slice(0, 19)}
          </p>
        )}
      </div>

      {/* Ledger table */}
      <div className="max-h-72 overflow-y-auto rounded-md border border-border">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-border font-mono text-[10px] uppercase tracking-wider text-muted">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Module</th>
              <th className="px-3 py-2 font-medium">Level</th>
              <th className="px-3 py-2 font-medium">Note</th>
              <th className="px-3 py-2 font-medium">Hash</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-center font-mono text-muted"
                >
                  hydrating genesis…
                </td>
              </tr>
            )}
            {rows.map((entry) => (
              <tr
                key={entry.hash}
                className="border-b border-border/60 transition hover:bg-crimson/5"
              >
                <td className="px-3 py-2 font-mono tabular-nums text-muted">
                  {entry.index}
                </td>
                <td className="px-3 py-2 font-mono text-foreground">
                  {entry.module}
                </td>
                <td className="px-3 py-2">
                  <Badge tone={levelTone(entry.level)} className="text-[10px]">
                    {entry.level} · {EVIDENCE_LEVELS[entry.level]}
                  </Badge>
                </td>
                <td className="max-w-[180px] truncate px-3 py-2 text-muted">
                  {entry.note}
                </td>
                <td className="px-3 py-2 font-mono text-muted">
                  {shortHash(entry.hash, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
