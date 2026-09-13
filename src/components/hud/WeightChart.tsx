import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClientOnly } from "@/components/ClientOnly";
import { weights } from "@/lib/photonic/engine";
import { PALETTE } from "@/lib/photonic/palette";
import { useKyrexis } from "@/lib/photonic/store";

const DATA = Array.from({ length: 101 }, (_, i) => {
  const tau = i / 100;
  return { tau, ...weights(tau) };
});

function Chart() {
  const tau = useKyrexis((s) => s.tau);
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={DATA} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={PALETTE.border} strokeDasharray="3 4" />
          <XAxis
            dataKey="tau"
            type="number"
            domain={[0, 1]}
            tick={{ fill: PALETTE.muted, fontSize: 10 }}
            tickFormatter={(v) => Number(v).toFixed(1)}
            stroke={PALETTE.border}
          />
          <YAxis
            domain={[0, 1]}
            tick={{ fill: PALETTE.muted, fontSize: 10 }}
            stroke={PALETTE.border}
          />
          <Tooltip
            contentStyle={{
              background: PALETTE.elevated,
              border: `1px solid ${PALETTE.border}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(v) => `τ ${Number(v).toFixed(3)}`}
          />
          <Line type="monotone" dataKey="alpha" stroke={PALETTE.primary} dot={false} strokeWidth={1.6} name="α bio" isAnimationActive={false} />
          <Line type="monotone" dataKey="gamma" stroke={PALETTE.indigo} dot={false} strokeWidth={1.6} name="γ field" isAnimationActive={false} />
          <Line type="monotone" dataKey="beta" stroke={PALETTE.emerald} dot={false} strokeWidth={1.6} name="β new-bio" isAnimationActive={false} />
          <ReferenceLine x={tau} stroke={PALETTE.fg} strokeOpacity={0.4} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WeightChart() {
  return (
    <ClientOnly fallback={<div className="h-44 rounded-md bg-elevated" />}>
      <Chart />
    </ClientOnly>
  );
}
