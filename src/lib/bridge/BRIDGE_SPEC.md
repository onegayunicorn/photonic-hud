# Sovereign Bridge Specification
## SACB ↔ Photonic-HUD Integration

**Version**: 1.0 · KX-001-A17  
**Status**: ACTIVE — Simulation Mode

---

## Purpose

Unite the Sovereign Cryptographic Plane (SACB — ML-DSA-65, Merkle, EvidenceChain)
with the Sovereign Photonic Plane (HUD — τ, coherence, spectral, mesh).

HUD generates observations; SACB provides immutability and verification.
Neither replaces the other — they complete each other.

---

## Evidence Level Definitions

| Level | Source | Standard |
|-------|--------|----------|
| **L1** | Real liboqs ML-DSA-65 + SHA3-256 | Production cryptographic proof |
| **L2** | Deterministic simulation with correct interface | Interface verified, not cryptographically binding |
| **L3** | Client-side hash only | Local integrity only |
| **L4** | Optical / sensor data only | Physical observation only |

---

## Endpoint Protocol (SACB side)

All endpoints accept JSON, return JSON.

### `GET /status`
```json
{
  "sacb_available": true,
  "backend_mode": "simulation" | "real" | "auto",
  "liboqs_loaded": false,
  "boundary_seal": "<sha3-256-hex>",
  "merkle_root": "<sha3-256-hex>",
  "chain_height": 1
}
```

### `POST /sign/merkle-leaf`
Input: `{ leaf, leaf_hash }`  
Output: `SignedLeaf` with `signature`, `public_key`, `evidence_level`

### `POST /verify/leaf`
Input: `SignedLeaf`  
Output: `{ valid, signature_ok, root_match, evidence_level, message }`

---

## Promotion Rules

- HUD τ = 1.0000 (New Being) → eligible for sealing
- Sealed leaf → appended to local Merkle chain + optional SACB store
- Simulation signatures → **L2 only** → cannot be promoted to L1
- Real liboqs present → **L1** → immutable cross-plane binding
- Mesh coherence < 0.85 → non-claim: "sync incomplete"
- Fidelity < 0.90 → non-claim: "pattern unstable"

---

## Deployment Path

1. ✅ Simulation Bridge (current)
2. ⬜ Install liboqs → enable real ML-DSA-65
3. ⬜ SACB local API server (`:8787`)
4. ⬜ HUD ↔ SACB round-trip CI test
5. ⬜ EvidenceChain promotion automation
6. ⬜ Cross-plane L1 production seal

---

## Files in this package

| Path | Role |
|------|------|
| `src/lib/bridge/types.ts` | Shared DTOs |
| `src/lib/bridge/client.ts` | SACBClient (mock + real) |
| `src/lib/bridge/seal.ts` | HUD → SACB seal flow |
| `src/components/hud/EvidencePanel.tsx` | Crypto status UI |
| `src/lib/bridge/BRIDGE_SPEC.md` | This document |
