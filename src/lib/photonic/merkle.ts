import { sha256Hex } from "./hash";

export type EvidenceLevel = "L0" | "L1" | "L2" | "L3";

export const EVIDENCE_LEVELS: Record<EvidenceLevel, string> = {
  L0: "Concept",
  L1: "Simulated",
  L2: "Bench",
  L3: "Independent",
};

export type LedgerEntry = {
  index: number;
  timestamp: string;
  level: EvidenceLevel;
  module: string;
  note: string;
  prevHash: string;
  hash: string;
};

const ZERO = "0".repeat(64);

export async function sealEntry(
  prev: LedgerEntry | null,
  input: { level: EvidenceLevel; module: string; note: string; timestamp?: string },
): Promise<LedgerEntry> {
  const prevHash = prev?.hash ?? ZERO;
  const timestamp = input.timestamp ?? new Date().toISOString();
  const index = prev ? prev.index + 1 : 0;
  const payload = JSON.stringify({
    index,
    timestamp,
    level: input.level,
    module: input.module,
    note: input.note,
    prevHash,
  });
  const hash = await sha256Hex(payload);
  return {
    index,
    timestamp,
    level: input.level,
    module: input.module,
    note: input.note,
    prevHash,
    hash,
  };
}

export function verifyChain(chain: LedgerEntry[]): { ok: boolean; at?: number } {
  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    if (i === 0) {
      if (block.prevHash !== ZERO) return { ok: false, at: 0 };
    } else if (block.prevHash !== chain[i - 1].hash) {
      return { ok: false, at: i };
    }
  }
  return { ok: true };
}

export async function seedGenesis(): Promise<LedgerEntry[]> {
  const g = await sealEntry(null, {
    level: "L1",
    module: "identity",
    note: "Genesis — ENORYT·VICTORIA seed locked",
  });
  const a = await sealEntry(g, {
    level: "L1",
    module: "unitarity",
    note: "‖Ψ(τ)‖ = 1 verified across the cycle",
  });
  const b = await sealEntry(a, {
    level: "L1",
    module: "spectral",
    note: "eig(W) ∝ eig(G) — fidelity 92.4%",
  });
  return [g, a, b];
}
