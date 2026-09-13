import { useEffect, useState } from "react";
import { sacb } from "@/lib/bridge/client";
import { sealCurrentCycleToSACB } from "@/lib/bridge/seal";
import { FIXTURE_TAU_1 } from "@/lib/bridge/fixtures";
import type { BridgeStatus, SignedLeaf } from "@/lib/bridge/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { shortHash } from "@/lib/photonic/hash";

export function EvidencePanel() {
  const [status, setStatus] = useState<BridgeStatus | null>(null);
  const [lastSeal, setLastSeal] = useState<SignedLeaf | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    sacb
      .getStatus()
      .then((s) => {
        if (!cancelled) setStatus(s);
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "SACB unreachable");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSeal = async () => {
    setLoading(true);
    setError(null);
    setLastMessage(null);
    try {
      const result = await sealCurrentCycleToSACB();
      if (result) {
        setLastSeal(result.signed);
        setLastMessage(result.verification.message);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Seal failed");
    } finally {
      setLoading(false);
    }
  };

  if (error && !status) {
    return (
      <div className="rounded-md border border-crimson/30 bg-crimson/5 p-4 text-sm text-muted">
        Bridge offline: {error}
      </div>
    );
  }

  if (!status) {
    return (
      <div className="p-4 font-mono text-sm text-muted">
        Connecting to SACB…
      </div>
    );
  }

  const isReal =
    status.backend_mode === "real" && status.liboqs_loaded === true;
  const modeTone = isReal ? "emerald" : "crimson";

  return (
    <div className="flex flex-col gap-4">
      {/* Status header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={
              status.sacb_available
                ? "size-2 rounded-full bg-emerald"
                : "size-2 rounded-full bg-crimson"
            }
          />
          <span className="font-mono text-xs text-muted">
            {status.sacb_available ? "SACB connected" : "SACB offline"}
          </span>
        </div>
        <Badge tone={modeTone}>
          {isReal ? "L1 REAL" : "L2 SIMULATION"}
          {status.liboqs_loaded ? " · native" : " · interface only"}
        </Badge>
      </div>

      {/* Explicit non-claim banner */}
      {!isReal && (
        <div className="rounded-md border border-crimson/20 bg-crimson/5 px-3 py-2 text-[11px] leading-relaxed text-muted">
          <strong className="text-crimson">Non-claim:</strong> signatures are{" "}
          <code className="text-foreground">SIM-MLDSA65-*</code>. Not
          cryptographically binding. L1 requires real liboqs + promotion gate.
        </div>
      )}

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
        <div>
          <p className="mb-0.5 text-[10px] uppercase tracking-wider text-muted">
            Boundary seal
          </p>
          <p className="font-mono text-primary">
            {shortHash(status.boundary_seal, 12)}…
          </p>
        </div>
        <div>
          <p className="mb-0.5 text-[10px] uppercase tracking-wider text-muted">
            Merkle root
          </p>
          <p className="font-mono text-primary">
            {shortHash(status.merkle_root, 12)}…
          </p>
        </div>
        <div>
          <p className="mb-0.5 text-[10px] uppercase tracking-wider text-muted">
            Chain height
          </p>
          <p className="font-mono text-foreground">{status.chain_height} leaves</p>
        </div>
        <div>
          <p className="mb-0.5 text-[10px] uppercase tracking-wider text-muted">
            liboqs / ML-DSA
          </p>
          <p className="font-mono text-muted">
            {status.liboqs_loaded ? "Native L1 path" : "Simulation L2"}
          </p>
        </div>
        <div>
          <p className="mb-0.5 text-[10px] uppercase tracking-wider text-muted">
            Evidence level
          </p>
          <p className="font-mono text-foreground">
            {lastSeal?.evidence_level ?? (isReal ? "L1 eligible" : "L2")}
          </p>
        </div>
        <div>
          <p className="mb-0.5 text-[10px] uppercase tracking-wider text-muted">
            Mechanism
          </p>
          <p className="font-mono text-muted">ML-DSA-65</p>
        </div>
      </div>

      {/* Canonical reference (engine, not simplified formulas) */}
      <div className="rounded-md bg-elevated px-3 py-2 font-mono text-[10px] text-muted">
        Canonical τ=1 (engine): C {FIXTURE_TAU_1.coherence.toFixed(5)} · S{" "}
        {FIXTURE_TAU_1.entropy.toFixed(3)} · F{" "}
        {FIXTURE_TAU_1.fidelity.toFixed(4)} · mesh{" "}
        {FIXTURE_TAU_1.meshCoherence.toFixed(4)}
      </div>

      {/* Action */}
      <Button onClick={handleSeal} disabled={loading} className="w-full">
        {loading ? "Sealing…" : "Seal current cycle to EvidenceChain"}
      </Button>

      {error && (
        <p className="font-mono text-xs text-crimson">{error}</p>
      )}

      {/* Last seal result */}
      {lastSeal && (
        <div className="rounded-md border border-emerald/25 bg-emerald/5 p-3">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-emerald">
            Leaf sealed · {lastSeal.evidence_level}
            {lastSeal.evidence_level !== "L1" ? " (non-binding)" : ""}
          </p>
          <div className="space-y-0.5 font-mono text-[11px] leading-relaxed text-muted">
            <div>
              <span className="text-muted">Index </span>
              <span className="text-foreground">{lastSeal.index}</span>
            </div>
            <div>
              <span className="text-muted">τ </span>
              <span className="text-foreground">
                {lastSeal.tau.toFixed(4)} · {lastSeal.phase}
              </span>
            </div>
            <div>
              <span className="text-muted">C/S </span>
              <span className="text-foreground">
                {lastSeal.coherence.toFixed(5)} / {lastSeal.entropy.toFixed(3)}
              </span>
            </div>
            <div>
              <span className="text-muted">Hash </span>
              <span className="text-primary">
                {shortHash(lastSeal.leaf_hash, 16)}…
              </span>
            </div>
            <div>
              <span className="text-muted">Sig </span>
              <span className="text-muted">
                {lastSeal.signature.slice(0, 28)}…
              </span>
            </div>
            {lastMessage && (
              <div className="pt-1 text-emerald">{lastMessage}</div>
            )}
          </div>
        </div>
      )}

      <p className="text-[10px] leading-relaxed text-muted">
        Metrics are sealed from <code>metricsAt</code> (engine keyframes), not
        simplified trig formulas. Simulation signatures remain L2 until the
        full promotion gate passes (see BRIDGE_SPEC.md).
      </p>
    </div>
  );
}
