import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { PEERS, TRUST_TIERS } from "@/lib/photonic/catalog";
import { useKyrexis } from "@/lib/photonic/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mesh")({ component: MeshPage });

export function MeshPage() {
  const running = useKyrexis((s) => s.running);
  const tau = useKyrexis((s) => s.tau);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted">LAYER 1 — WIRED MESH</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Trusted nodes
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Trackerless discovery. Four trust tiers. The network is the people you already trust —
          not a public DHT of strangers.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {PEERS.map((p) => {
          const jitter =
            p.status === "online" && running
              ? Math.round(p.latency + Math.sin(tau * 40 + p.tier) * 3)
              : p.latency;
          return (
            <Card key={p.id}>
              <CardHeader>
                <div>
                  <CardTitle>{p.name}</CardTitle>
                  <CardMeta>{p.role}</CardMeta>
                </div>
                <Badge tone={p.status === "online" ? "emerald" : "crimson"}>
                  {p.status}
                </Badge>
              </CardHeader>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Tier {p.tier}</span>
                <span className="font-mono tabular-nums">
                  {p.status === "online" ? `${jitter} ms` : "—"}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-elevated">
                <div
                  className={cn(
                    "h-full rounded-full",
                    p.strength > 80
                      ? "bg-emerald"
                      : p.strength > 50
                        ? "bg-amber"
                        : "bg-crimson",
                  )}
                  style={{ width: `${p.strength}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Trust matrix</CardTitle>
            <CardMeta>Least privilege between nodes</CardMeta>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th className="pb-2 pr-4 font-medium">Tier</th>
                <th className="pb-2 pr-4 font-medium">Name</th>
                <th className="pb-2 font-medium">Capabilities</th>
              </tr>
            </thead>
            <tbody>
              {TRUST_TIERS.map((t) => (
                <tr key={t.tier} className="border-t border-border">
                  <td className="py-3 pr-4 font-mono text-primary">T{t.tier}</td>
                  <td className="py-3 pr-4">{t.name}</td>
                  <td className="py-3 text-muted">{t.capabilities}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
