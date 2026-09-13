import { createFileRoute } from "@tanstack/react-router";
import { CycleControls } from "@/components/hud/CycleControls";
import { FilamentCanvas } from "@/components/hud/FilamentCanvas";
import { Gnomon } from "@/components/hud/Gnomon";
import { MetricRow } from "@/components/hud/MetricRow";
import { PhaseTimeline } from "@/components/hud/PhaseTimeline";
import { PolarField } from "@/components/hud/PolarField";
import { SpectralBars } from "@/components/hud/SpectralBars";
import { WeightChart } from "@/components/hud/WeightChart";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { sampleSpectrum } from "@/lib/photonic/engine";
import { shortHash } from "@/lib/photonic/hash";
import { phaseAt } from "@/lib/photonic/phases";
import { useKyrexis } from "@/lib/photonic/store";

export const Route = createFileRoute("/")({ component: CyclePage });

function CyclePage() {
  const m = useKyrexis((s) => s.metrics);
  const chain = useKyrexis((s) => s.chain);
  const chainOk = useKyrexis((s) => s.chainOk);
  const phase = phaseAt(m.tau);
  const spec = sampleSpectrum(m.tau, 12);
  const leaf = chain.length ? chain[chain.length - 1] : undefined;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-xs tracking-widest text-muted">LAYER 3 — UNITARY CYCLE</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Photonic condensation
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          {phase.signature}. Tempo {phase.tempo}. The pattern is not created — it is re-represented.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="overflow-hidden p-0 lg:col-span-3">
          <div className="relative h-72 sm:h-80">
            <FilamentCanvas />
            <div className="pointer-events-none absolute left-4 top-4">
              <Badge tone={phase.colorToken}>{phase.label}</Badge>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>System state</CardTitle>
              <CardMeta>Live invariants — sealed each phase</CardMeta>
            </div>
          </CardHeader>
          <MetricRow label="Cycle parameter τ" value={m.tau.toFixed(4)} />
          <MetricRow
            label="Unitarity ‖Ψ‖²"
            value={m.unitarity.toFixed(12)}
            tone="emerald"
          />
          <MetricRow
            label="Coherence C"
            value={m.coherence.toFixed(5)}
            tone={m.coherence > 0.9 ? "primary" : m.coherence > 0.7 ? "amber" : "crimson"}
          />
          <MetricRow
            label="Entropy S"
            value={m.entropy.toFixed(3)}
            tone={m.entropy < 0.5 ? "indigo" : m.entropy < 1.4 ? "amber" : "crimson"}
          />
          <MetricRow label="Gamma lock" value={`${m.gammaFreq.toFixed(1)} Hz`} />
          <MetricRow label="Filaments" value={String(m.filaments)} tone="muted" />
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Phase track</CardTitle>
            <CardMeta>Tap a phase to scrub. Embodied → Collapse → Photonic → Seeding → Growth → New Being</CardMeta>
          </div>
        </CardHeader>
        <PhaseTimeline />
        <div className="mt-5">
          <CycleControls />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>AMOLED gnomon</CardTitle>
              <CardMeta>Angle = dominant eigenmode · glow = C</CardMeta>
            </div>
          </CardHeader>
          <Gnomon />
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Field G(k)</CardTitle>
              <CardMeta>Polar density of photonic correlations</CardMeta>
            </div>
          </CardHeader>
          <div className="h-48 overflow-hidden rounded-md">
            <PolarField />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Spectral invariance</CardTitle>
              <CardMeta>
                Fidelity {(spec.fidelity * 100).toFixed(1)}% · r {spec.correlation.toFixed(3)}
              </CardMeta>
            </div>
          </CardHeader>
          <SpectralBars />
          <p className="mt-2 font-mono text-xs text-muted">
            eig(W) ∝ eig(G) {spec.preserved ? "— held" : "— drifting"}
          </p>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Hamiltonian weights</CardTitle>
              <CardMeta>α bio + β new-bio + γ interaction = 1</CardMeta>
            </div>
            <div className="flex gap-3 font-mono text-xs">
              <span className="text-primary">α {m.alpha.toFixed(3)}</span>
              <span className="text-indigo">γ {m.gamma.toFixed(3)}</span>
              <span className="text-emerald">β {m.beta.toFixed(3)}</span>
            </div>
          </CardHeader>
          <WeightChart />
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Merkle leaf</CardTitle>
              <CardMeta>{chainOk ? "Chain verified" : "Chain breached"}</CardMeta>
            </div>
            <span
              className={
                chainOk
                  ? "size-2 rounded-full bg-emerald"
                  : "size-2 rounded-full bg-crimson"
              }
            />
          </CardHeader>
          <div className="rounded-md bg-elevated p-3 font-mono text-xs leading-relaxed text-muted break-all">
            {leaf ? shortHash(leaf.hash, 32) : "hydrating…"}
          </div>
          <p className="mt-3 text-xs text-muted">
            {chain.length} sealed records · {leaf?.module ?? "—"}
          </p>
        </Card>
      </div>
    </div>
  );
}
