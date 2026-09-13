import { sha256Hex } from "@/lib/photonic/hash";
import type {
  MerkleLeaf,
  SignedLeaf,
  BridgeStatus,
  VerificationResult,
  EvidenceLevel,
} from "./types";

/**
 * SACB client — simulation by default.
 * Flip mockMode to false and point baseUrl at a live SACB node for L1.
 */
export class SACBClient {
  private baseUrl: string;
  private mockMode: boolean;

  constructor(baseUrl = "http://localhost:8787", mockMode = true) {
    this.baseUrl = baseUrl;
    this.mockMode = mockMode;
  }

  setMockMode(v: boolean) {
    this.mockMode = v;
  }

  async getStatus(): Promise<BridgeStatus> {
    if (this.mockMode) {
      return {
        sacb_available: true,
        backend_mode: "simulation",
        liboqs_loaded: false,
        boundary_seal:
          "f134b768a9c2d4e6f8a0b2c4d6e8f0a2c4e6b8a0c2d4e6f8a0b2c4d6e8f0a2",
        merkle_root:
          "6756ce40fa98dc2b73e1f5a8c9d2e0b4f6a8c2d4e6b8a0c2d4e6f8a0b2c4d6e8f",
        chain_height: 3,
      };
    }

    const res = await fetch(`${this.baseUrl}/status`);
    if (!res.ok) throw new Error(`SACB unreachable: ${res.status}`);
    return res.json() as Promise<BridgeStatus>;
  }

  async signLeaf(leaf: MerkleLeaf): Promise<SignedLeaf> {
    const preimage = JSON.stringify(leaf);
    const leaf_hash = await sha256Hex(preimage);

    if (this.mockMode) {
      // Deterministic simulation signature — interface only (L2)
      const signature = `SIM-MLDSA65-${leaf_hash.slice(0, 32)}`;
      return {
        ...leaf,
        leaf_hash,
        signature,
        public_key: "SIMULATION-PUBKEY",
        evidence_level: "L2",
      };
    }

    const res = await fetch(`${this.baseUrl}/sign/merkle-leaf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leaf, leaf_hash }),
    });
    if (!res.ok) throw new Error(`Sign failed: ${res.status}`);
    return res.json() as Promise<SignedLeaf>;
  }

  async verifyLeaf(signed: SignedLeaf): Promise<VerificationResult> {
    if (this.mockMode) {
      const valid = signed.signature.startsWith("SIM-MLDSA65-");
      return {
        valid,
        signature_ok: valid,
        root_match: true,
        evidence_level: signed.evidence_level,
        message: valid
          ? "Simulation signature verified (L2 — interface only)"
          : "Invalid simulation signature",
      };
    }

    const res = await fetch(`${this.baseUrl}/verify/leaf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signed),
    });
    return res.json() as Promise<VerificationResult>;
  }
}

export const sacb = new SACBClient();
