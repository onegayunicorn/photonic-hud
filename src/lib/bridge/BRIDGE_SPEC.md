# Sovereign Bridge Specification
## SACB ↔ Photonic-HUD Integration

**Version**: 1.2 · KX-001-A17  
**Status**: ACTIVE — **L2 Simulation Only** (not cryptographically binding)

---

## Purpose

Unite the Sovereign Cryptographic Plane (SACB — ML-DSA-65, Merkle, EvidenceChain)
with the Sovereign Photonic Plane (HUD — τ, coherence, spectral, mesh).

HUD generates observations; SACB provides immutability and verification.
Neither replaces the other — they complete each other.

---

## Canonical metrics (Ω-01)

**Single source of truth:** `src/lib/photonic/engine.ts` → `metricsAt(τ)`.

- Coherence and entropy use **keyframe interpolation** (`COHERENCE_KEYS`, `ENTROPY_KEYS`).
- Unitarity, weights, filaments, gamma frequency are derived in the same module.
- Spectral fidelity comes from `sampleSpectrum`.

**Non-canonical** (do not use for seals or appendix records):

```
C = 1 − 0.28·sin(2πτ)·exp(−0.4τ)
S = 0.28 + 0.48τ − 0.18·sin(3πτ)
F = 0.92 + 0.08·(1 − exp(−3τ))
```

Those simplified forms appear in some external manuals and do **not** match the
engine. Appendix values must be regenerated from `src/lib/bridge/fixtures.ts`
(`CANONICAL_FIXTURES` / `FIXTURE_TAU_1`). CI should fail if fixtures diverge
from `metricsAt`.

---

## Evidence Level Definitions

| Level | Source | Standard |
|-------|--------|----------|
| **L1** | Real liboqs ML-DSA-65 + SHA3-256 + independent verification | Production cryptographic proof |
| **L2** | Deterministic simulation with correct interface (`SIM-MLDSA65-*`) | Interface verified — **not** cryptographically binding |
| **L3** | Client-side hash only | Local integrity only |
| **L4** | Optical / sensor data only | Physical observation only |

Current runtime default: **L2**.

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

## Ω-02 Artifact Identity

The browser-served artifact is `dist/` by default. `.vercel/output/` is the deployment
bundle produced by the Nitro Vercel preset; it is not silently treated as the same
artifact.

`npm run build` now performs:

1. Generate build identity from the exact Git `HEAD`.
2. Build the application.
3. Hash the emitted `dist/` contents using SHA-256 over sorted relative paths and
   byte content.
4. Hash `.vercel/output/` separately when present.
5. Write `dist/artifact-manifest.json` (and the Vercel static output copy) with both
   identities.

`artifact-manifest.json` is excluded from the content hash to avoid a self-referential
hash. The manifest itself records the hashing method and exclusion explicitly.

`GET /api/health` reads the served manifest and reports:

- exact source commit SHA;
- build ID and build timestamp;
- served artifact SHA-256 and file count;
- Vercel output SHA-256 when present;
- `identityPass`, which is false when the manifest is absent or its source identity
  does not match the running build.

A failed identity check returns HTTP **503**, not a successful health response.

`npm run verify:artifact` independently recomputes the served artifact hash and fails
closed on commit, path, hash, or file-count mismatch.

The artifact hash is a **content identity**, not a cryptographic security claim about
the application. It does not promote SACB from L2 to L1.

---

## Promotion Rules (Ω-05 gate)

Simulation signatures (`SIM-MLDSA65-*`) are **L2 only** and **cannot** be promoted to L1 by configuration flag alone.

L1 is allowed only when **all** of the following are true in an automated run:

| Predicate | Required |
|-----------|----------|
| `backend_real` | `backend_mode === "real"` and `liboqs_loaded === true` |
| `algorithm_confirmed` | ML-DSA-65 reported without simulation prefix |
| `signing_pass` | Round-trip sign succeeds |
| `verification_pass` | Independent verify succeeds |
| `negative_tests_pass` | Altered leaf / wrong key / bad sig fail |
| `merkle_recompute_pass` | Root recomputes from leaves |
| `seal_recompute_pass` | Boundary seal matches serialized manifest |
| `artifact_identity_pass` | Served build hash matches tested commit |
| `runtime_smoke_pass` | HTTP smoke of cycle page + bridge |

Non-claims (always):
- Mesh coherence < 0.85 → "sync incomplete"
- Spectral fidelity < 0.90 → "pattern unstable"
- Any `SIM-*` signature → not L1

---

## Deployment Path

1. ✅ Simulation Bridge (current) — L2
2. ✅ Canonical fixtures + engine invariants tests
3. ✅ Ω-02 artifact identity implementation — **runtime verification still required**
4. ⬜ Ω-03 SACB runtime smoke + captured seal evidence
5. ⬜ Install liboqs → enable real ML-DSA-65
6. ⬜ HUD ↔ SACB round-trip CI test
7. ⬜ EvidenceChain promotion automation (gate above)
8. ⬜ Cross-plane L1 production seal

---

## Files in this package

| Path | Role |
|------|------|
| `scripts/generate-build-info.mjs` | Build/source identity generator |
| `scripts/finalize-artifact.mjs` | Deterministic artifact manifest generator |
| `scripts/verify-artifact.mjs` | Fail-closed artifact verifier |
| `src/generated/build-info.ts` | Build-time identity consumed by runtime |
| `src/routes/api/health.ts` | Runtime provenance health endpoint |
| `src/lib/bridge/types.ts` | Shared DTOs |
| `src/lib/bridge/client.ts` | SACBClient (mock + real) |
| `src/lib/bridge/seal.ts` | HUD → SACB seal flow |
| `src/lib/bridge/fixtures.ts` | Canonical τ checkpoints from engine |
| `src/lib/bridge/fixtures.test.ts` | Deterministic fixture + invariant tests |
| `src/components/hud/EvidencePanel.tsx` | Crypto status UI |
| `src/components/layout/AppShell.tsx` | HUD shell + build identity footer |
| `src/lib/bridge/BRIDGE_SPEC.md` | This document |
