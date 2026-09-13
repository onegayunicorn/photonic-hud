import { create } from "zustand";
import { metricsAt, type CycleMetrics } from "./engine";
import {
  seedGenesis,
  sealEntry,
  verifyChain,
  type EvidenceLevel,
  type LedgerEntry,
} from "./merkle";
import type { PhaseKey } from "./phases";

const STORAGE_KEY = "kyrexis-sovereign-v1";

export type DurationMode = "demo" | "ritual";

export const DURATION_SEC: Record<DurationMode, number> = {
  demo: 42,
  ritual: 300,
};

type Persisted = {
  chain: LedgerEntry[];
  cycleCount: number;
  duration: DurationMode;
};

function loadPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}

function savePersisted(p: Persisted) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* quota */
  }
}

export type HwFrame = {
  t: number;
  line: string;
};

type Store = {
  tau: number;
  running: boolean;
  duration: DurationMode;
  metrics: CycleMetrics;
  chain: LedgerEntry[];
  chainOk: boolean;
  cycleCount: number;
  lastPhase: PhaseKey;
  hwLog: HwFrame[];
  sealing: boolean;
  hydrated: boolean;
  setTau: (tau: number) => void;
  setRunning: (v: boolean) => void;
  setDuration: (d: DurationMode) => void;
  tick: (dt: number) => void;
  reset: () => void;
  hydrate: () => Promise<void>;
  seal: (module: string, note: string, level?: EvidenceLevel) => Promise<void>;
  verify: () => boolean;
};

function pushHw(log: HwFrame[], tau: number, metrics: CycleMetrics): HwFrame[] {
  const speed = Math.floor(metrics.coherence * 255);
  const phase = Math.floor(tau * 255);
  const gammaByte = Math.min(255, Math.floor((metrics.gammaFreq / 60) * 255));
  const cksum = (0x07 + speed + phase + gammaByte) % 256;
  const hex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
  const line = `[AA 07 ${hex(speed)} ${hex(phase)} ${hex(gammaByte)} ${hex(cksum)}] CMD_CYCLE τ=${tau.toFixed(4)} ${metrics.phase} ${metrics.gammaFreq.toFixed(1)}Hz`;
  const next = [...log, { t: Date.now(), line }];
  return next.slice(-48);
}

export const useKyrexis = create<Store>((set, get) => ({
  tau: 0,
  running: false,
  duration: "demo",
  metrics: metricsAt(0),
  chain: [],
  chainOk: true,
  cycleCount: 0,
  lastPhase: "embodied",
  hwLog: [],
  sealing: false,
  hydrated: false,

  setTau: (tau) => {
    const t = Math.min(1, Math.max(0, tau));
    const metrics = metricsAt(t);
    set({ tau: t, metrics });
  },

  setRunning: (v) => set({ running: v }),

  setDuration: (d) => {
    set({ duration: d });
    const s = get();
    savePersisted({ chain: s.chain, cycleCount: s.cycleCount, duration: d });
  },

  tick: (dt) => {
    const s = get();
    if (!s.running) return;
    const dur = DURATION_SEC[s.duration];
    let next = s.tau + dt / dur;
    let running = true;
    let cycleCount = s.cycleCount;
    if (next >= 1) {
      next = 1;
      running = false;
      cycleCount += 1;
    }
    const metrics = metricsAt(next);
    const phaseChanged = metrics.phase !== s.lastPhase;
    const hwLog =
      Math.floor(s.tau * 80) !== Math.floor(next * 80)
        ? pushHw(s.hwLog, next, metrics)
        : s.hwLog;
    set({
      tau: next,
      metrics,
      running,
      cycleCount,
      lastPhase: metrics.phase,
      hwLog,
    });
    if (phaseChanged) {
      void get().seal(
        "phase",
        `Entered ${metrics.phase} at τ=${next.toFixed(4)}`,
        "L1",
      );
    }
    if (!running && next === 1) {
      void get().seal("cycle", `Cycle ${cycleCount} complete — New Being locked`, "L1");
      savePersisted({
        chain: get().chain,
        cycleCount,
        duration: get().duration,
      });
    }
  },

  reset: () => {
    set({
      tau: 0,
      running: false,
      metrics: metricsAt(0),
      lastPhase: "embodied",
      hwLog: [],
    });
  },

  hydrate: async () => {
    if (get().hydrated) return;
    const persisted = loadPersisted();
    let chain = persisted?.chain ?? [];
    if (chain.length === 0) {
      chain = await seedGenesis();
    }
    const chainOk = verifyChain(chain).ok;
    set({
      chain,
      chainOk,
      cycleCount: persisted?.cycleCount ?? 0,
      duration: persisted?.duration ?? "demo",
      hydrated: true,
    });
    savePersisted({
      chain,
      cycleCount: persisted?.cycleCount ?? 0,
      duration: persisted?.duration ?? "demo",
    });
  },

  seal: async (module, note, level = "L1") => {
    const s = get();
    set({ sealing: true });
    try {
      const last = s.chain[s.chain.length - 1] ?? null;
      const entry = await sealEntry(last, { level, module, note });
      const chain = [...s.chain, entry].slice(-256);
      const chainOk = verifyChain(chain).ok;
      set({ chain, chainOk, sealing: false });
      savePersisted({
        chain,
        cycleCount: get().cycleCount,
        duration: get().duration,
      });
    } catch {
      set({ sealing: false });
    }
  },

  verify: () => {
    const ok = verifyChain(get().chain).ok;
    set({ chainOk: ok });
    return ok;
  },
}));
