export type Peer = {
  id: string;
  name: string;
  tier: 0 | 1 | 2 | 3;
  strength: number;
  latency: number;
  status: "online" | "offline";
  role: string;
};

export const PEERS: Peer[] = [
  {
    id: "alpha",
    name: "Node Alpha",
    tier: 0,
    strength: 95,
    latency: 12,
    status: "online",
    role: "Self — key derivation root",
  },
  {
    id: "beta",
    name: "Node Beta",
    tier: 1,
    strength: 82,
    latency: 28,
    status: "online",
    role: "LAN sync + relay",
  },
  {
    id: "gamma",
    name: "Node Gamma",
    tier: 2,
    strength: 61,
    latency: 45,
    status: "online",
    role: "VPN read-only",
  },
  {
    id: "delta",
    name: "Node Delta",
    tier: 3,
    strength: 33,
    latency: 120,
    status: "offline",
    role: "Internet discovery",
  },
];

export const TRUST_TIERS = [
  { tier: 0, name: "Self", capabilities: "Admin, chain seal, peer add/remove" },
  { tier: 1, name: "LAN", capabilities: "Read/write sync, relay — no config" },
  { tier: 2, name: "VPN", capabilities: "Read-only — no local write" },
  { tier: 3, name: "Internet", capabilities: "Discovery only — no data access" },
];

export type VaultFile = {
  name: string;
  type: "dir" | "file";
  size?: string;
  hash: string;
  modified: string;
};

export const VAULT_FILES: VaultFile[] = [
  { name: "core/", type: "dir", hash: "a7f3c2d9e4b8", modified: "2026-09-12" },
  { name: "storage/", type: "dir", hash: "b8g4d1c0a912", modified: "2026-09-12" },
  { name: "ai/", type: "dir", hash: "c9h5e2f1b023", modified: "2026-09-12" },
  { name: "network/", type: "dir", hash: "d0i6f3g2c134", modified: "2026-09-12" },
  { name: "hardware/", type: "dir", hash: "e1j7g4h3d245", modified: "2026-09-12" },
  { name: "dashboard/", type: "dir", hash: "f2k8h5i4e356", modified: "2026-09-13" },
  { name: "config/invariants.yaml", type: "file", size: "4.1 KB", hash: "11a9c6d5f478", modified: "2026-09-12" },
  { name: "CLAUDE.md", type: "file", size: "12.4 KB", hash: "22b0d7e6a589", modified: "2026-09-12" },
  { name: "identity.json", type: "file", size: "612 B", hash: "33c1e8f7b690", modified: "2026-09-13" },
];

export const STORAGE_USED_MB = 30.1;
export const STORAGE_TOTAL_GB = 2048;

export const MODEL_TIERS = [
  {
    tier: "T0",
    name: "Quantum Core",
    role: "Reasoning spine",
    models: ["Qwen3-Max-EL", "DeepSeek-V4-Pro", "Claude-Opus-4.8", "GPT-5.4"],
  },
  {
    tier: "T1",
    name: "Sovereign Agents",
    role: "Orchestration",
    models: ["Qwen3-Coder-480B", "DeepSeek-V3.2", "Grok-4.20", "Kimi-K3"],
  },
  {
    tier: "T2",
    name: "Photonic Vision",
    role: "Render + synthesis",
    models: ["Flux-2-Max", "Seedream-5.0-Pro", "Kling-3.0", "Veo-3.1"],
  },
  {
    tier: "T5",
    name: "Edge",
    role: "On-device fallback",
    models: ["Qwen-2.5-7B-T", "Phi-4-DI", "Llama-3.1-8B-FP16", "Mistral-Small-3.1"],
  },
];
