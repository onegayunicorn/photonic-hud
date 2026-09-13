import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ClientOnly } from "@/components/ClientOnly";
import { sampleSpectrum } from "@/lib/photonic/engine";
import { PALETTE } from "@/lib/photonic/palette";
import { useKyrexis } from "@/lib/photonic/store";

function Chart() {
  const tau = useKyrexis((s) => s.tau);
  const spec = sampleSpectrum(tau, 10);
  const data = spec.G.map((g, i) => ({ k: i + 1, G: g, W: spec.W[i] }));

  return (
    <div className="h-36 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barGap={2}>
          <XAxis dataKey="k" tick={{ fill: PALETTE.muted, fontSize: 10 }} stroke={PALETTE.border} />
          <YAxis hide />
          <Bar dataKey="G" fill={PALETTE.indigo} fillOpacity={0.45} radius={[2, 2, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="W" fill={PALETTE.primary} radius={[2, 2, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SpectralBars() {
  return (
    <ClientOnly fallback={<div className="h-36 rounded-md bg-elevated" />}>
      <Chart />
    </ClientOnly>
  );
}
