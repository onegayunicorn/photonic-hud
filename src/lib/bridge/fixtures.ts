/**
 * Canonical seal fixtures — generated from the real engine (metricsAt).
 *
 * SOURCE OF TRUTH: src/lib/photonic/engine.ts
 *   - coherenceAt / entropyAt use keyframe interpolation (COHERENCE_KEYS, ENTROPY_KEYS)
 *   - NOT the simplified trig forms sometimes shown in external manuals:
 *       C = 1 − 0.28·sin(2πτ)·exp(−0.4τ)
 *       S = 0.28 + 0.48τ − 0.18·sin(3πτ)
 *       F = 0.92 + 0.08·(1 − exp(−3τ))
 *     Those are non-canonical approximations and must not be used for seals.
 *
 * If a document appendix disagrees with these fixtures, the document is wrong
 * until regenerated from this module (or from metricsAt directly).
 */

import {
  metricsAt,
  sampleSpectrum,
  type CycleMetrics,
} from "@/lib/photonic/engine";
import { phaseAt } from "@/lib/photonic/phases";

export type FixturePoint = {
  tau: number;
  phase: string;
  coherence: number;
  entropy: number;
  unitarity: number;
  gammaFreq: number;
  filaments: number;
  fidelity: number;
  correlation: number;
  meshCoherence: number;
};

function point(tau: number): FixturePoint {
  const m: CycleMetrics = metricsAt(tau);
  const spec = sampleSpectrum(tau, 12);
  const mesh = (m.coherence + spec.fidelity) / 2;
  return {
    tau: m.tau,
    phase: phaseAt(m.tau).label,
    coherence: m.coherence,
    entropy: m.entropy,
    unitarity: m.unitarity,
    gammaFreq: m.gammaFreq,
    filaments: m.filaments,
    fidelity: spec.fidelity,
    correlation: spec.correlation,
    meshCoherence: mesh,
  };
}

/** Canonical checkpoints used by tests and documentation. */
export const CANONICAL_FIXTURES: FixturePoint[] = [
  point(0),
  point(0.33),
  point(0.4),
  point(0.66),
  point(0.75),
  point(0.88),
  point(1),
];

/** Convenience: exact New Being (τ = 1) record for appendix regeneration. */
export const FIXTURE_TAU_1 = CANONICAL_FIXTURES[CANONICAL_FIXTURES.length - 1];

/**
 * Serialize a fixture for hashing / comparison (stable key order).
 * Precision is fixed so hashes stay deterministic across runs.
 */
export function serializeFixture(p: FixturePoint): string {
  return JSON.stringify({
    tau: Number(p.tau.toFixed(6)),
    phase: p.phase,
    coherence: Number(p.coherence.toFixed(8)),
    entropy: Number(p.entropy.toFixed(8)),
    unitarity: Number(p.unitarity.toFixed(12)),
    gammaFreq: Number(p.gammaFreq.toFixed(4)),
    filaments: p.filaments,
    fidelity: Number(p.fidelity.toFixed(8)),
    correlation: Number(p.correlation.toFixed(8)),
    meshCoherence: Number(p.meshCoherence.toFixed(8)),
  });
}
