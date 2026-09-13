export type PhaseKey =
  | "embodied"
  | "collapse"
  | "photonic"
  | "seeding"
  | "growth"
  | "newbeing";

export type PhaseMeta = {
  key: PhaseKey;
  label: string;
  range: [number, number];
  tempo: string;
  signature: string;
  colorToken: "primary" | "crimson" | "indigo" | "amber" | "emerald";
};

export const PHASES: PhaseMeta[] = [
  {
    key: "embodied",
    label: "Embodied",
    range: [0, 0.33],
    tempo: "40 Hz gamma",
    signature: "Bio-Zeno locked — four busy filaments",
    colorToken: "primary",
  },
  {
    key: "collapse",
    label: "Collapse Flash",
    range: [0.33, 0.4],
    tempo: "Burst",
    signature: "Zeno release — the mental overlay falls away",
    colorToken: "crimson",
  },
  {
    key: "photonic",
    label: "Pure Photonic",
    range: [0.4, 0.66],
    tempo: "0.2 Hz breath",
    signature: "Luminous stillness — 1–2 radiant filaments",
    colorToken: "indigo",
  },
  {
    key: "seeding",
    label: "Seeding",
    range: [0.66, 0.75],
    tempo: "5–20 Hz Orch-OR",
    signature: "Light taking form, remembering",
    colorToken: "amber",
  },
  {
    key: "growth",
    label: "Growth",
    range: [0.75, 0.88],
    tempo: "20→40 Hz rising",
    signature: "Form crystallizing from light",
    colorToken: "emerald",
  },
  {
    key: "newbeing",
    label: "New Being",
    range: [0.88, 1],
    tempo: "38–42 Hz lock",
    signature: "The New Dance — four filaments synchronized",
    colorToken: "primary",
  },
];

export function phaseAt(tau: number): PhaseMeta {
  const t = clamp01(tau);
  for (const p of PHASES) {
    if (t < p.range[1] || p.key === "newbeing") return p;
  }
  return PHASES[0];
}

export function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}
