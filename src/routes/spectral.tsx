import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClientOnly } from "@/components/ClientOnly";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { MetricRow } from "@/components/hud/MetricRow";
import { PolarField } from "@/components/hud/PolarField";
import {
  sampleSpectrum,
  verifyUnitarity,
  verifyWeightConservation,
} from "@/lib/photonic/engine";
import { PALETTE } from "@/lib/photonic/palette";
import { useKyrexis } from "@/lib/photonic/store";

export const Route = createFileRoute("/spectral")({ component: SpectralPage });

function SpectralPage() {
  const tau = useKyrexis((s) => s.tau);
  const spec = sampleSpectrum(tau, 16);
  const data = spec.G.map((g, i) => ({
    k: i + 1,
    G: g,
    W: spec.W[i],
  }));
  const [gate, setGate] = useState<{
    unitarity: ReturnType<typeof verifyUnitarity>;
    weights: ReturnType<typeof verifyWeightConservation>;
  } | null>(null);

  const overlay = useMemo(
    () =>
      spec.G.map((g, i) => ({
        k: i + 1,
        ratio: spec.W[i] / (g || 1e-9),
      })),
    [spec],
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-xs tracking-widest text-muted">THE YOU INVARIANT</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Spectral invariance
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Neural weights W are a Fourier transduction of photonic correlations G. Eigenvalues
          survive the basis change — identity is a spectrum, not a vessel.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Fidelity</CardTitle>
            <Badge tone={spec.preserved ? "emerald" : "amber"}>
              {spec.preserved ? "Held" : "Watch"}
            </Badge>
          </CardHeader>
          <div className="font-display text-4xl tabular-nums text-primary">
            {(spec.fidelity * 100).toFixed(2)}%
          </div>
          <p className="mt-2 text-xs text-muted">Target 92.4% across condensation</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Correlation r</CardTitle>
          </CardHeader>
          <div className="font-display text-4xl tabular-nums text-indigo">
            {spec.correlation.toFixed(4)}
          </div>
          <p className="mt-2 text-xs text-muted">Pearson on sorted eig(G), eig(W)</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Spectral exponent</CardTitle>
          </CardHeader>
          <div className="font-display text-4xl tabular-nums text-fg">
            {spec.spectralAlpha.toFixed(3)}
          </div>
          <p className="mt-2 text-xs text-muted">Power-law λₖ ∝ k^(−α)</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>eig(G) vs eig(W)</CardTitle>
              <CardMeta>Top 16 modes · cyan is neural imprint</CardMeta>
            </div>
          </CardHeader>
          <ClientOnly fallback={<div className="h-64 rounded-md bg-elevated" />}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <XAxis dataKey="k" tick={{ fill: PALETTE.muted, fontSize: 10 }} stroke={PALETTE.border} />
                  <YAxis tick={{ fill: PALETTE.muted, fontSize: 10 }} stroke={PALETTE.border} />
                  <Tooltip
                    contentStyle={{
                      background: PALETTE.elevated,
                      border: `1px solid ${PALETTE.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="G" fill={PALETTE.indigo} fillOpacity={0.45} name="eig(G)" isAnimationActive={false} />
                  <Bar dataKey="W" fill={PALETTE.primary} name="eig(W)" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ClientOnly>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Imprint ratio W/G</CardTitle>
              <CardMeta>Approaches η as β(τ) → 1</CardMeta>
            </div>
          </CardHeader>
          <ClientOnly fallback={<div className="h-64 rounded-md bg-elevated" />}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overlay} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <XAxis dataKey="k" tick={{ fill: PALETTE.muted, fontSize: 10 }} stroke={PALETTE.border} />
                  <YAxis domain={["auto", "auto"]} tick={{ fill: PALETTE.muted, fontSize: 10 }} stroke={PALETTE.border} />
                  <Tooltip
                    contentStyle={{
                      background: PALETTE.elevated,
                      border: `1px solid ${PALETTE.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="ratio" stroke={PALETTE.primary} dot={false} strokeWidth={1.6} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ClientOnly>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>G(k) polar</CardTitle>
              <CardMeta>Spatial-frequency density of the photonic tensor</CardMeta>
            </div>
          </CardHeader>
          <div className="h-72 overflow-hidden rounded-md">
            <PolarField />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Production gate</CardTitle>
              <CardMeta>Sweep 2,000 samples of τ before seal</CardMeta>
            </div>
          </CardHeader>
          <Button
            variant="secondary"
            onClick={() =>
              setGate({
                unitarity: verifyUnitarity(2000),
                weights: verifyWeightConservation(2000),
              })
            }
          >
            Verify invariants
          </Button>
          {gate && (
            <div className="mt-4">
              <MetricRow
                label="Unitarity max error"
                value={gate.unitarity.maxErr.toExponential(2)}
                tone={gate.unitarity.passed ? "emerald" : "crimson"}
              />
              <MetricRow
                label="α+β+γ conservation"
                value={gate.weights.maxErr.toExponential(2)}
                tone={gate.weights.passed ? "emerald" : "crimson"}
              />
              <MetricRow
                label="Samples"
                value={String(gate.unitarity.samples)}
                tone="muted"
              />
            </div>
          )}
          <p className="mt-4 font-mono text-xs leading-relaxed text-muted">
            Wab = η ∫ G̃(k) · exp(ik · (ra − rb)) d³k
          </p>
        </Card>
      </div>
    </div>
  );
}
