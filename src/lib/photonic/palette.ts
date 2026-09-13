/** Canvas-readable tokens. Keep in sync with `src/styles.css` @theme. */
export const PALETTE = {
  bg: "#07090c",
  surface: "#0e1318",
  elevated: "#151c24",
  fg: "#e8f4f6",
  muted: "#7d949b",
  primary: "#3ee0ea",
  crimson: "#e24a5e",
  indigo: "#7c74d4",
  emerald: "#3dce8c",
  amber: "#d9a441",
  border: "#1c2a31",
} as const;

export const PHASE_HEX: Record<string, string> = {
  embodied: PALETTE.primary,
  collapse: PALETTE.crimson,
  photonic: PALETTE.indigo,
  seeding: PALETTE.amber,
  growth: PALETTE.emerald,
  newbeing: PALETTE.primary,
};
