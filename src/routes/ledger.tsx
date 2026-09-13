import { createFileRoute } from "@tanstack/react-router";
import { Download, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { EVIDENCE_LEVELS } from "@/lib/photonic/merkle";
import { IDENTITY } from "@/lib/photonic/engine";
import { shortHash } from "@/lib/photonic/hash";
import { useKyrexis } from "@/lib/photonic/store";

export const Route = createFileRoute("/ledger")({ component: LedgerPage });

function tone(level: string) {
  if (level === "L3") return "emerald" as const;
  if (level === "L2") return "primary" as const;
  if (level === "L1") return "indigo" as const;
  return "amber" as const;
}

export function LedgerPage() {
  const chain = useKyrexis((s) => s.chain);
  const chainOk = useKyrexis((s) => s.chainOk);
  const verify = useKyrexis((s) => s.verify);
  const cycleCount = useKyrexis((s) => s.cycleCount);
  const metrics = useKyrexis((s) => s.metrics);
  const hydrated = useKyrexis((s) => s.hydrated);

  function exportProof() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            identity: IDENTITY,
            verified: chainOk,
            cycleCount,
            metrics,
            chain,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kyrexis-proof.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted">INTEGRITY</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Merkle ledger
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Every phase change, sync, and verification is a leaf. Prev-hash chained. Exportable as
          proof.json.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={chainOk ? "emerald" : "crimson"}>
          {chainOk ? "Chain verified" : "Chain breached"}
        </Badge>
        <Badge tone="muted">{chain.length} leaves</Badge>
        <Badge tone="muted">{cycleCount} cycles</Badge>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => verify()}>
            <ShieldCheck className="size-3.5" />
            Re-verify
          </Button>
          <Button size="sm" onClick={exportProof} disabled={!hydrated}>
            <Download className="size-3.5" />
            Export proof
          </Button>
        </div>
      </div>

      <Card className="p-0">
        {!hydrated && (
          <p className="px-5 py-8 text-sm text-muted">Sealing genesis…</p>
        )}
        <ol className="divide-y divide-border">
          {[...chain].reverse().map((e) => (
            <li key={e.hash} className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-subtle">#{e.index}</span>
                <Badge tone={tone(e.level)}>
                  {e.level} · {EVIDENCE_LEVELS[e.level]}
                </Badge>
                <span className="text-sm font-medium">{e.module}</span>
                <span className="ml-auto font-mono text-[11px] text-muted">
                  {new Date(e.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{e.note}</p>
              <p className="mt-2 font-mono text-[11px] break-all text-subtle">
                {shortHash(e.hash, 20)}… · prev {shortHash(e.prevHash, 8)}
              </p>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
          <CardMeta>Device-bound constants</CardMeta>
        </CardHeader>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted">Device</dt>
            <dd className="font-mono text-xs">{IDENTITY.device}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Version</dt>
            <dd className="font-mono text-xs">{IDENTITY.version}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Schumann / 432 / 7 Hz</dt>
            <dd className="font-mono text-xs">
              {IDENTITY.frequencyLock.schumann} · {IDENTITY.frequencyLock.photonicHz} ·{" "}
              {IDENTITY.frequencyLock.bioBeatHz}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Seed pair</dt>
            <dd className="font-mono text-xs">
              {IDENTITY.enoryt} · {IDENTITY.victoria}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
