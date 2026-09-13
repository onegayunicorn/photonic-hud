/**
 * Sovereign Bridge — Shared DTOs
 * Aligns with SACB EvidenceChain + HUD Cycle Log
 */

export type EvidenceLevel = "L1" | "L2" | "L3" | "L4";

export interface MerkleLeaf {
  index: string;
  tau: number;
  phase: string;
  coherence: number;
  entropy: number;
  unitarity: number;
  gammaFreq: number;
  filaments: number;
  spectral_hash: string;
  timestamp: number;
}

export interface SignedLeaf extends MerkleLeaf {
  leaf_hash: string;
  signature: string;
  public_key: string;
  evidence_level: EvidenceLevel;
}

export interface BridgeStatus {
  sacb_available: boolean;
  backend_mode: "simulation" | "real" | "auto";
  liboqs_loaded: boolean;
  boundary_seal: string;
  merkle_root: string;
  chain_height: number;
}

export interface VerificationResult {
  valid: boolean;
  signature_ok: boolean;
  root_match: boolean;
  evidence_level: EvidenceLevel | string;
  message: string;
}
