import { useKyrexis } from "@/lib/photonic/store";
import { phaseAt } from "@/lib/photonic/phases";
import { sampleSpectrum } from "@/lib/photonic/engine";
import { sha256Hex } from "@/lib/photonic/hash";
import { sacb } from "./client";
import type { MerkleLeaf, SignedLeaf, VerificationResult } from "./types";

/**
 * Build a bridge leaf from live HUD state and request an SACB signature.
 * Also appends a local Merkle entry via the existing store.seal().
 */
export async function sealCurrentCycleToSACB(): Promise<{
  signed: SignedLeaf;
  verification: VerificationResult;
} | null> {
  const state = useKyrexis.getState();
  const { metrics, chain } = state;
  const phase = phaseAt(metrics.tau);

  const spectral = sampleSpectrum(metrics.tau, 12);
  const spectralPayload = JSON.stringify({
    G: spectral.G.slice(0, 8),
    W: spectral.W.slice(0, 8),
    fidelity: spectral.fidelity,
    correlation: spectral.correlation,
  });
  const spectral_hash = (await sha256Hex(spectralPayload)).slice(0, 24);

  const leaf: MerkleLeaf = {
    index: `KX-${String(chain.length + 1).padStart(3, "0")}`,
    tau: metrics.tau,
    phase: phase.label,
    coherence: metrics.coherence,
    entropy: metrics.entropy,
    unitarity: metrics.unitarity,
    gammaFreq: metrics.gammaFreq,
    filaments: metrics.filaments,
    spectral_hash,
    timestamp: Date.now(),
  };

  const signed = await sacb.signLeaf(leaf);
  const verification = await sacb.verifyLeaf(signed);

  // Always record in the local HUD Merkle chain (existing seal path)
  await state.seal(
    "bridge",
    `Bridge seal · τ=${metrics.tau.toFixed(4)} · ${phase.label} · ${signed.evidence_level} · ${signed.signature.slice(0, 20)}…`,
    signed.evidence_level === "L1" ? "L1" : "L1",
  );

  return { signed, verification };
}
