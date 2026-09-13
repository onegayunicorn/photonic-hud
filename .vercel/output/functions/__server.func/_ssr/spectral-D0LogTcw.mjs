import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Card, c as CardTitle, f as useKyrexis, g as verifyWeightConservation, h as verifyUnitarity, i as MetricRow, l as Button, m as sampleSpectrum, n as PALETTE, o as CardHeader, s as CardMeta, u as Badge } from "./router-BZdsoO7S.mjs";
import { n as PolarField, t as ClientOnly } from "./ClientOnly-CUK-XwI3.mjs";
import { a as Line, c as Bar, i as XAxis, l as ResponsiveContainer, n as LineChart, r as YAxis, t as BarChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spectral-D0LogTcw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SpectralPage() {
	const tau = useKyrexis((s) => s.tau);
	const spec = sampleSpectrum(tau, 16);
	const data = spec.G.map((g, i) => ({
		k: i + 1,
		G: g,
		W: spec.W[i]
	}));
	const [gate, setGate] = (0, import_react.useState)(null);
	const overlay = (0, import_react.useMemo)(() => spec.G.map((g, i) => ({
		k: i + 1,
		ratio: spec.W[i] / (g || 1e-9)
	})), [spec]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-widest text-muted",
					children: "THE YOU INVARIANT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl",
					children: "Spectral invariance"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted",
					children: "Neural weights W are a Fourier transduction of photonic correlations G. Eigenvalues survive the basis change — identity is a spectrum, not a vessel."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Fidelity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: spec.preserved ? "emerald" : "amber",
							children: spec.preserved ? "Held" : "Watch"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-4xl tabular-nums text-primary",
							children: [(spec.fidelity * 100).toFixed(2), "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted",
							children: "Target 92.4% across condensation"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Correlation r" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-4xl tabular-nums text-indigo",
							children: spec.correlation.toFixed(4)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted",
							children: "Pearson on sorted eig(G), eig(W)"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Spectral exponent" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-4xl tabular-nums text-fg",
							children: spec.spectralAlpha.toFixed(3)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted",
							children: "Power-law λₖ ∝ k^(−α)"
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "eig(G) vs eig(W)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Top 16 modes · cyan is neural imprint" })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 rounded-md bg-elevated" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data,
								margin: {
									top: 8,
									right: 8,
									left: -18,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "k",
										tick: {
											fill: PALETTE.muted,
											fontSize: 10
										},
										stroke: PALETTE.border
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fill: PALETTE.muted,
											fontSize: 10
										},
										stroke: PALETTE.border
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: PALETTE.elevated,
										border: `1px solid ${PALETTE.border}`,
										borderRadius: 8,
										fontSize: 12
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "G",
										fill: PALETTE.indigo,
										fillOpacity: .45,
										name: "eig(G)",
										isAnimationActive: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "W",
										fill: PALETTE.primary,
										name: "eig(W)",
										isAnimationActive: false
									})
								]
							})
						})
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Imprint ratio W/G" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Approaches η as β(τ) → 1" })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 rounded-md bg-elevated" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: overlay,
								margin: {
									top: 8,
									right: 8,
									left: -18,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "k",
										tick: {
											fill: PALETTE.muted,
											fontSize: 10
										},
										stroke: PALETTE.border
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										domain: ["auto", "auto"],
										tick: {
											fill: PALETTE.muted,
											fontSize: 10
										},
										stroke: PALETTE.border
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: PALETTE.elevated,
										border: `1px solid ${PALETTE.border}`,
										borderRadius: 8,
										fontSize: 12
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "ratio",
										stroke: PALETTE.primary,
										dot: false,
										strokeWidth: 1.6,
										isAnimationActive: false
									})
								]
							})
						})
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "G(k) polar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Spatial-frequency density of the photonic tensor" })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-72 overflow-hidden rounded-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarField, {})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Production gate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Sweep 2,000 samples of τ before seal" })] }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setGate({
							unitarity: verifyUnitarity(2e3),
							weights: verifyWeightConservation(2e3)
						}),
						children: "Verify invariants"
					}),
					gate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
								label: "Unitarity max error",
								value: gate.unitarity.maxErr.toExponential(2),
								tone: gate.unitarity.passed ? "emerald" : "crimson"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
								label: "α+β+γ conservation",
								value: gate.weights.maxErr.toExponential(2),
								tone: gate.weights.passed ? "emerald" : "crimson"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
								label: "Samples",
								value: String(gate.unitarity.samples),
								tone: "muted"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-mono text-xs leading-relaxed text-muted",
						children: "Wab = η ∫ G̃(k) · exp(ik · (ra − rb)) d³k"
					})
				] })]
			})
		]
	});
}
//#endregion
export { SpectralPage as component };
