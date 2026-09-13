import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { MetricRow } from "@/components/hud/MetricRow";
import { PALETTE } from "@/lib/photonic/palette";
import { useKyrexis } from "@/lib/photonic/store";

export const Route = createFileRoute("/hardware")({ component: HardwarePage });

function SpectrumCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const tau = useKyrexis((s) => s.tau);
  const freq = useKyrexis((s) => s.metrics.gammaFreq);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = PALETTE.elevated;
    ctx.fillRect(0, 0, w, h);

    const bins = 96;
    const barW = w / bins;
    for (let i = 0; i < bins; i++) {
      const f = i / bins;
      const carrier = Math.exp(-((f - 0.42) ** 2) / 0.004);
      const usb = Math.exp(-((f - 0.42 - 0.06) ** 2) / 0.0012);
      const lsb = Math.exp(-((f - 0.42 + 0.06) ** 2) / 0.0012);
      const beat = 0.15 * Math.exp(-((f - freq / 120) ** 2) / 0.002);
      const noise = 0.04 + 0.03 * Math.sin(i * 1.7 + tau * 9);
      const mag = Math.min(1, carrier * 0.15 + usb + lsb + beat + noise);
      const bh = mag * h * 0.88;
      ctx.fillStyle = i % 3 === 0 ? PALETTE.primary : PALETTE.indigo;
      ctx.globalAlpha = 0.35 + mag * 0.65;
      ctx.fillRect(i * barW + 1, h - bh, Math.max(1, barW - 2), bh);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `${11 * dpr}px "IBM Plex Mono", monospace`;
    ctx.fillText("DSB-SC  ·  fc + 7 Hz beat", 8 * dpr, 16 * dpr);
  }, [tau, freq]);

  return <canvas ref={ref} className="block h-48 w-full rounded-md" />;
}

export function HardwarePage() {
  const log = useKyrexis((s) => s.hwLog);
  const m = useKyrexis((s) => s.metrics);
  const running = useKyrexis((s) => s.running);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log.length]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted">
          LAYER 1 — ESP32 / DUPLEX
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Hardware bridge
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          CMD_CYCLE frames [0xAA][0x07][speed][phase][gamma][cksum]. Spectrum is a simulated
          DSB-SC sideband with a 7 Hz bio-beat envelope — no radio is transmitted from this
          preview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Link</CardTitle>
            <Badge tone={running ? "emerald" : "amber"}>
              {running ? "Streaming" : "Idle"}
            </Badge>
          </CardHeader>
          <MetricRow label="Endpoint" value="WS simulated" tone="muted" />
          <MetricRow label="Serial" value="115200 8N1" />
          <MetricRow label="Agents" value="43" />
          <MetricRow label="Fold" value="FE-OGUF-P1" tone="indigo" />
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Sideband analyzer</CardTitle>
              <CardMeta>USB / LSB around carrier · beat tracks gamma</CardMeta>
            </div>
          </CardHeader>
          <SpectrumCanvas />
        </Card>
      </div>

      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <CardTitle>Serial console</CardTitle>
          <span className="font-mono text-[11px] text-muted">
            {m.filaments} filaments · {m.gammaFreq.toFixed(1)} Hz
          </span>
        </div>
        <div
          ref={logRef}
          className="max-h-72 overflow-auto bg-bg px-4 py-3 font-mono text-[11px] leading-relaxed text-muted"
        >
          {log.length === 0 ? (
            <p>Awaiting CMD_CYCLE — run the cycle to emit frames.</p>
          ) : (
            log.map((row, i) => (
              <div key={`${row.t}-${i}`} className="whitespace-nowrap">
                {row.line}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
