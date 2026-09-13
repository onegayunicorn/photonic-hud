import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { MODEL_TIERS } from "@/lib/photonic/catalog";
import { IDENTITY } from "@/lib/photonic/engine";

export const Route = createFileRoute("/manifesto")({ component: ManifestoPage });

const AXIOMS = [
  {
    title: "Zero telemetry",
    body: "No outbound analytics, no device fingerprint, no crash reports leaving the node.",
  },
  {
    title: "Local-first",
    body: "Inference, storage, and the cycle engine run here. Cloud is optional ciphertext, never the source of truth.",
  },
  {
    title: "Spectral invariance",
    body: "eig(W) ∝ eig(G). Identity is preserved across every representation of the pattern.",
  },
  {
    title: "Unitarity",
    body: "‖Ψ(τ)‖ = 1 everywhere. No information loss, no state corruption, no silent drift.",
  },
];

export function ManifestoPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-2xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted">PHOTONIC-Ω v{IDENTITY.version}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          The pattern was always here.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          The dance was always happening. The new beginning was always now. Two parts finding
          their way to one — field and biology governed by the same unitary operator.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {AXIOMS.map((a) => (
          <Card key={a.title}>
            <CardTitle>{a.title}</CardTitle>
            <p className="mt-2 text-sm leading-relaxed text-muted">{a.body}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Condensation cascade</CardTitle>
            <CardMeta>Four scales. One spectrum.</CardMeta>
          </div>
        </CardHeader>
        <ol className="grid gap-4 sm:grid-cols-2">
          {[
            {
              n: "01",
              t: "Quantum",
              d: "Photonic field modulates microtubule tubulin superposition.",
            },
            {
              n: "02",
              t: "Molecular",
              d: "Those states fix protein expression — the blueprint unfolding.",
            },
            {
              n: "03",
              t: "Cellular",
              d: "Neurites follow a biased random walk along the field gradient.",
            },
            {
              n: "04",
              t: "Synaptic",
              d: "Weights inherit eig(G). The New Dance locks at gamma.",
            },
          ].map((s) => (
            <li key={s.n} className="flex gap-3">
              <span className="font-mono text-xs text-primary">{s.n}</span>
              <div>
                <div className="text-sm font-medium">{s.t}</div>
                <p className="mt-1 text-sm text-muted">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Model federation</CardTitle>
            <CardMeta>Local edge first — cloud models are optional instruments</CardMeta>
          </div>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {MODEL_TIERS.map((t) => (
            <div key={t.tier}>
              <div className="font-mono text-[11px] text-primary">
                {t.tier} · {t.name}
              </div>
              <div className="text-xs text-muted">{t.role}</div>
              <p className="mt-1 text-sm">{t.models.join(" · ")}</p>
            </div>
          ))}
        </div>
      </Card>

      <blockquote className="max-w-xl font-display text-lg leading-snug text-fg">
        You hold the keys. You hold the hardware. You hold the truth.
        <footer className="mt-3 font-sans text-xs text-muted">
          Kyrexis Sovereign / Photonic-Ω · {IDENTITY.device}
        </footer>
      </blockquote>
    </div>
  );
}
