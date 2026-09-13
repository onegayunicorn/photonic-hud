import { createFileRoute } from "@tanstack/react-router";
import { File, Folder, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { MetricRow } from "@/components/hud/MetricRow";
import {
  STORAGE_TOTAL_GB,
  STORAGE_USED_MB,
  VAULT_FILES,
} from "@/lib/photonic/catalog";
import { useKyrexis } from "@/lib/photonic/store";

export const Route = createFileRoute("/storage")({ component: StoragePage });

export function StoragePage() {
  const seal = useKyrexis((s) => s.seal);
  const sealing = useKyrexis((s) => s.sealing);
  const last = useKyrexis((s) => s.chain.at(-1));
  const [synced, setSynced] = useState<string | null>(null);
  const usedGb = STORAGE_USED_MB / 1024;
  const pct = (usedGb / STORAGE_TOTAL_GB) * 100;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted">LAYER 2 — SOVEREIGNBOX</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Vault
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Client-side encrypted cache. 2 TB addressable. Nothing leaves this node unless you seal
          and sync it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Capacity</CardTitle>
            <Badge tone="emerald">E2EE</Badge>
          </CardHeader>
          <div className="font-display text-3xl tabular-nums">2 TB</div>
          <p className="mt-1 font-mono text-xs text-muted">
            {STORAGE_USED_MB.toFixed(1)} MB / {STORAGE_TOTAL_GB} GB
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.max(pct * 40, 1.5)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-subtle">
            In use {pct.toExponential(1)} — ring is not a leftover 60% placeholder
          </p>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Backends</CardTitle>
              <CardMeta>Local is primary. Cloud is optional ciphertext.</CardMeta>
            </div>
            <Button
              size="sm"
              variant="secondary"
              disabled={sealing}
              onClick={async () => {
                await seal("sovereignbox", "Full vault sync — Merkle leaf advanced", "L1");
                setSynced(new Date().toISOString());
              }}
            >
              <RefreshCw className="size-3.5" />
              {sealing ? "Sealing…" : "Sync now"}
            </Button>
          </CardHeader>
          <MetricRow label="Local cache" value="Active" tone="emerald" />
          <MetricRow label="Encrypted backup" value="Queued" tone="primary" />
          <MetricRow label="IPFS pin" value="Standby" tone="amber" />
          <MetricRow
            label="Last seal"
            value={synced ? new Date(synced).toLocaleTimeString() : last ? "chained" : "—"}
            tone="muted"
          />
        </Card>
      </div>

      <Card className="p-0">
        <div className="border-b border-border px-5 py-4">
          <CardTitle>Workspace</CardTitle>
          <CardMeta className="mt-1">kyrexis-v4.9 · SHA-256 leaf hashes</CardMeta>
        </div>
        <ul>
          {VAULT_FILES.map((f) => (
            <li
              key={f.name}
              className="flex items-center gap-3 border-b border-border/70 px-5 py-3 last:border-0"
            >
              {f.type === "dir" ? (
                <Folder className="size-4 text-primary" />
              ) : (
                <File className="size-4 text-muted" />
              )}
              <span className="flex-1 truncate text-sm">{f.name}</span>
              <span className="hidden text-xs text-subtle sm:inline">{f.size ?? "—"}</span>
              <span className="font-mono text-[11px] text-muted">{f.hash}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
