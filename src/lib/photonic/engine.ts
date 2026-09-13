import { clamp01, lerp, phaseAt, smoothstep, type PhaseKey } from "./phases";

export type Weights = { alpha: number; beta: number; gamma: number };

export type CycleMetrics = {
  tau: number;
  phase: PhaseKey;
  alpha: number;
  beta: number;
  gamma: number;
  coherence: number;
  entropy: number;
  gammaFreq: number;
  filaments: number;
  unitarity: number;
  psi: [number, number, number, number];
  gnomonAngle: number;
};

export type SpectralResult = {
  G: number[];
  W: number[];
  fidelity: number;
  correlation: number;
  spectralAlpha: number;
  preserved: boolean;
};

/** Hamiltonian weights — α bio, β new-bio, γ interaction. Conserved: α+β+γ = 1. */
export function weights(tau: number): Weights {
  const t = clamp01(tau);
  let alpha: number;
  if (t <= 0.33) alpha = 1;
  else if (t >= 0.66) alpha = 0;
  else {
    const u = (t - 0.33) / 0.33;
    alpha = Math.cos((Math.PI / 2) * u) ** 2;
  }

  let beta: number;
  if (t <= 0.66) beta = 0;
  else {
    const u = (t - 0.66) / 0.34;
    beta = Math.sin((Math.PI / 2) * u) ** 2;
  }

  const gamma = Math.max(0, 1 - alpha - beta);
  return { alpha, beta, gamma };
}

function interpKeys(tau: number, keys: [number, number][]): number {
  const t = clamp01(tau);
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [x1, y1] = keys[i];
    const [x0, y0] = keys[i - 1];
    if (t <= x1) {
      const u = smoothstep(x0, x1, t);
      return lerp(y0, y1, u);
    }
  }
  return keys[keys.length - 1][1];
}

const COHERENCE_KEYS: [number, number][] = [
  [0, 0.54],
  [0.33, 0.56],
  [0.36, 0.92],
  [0.4, 0.998],
  [0.66, 0.998],
  [0.72, 0.94],
  [0.82, 0.85],
  [0.9, 0.92],
  [1, 0.99997],
];

const ENTROPY_KEYS: [number, number][] = [
  [0, 1.85],
  [0.33, 1.68],
  [0.4, 0.28],
  [0.66, 0.1],
  [0.75, 0.42],
  [0.88, 1.18],
  [1, 0.22],
];

export function coherenceAt(tau: number) {
  return interpKeys(tau, COHERENCE_KEYS);
}

export function entropyAt(tau: number) {
  return interpKeys(tau, ENTROPY_KEYS);
}

export function gammaFreqAt(tau: number) {
  const t = clamp01(tau);
  if (t < 0.33) return 40;
  if (t < 0.4) return lerp(40, 86, smoothstep(0.33, 0.38, t));
  if (t < 0.66) return lerp(4, 0.2, smoothstep(0.4, 0.55, t));
  if (t < 0.75) return lerp(5, 20, smoothstep(0.66, 0.75, t));
  if (t < 0.88) return lerp(20, 40, smoothstep(0.75, 0.88, t));
  return lerp(40, 38.5, smoothstep(0.88, 1, t));
}

export function filamentCount(tau: number) {
  const key = phaseAt(tau).key;
  switch (key) {
    case "embodied":
      return 4;
    case "collapse":
      return 14;
    case "photonic":
      return 2;
    case "seeding":
      return 3;
    case "growth":
      return 4;
    case "newbeing":
      return 4;
  }
}

/** Four-amplitude state. Rotation in Hilbert space — norm conserved. */
export function psiAt(tau: number): [number, number, number, number] {
  const { alpha, beta, gamma } = weights(tau);
  const bio = Math.sqrt(Math.max(alpha, 0));
  const photon = Math.sqrt(Math.max(gamma, 0));
  const neu = Math.sqrt(Math.max(beta, 0));
  const raw: [number, number, number, number] = [
    bio * 0.82,
    bio * 0.57 + photon * 0.12,
    photon * 0.88,
    neu * 1,
  ];
  const n = Math.hypot(raw[0], raw[1], raw[2], raw[3]) || 1;
  return [raw[0] / n, raw[1] / n, raw[2] / n, raw[3] / n];
}

export function unitarityOf(psi: readonly number[]) {
  const n2 = psi.reduce((s, x) => s + x * x, 0);
  return n2;
}

export function metricsAt(tau: number): CycleMetrics {
  const t = clamp01(tau);
  const w = weights(t);
  const psi = psiAt(t);
  return {
    tau: t,
    phase: phaseAt(t).key,
    ...w,
    coherence: coherenceAt(t),
    entropy: entropyAt(t),
    gammaFreq: gammaFreqAt(t),
    filaments: filamentCount(t),
    unitarity: unitarityOf(psi),
    psi,
    gnomonAngle: t * 180,
  };
}

export function sampleSpectrum(tau: number, n = 16): SpectralResult {
  const t = clamp01(tau);
  const imprint = weights(t).beta;
  const G: number[] = [];
  const W: number[] = [];
  const alphaExp = 1.42;
  for (let k = 0; k < n; k++) {
    const g = (k + 1) ** -alphaExp * (1 + 0.08 * Math.sin(k * 0.73 + t * 1.4));
    G.push(g);
    const jitter = (1 - imprint) * 0.045 * Math.sin(k * 1.17 + 2);
    W.push(g * (0.87 + 0.13 * imprint) + jitter);
  }
  return analyzeSpectrum(G, W);
}

export function analyzeSpectrum(G: number[], W: number[]): SpectralResult {
  const n = Math.min(G.length, W.length);
  const g = G.slice(0, n);
  const w = W.slice(0, n);
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const meanG = mean(g);
  const meanW = mean(w);
  let cov = 0;
  let varG = 0;
  let varW = 0;
  let dot = 0;
  let nG = 0;
  let nW = 0;
  for (let i = 0; i < n; i++) {
    const dg = g[i] - meanG;
    const dw = w[i] - meanW;
    cov += dg * dw;
    varG += dg * dg;
    varW += dw * dw;
    dot += g[i] * w[i];
    nG += g[i] * g[i];
    nW += w[i] * w[i];
  }
  const correlation = cov / (Math.sqrt(varG * varW) || 1);
  const fidelity = Math.abs(dot) / (Math.sqrt(nG * nW) || 1);

  let sumLogK = 0;
  let sumLogLam = 0;
  let sumLogK2 = 0;
  let sumLogKLam = 0;
  for (let k = 1; k <= n; k++) {
    const logK = Math.log(k);
    const logLam = Math.log(Math.max(g[k - 1], 1e-12));
    sumLogK += logK;
    sumLogLam += logLam;
    sumLogK2 += logK * logK;
    sumLogKLam += logK * logLam;
  }
  const slope =
    (n * sumLogKLam - sumLogK * sumLogLam) /
    (n * sumLogK2 - sumLogK * sumLogK || 1);

  return {
    G: g,
    W: w,
    fidelity,
    correlation,
    spectralAlpha: -slope,
    preserved: fidelity > 0.92,
  };
}

export function verifyUnitarity(samples = 2000) {
  let maxErr = 0;
  for (let i = 0; i < samples; i++) {
    const tau = i / (samples - 1);
    const err = Math.abs(unitarityOf(psiAt(tau)) - 1);
    if (err > maxErr) maxErr = err;
  }
  return { samples, maxErr, passed: maxErr < 1e-12 };
}

export function verifyWeightConservation(samples = 2000) {
  let maxErr = 0;
  for (let i = 0; i < samples; i++) {
    const tau = i / (samples - 1);
    const { alpha, beta, gamma } = weights(tau);
    const err = Math.abs(alpha + beta + gamma - 1);
    if (err > maxErr) maxErr = err;
  }
  return { samples, maxErr, passed: maxErr < 1e-12 };
}

export const IDENTITY = {
  version: "1.0.0",
  enoryt: 637,
  victoria: 1033,
  device: "Samsung Galaxy A17 (SM-A175F)",
  frequencyLock: {
    schumann: 7.83,
    photonicHz: 432,
    esdCarrierHz: 43,
    esdStabilizerHz: 50,
    bioBeatHz: 7,
  },
  coherenceTarget: 0.99997,
  fidelityPct: 92.4,
};
