import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as RotateCcw, c as Pause, s as Play } from "../_libs/lucide-react.mjs";
import { _ as weights, a as Card, c as CardTitle, d as cn, f as useKyrexis, i as MetricRow, l as Button, m as sampleSpectrum, n as PALETTE, o as CardHeader, p as shortHash, r as PHASE_HEX, s as CardMeta, u as Badge, v as PHASES, y as phaseAt } from "./router-BZdsoO7S.mjs";
import { n as PolarField, t as ClientOnly } from "./ClientOnly-CUK-XwI3.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { a as Line, c as Bar, i as XAxis, l as ResponsiveContainer, n as LineChart, o as CartesianGrid, r as YAxis, s as ReferenceLine, t as BarChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BiIfbGLp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-elevated",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-fg shadow-[0_0_0_4px_rgb(7_9_12),0_0_0_5px_rgb(62_224_234_/_0.7)] outline-none focus-visible:shadow-[0_0_0_4px_rgb(7_9_12),0_0_0_6px_rgb(62_224_234)]" })]
	});
}
function CycleControls({ compact = false }) {
	const running = useKyrexis((s) => s.running);
	const tau = useKyrexis((s) => s.tau);
	const duration = useKyrexis((s) => s.duration);
	const setRunning = useKyrexis((s) => s.setRunning);
	const setTau = useKyrexis((s) => s.setTau);
	const setDuration = useKyrexis((s) => s.setDuration);
	const reset = useKyrexis((s) => s.reset);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col gap-3", compact && "gap-2"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						if (tau >= 1) reset();
						setRunning(!running);
					},
					className: "min-w-32",
					children: running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}), " Pause"] }) : tau >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}), " Run again"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}), " Run cycle"] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: reset,
					"aria-label": "Reset cycle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Reset"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex rounded-md bg-elevated p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setDuration("demo"),
						className: cn("h-9 rounded px-3 text-xs font-medium", duration === "demo" ? "bg-surface text-fg" : "text-muted"),
						children: "Demo 42s"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setDuration("ritual"),
						className: cn("h-9 rounded px-3 text-xs font-medium", duration === "ritual" ? "bg-surface text-fg" : "text-muted"),
						children: "Ritual 5m"
					})]
				})
			]
		}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-8 font-mono text-[11px] text-muted",
					children: "τ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: 0,
					max: 1,
					step: .001,
					value: [tau],
					onValueChange: ([v]) => {
						setRunning(false);
						setTau(v ?? 0);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-14 text-right font-mono text-xs tabular-nums text-primary",
					children: tau.toFixed(3)
				})
			]
		})]
	});
}
function usePrefersReducedMotion() {
	const [reduced, setReduced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const apply = () => setReduced(mq.matches);
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, []);
	return reduced;
}
function FilamentCanvas({ className }) {
	const canvasRef = (0, import_react.useRef)(null);
	const reduced = usePrefersReducedMotion();
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let raf = 0;
		const t0 = performance.now();
		const paint = (now) => {
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			const rect = canvas.getBoundingClientRect();
			const w = Math.max(1, Math.floor(rect.width * dpr));
			const h = Math.max(1, Math.floor(rect.height * dpr));
			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w;
				canvas.height = h;
			}
			const { tau, coherence, gammaFreq, filaments, phase } = useKyrexis.getState().metrics;
			const color = PHASE_HEX[phase] ?? PALETTE.primary;
			const time = reduced ? 0 : (now - t0) / 1e3;
			const cx = w / 2;
			const cy = h / 2;
			const scale = Math.min(w, h);
			ctx.fillStyle = PALETTE.bg;
			ctx.fillRect(0, 0, w, h);
			ctx.strokeStyle = "rgba(232,244,246,0.04)";
			ctx.lineWidth = dpr;
			for (let r = .12; r <= .42; r += .1) {
				ctx.beginPath();
				ctx.arc(cx, cy, scale * r, 0, Math.PI * 2);
				ctx.stroke();
			}
			for (let i = 0; i < filaments; i++) {
				const base = i / filaments * Math.PI * 2 + tau * Math.PI;
				const pulse = Math.sin(time * gammaFreq * Math.PI * 2 + i * 1.3);
				const len = scale * (.18 + .16 * coherence + .05 * pulse);
				const wobble = .18 * pulse * (.35 + coherence);
				ctx.beginPath();
				ctx.moveTo(cx, cy);
				const mx = cx + Math.cos(base + wobble) * len * .55;
				const my = cy + Math.sin(base + wobble) * len * .55;
				const ex = cx + Math.cos(base - wobble * .6) * len;
				const ey = cy + Math.sin(base - wobble * .6) * len;
				ctx.quadraticCurveTo(mx, my, ex, ey);
				ctx.strokeStyle = color;
				ctx.globalAlpha = .28 + .55 * coherence;
				ctx.lineWidth = (1.2 + coherence * 1.6) * dpr;
				ctx.lineCap = "round";
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(ex, ey, (1.6 + coherence * 2.2) * dpr, 0, Math.PI * 2);
				ctx.fillStyle = color;
				ctx.globalAlpha = .7;
				ctx.fill();
			}
			ctx.globalAlpha = 1;
			const coreR = (3 + 8 * coherence) * dpr;
			const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 4);
			g.addColorStop(0, color);
			g.addColorStop(.35, `${color}55`);
			g.addColorStop(1, "transparent");
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(cx, cy, coreR * 4, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = PALETTE.fg;
			ctx.beginPath();
			ctx.arc(cx, cy, 2.5 * dpr, 0, Math.PI * 2);
			ctx.fill();
		};
		const loop = (now) => {
			paint(now);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [reduced]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: cn("block h-full w-full", className),
		"aria-hidden": "true"
	});
}
function Gnomon({ className }) {
	const tau = useKyrexis((s) => s.tau);
	const coherence = useKyrexis((s) => s.metrics.coherence);
	const phase = phaseAt(tau);
	const angle = tau * 180;
	const color = PHASE_HEX[phase.key] ?? PALETTE.primary;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative mx-auto aspect-square w-full max-w-[220px]", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 120 120",
			className: "h-full w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "60",
					cy: "60",
					r: "52",
					fill: "none",
					stroke: "currentColor",
					className: "text-border",
					strokeWidth: "1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "60",
					cy: "60",
					r: "40",
					fill: "none",
					stroke: "currentColor",
					className: "text-border",
					strokeWidth: "0.6",
					strokeDasharray: "2 3"
				}),
				[
					0,
					45,
					90,
					135,
					180
				].map((d) => {
					const a = (d - 90) * Math.PI / 180;
					const x1 = 60 + Math.cos(a) * 48;
					const y1 = 60 + Math.sin(a) * 48;
					const x2 = 60 + Math.cos(a) * 52;
					const y2 = 60 + Math.sin(a) * 52;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1,
						y1,
						x2,
						y2,
						stroke: PALETTE.muted,
						strokeWidth: "0.8"
					}, d);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "60",
					y1: "60",
					x2: 60 + Math.cos((angle - 90) * Math.PI / 180) * 44,
					y2: 60 + Math.sin((angle - 90) * Math.PI / 180) * 44,
					stroke: PALETTE.crimson,
					strokeWidth: "2.2",
					strokeLinecap: "round",
					style: {
						transitionProperty: "x2, y2",
						transitionDuration: "150ms",
						transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "60",
					cy: "60",
					r: 3 + coherence * 3,
					fill: color,
					opacity: .9
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-x-0 bottom-1 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-mono text-xs tabular-nums text-crimson",
				children: [angle.toFixed(1), "°"]
			})
		})]
	});
}
var TONE = {
	primary: "bg-primary",
	crimson: "bg-crimson",
	indigo: "bg-indigo",
	amber: "bg-amber",
	emerald: "bg-emerald"
};
function PhaseTimeline() {
	const tau = useKyrexis((s) => s.tau);
	const setTau = useKyrexis((s) => s.setTau);
	const setRunning = useKyrexis((s) => s.setRunning);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-2 rounded-full bg-elevated",
		children: [PHASES.map((p) => {
			const left = p.range[0] * 100;
			const width = (p.range[1] - p.range[0]) * 100;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				title: p.label,
				onClick: () => {
					setRunning(false);
					setTau(p.range[0] + .001);
				},
				className: cn("absolute top-0 h-2 opacity-50 hover:opacity-90", TONE[p.colorToken]),
				style: {
					left: `${left}%`,
					width: `${width}%`
				}
			}, p.key);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg",
			style: { left: `${tau * 100}%` }
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6",
		children: PHASES.map((p) => {
			const active = tau >= p.range[0] && tau < p.range[1] || p.key === "newbeing" && tau >= .88;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					setRunning(false);
					setTau(p.range[0] + .001);
				},
				className: cn("rounded-md px-1.5 py-2 text-left transition-[background-color,color] duration-150", active ? "bg-elevated text-fg" : "text-subtle hover:text-muted"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[10px] tabular-nums",
					children: p.range[0].toFixed(2)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-medium leading-tight",
					children: p.label
				})]
			}, p.key);
		})
	})] });
}
function Chart$1() {
	const tau = useKyrexis((s) => s.tau);
	const spec = sampleSpectrum(tau, 10);
	const data = spec.G.map((g, i) => ({
		k: i + 1,
		G: g,
		W: spec.W[i]
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-36 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
				data,
				margin: {
					top: 4,
					right: 4,
					left: -24,
					bottom: 0
				},
				barGap: 2,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "k",
						tick: {
							fill: PALETTE.muted,
							fontSize: 10
						},
						stroke: PALETTE.border
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: "G",
						fill: PALETTE.indigo,
						fillOpacity: .45,
						radius: [
							2,
							2,
							0,
							0
						],
						isAnimationActive: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: "W",
						fill: PALETTE.primary,
						radius: [
							2,
							2,
							0,
							0
						],
						isAnimationActive: false
					})
				]
			})
		})
	});
}
function SpectralBars() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-36 rounded-md bg-elevated" }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart$1, {})
	});
}
var DATA = Array.from({ length: 101 }, (_, i) => {
	const tau = i / 100;
	return {
		tau,
		...weights(tau)
	};
});
function Chart() {
	const tau = useKyrexis((s) => s.tau);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-44 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
				data: DATA,
				margin: {
					top: 8,
					right: 8,
					left: -18,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						stroke: PALETTE.border,
						strokeDasharray: "3 4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "tau",
						type: "number",
						domain: [0, 1],
						tick: {
							fill: PALETTE.muted,
							fontSize: 10
						},
						tickFormatter: (v) => Number(v).toFixed(1),
						stroke: PALETTE.border
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						domain: [0, 1],
						tick: {
							fill: PALETTE.muted,
							fontSize: 10
						},
						stroke: PALETTE.border
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						contentStyle: {
							background: PALETTE.elevated,
							border: `1px solid ${PALETTE.border}`,
							borderRadius: 8,
							fontSize: 12
						},
						labelFormatter: (v) => `τ ${Number(v).toFixed(3)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "alpha",
						stroke: PALETTE.primary,
						dot: false,
						strokeWidth: 1.6,
						name: "α bio",
						isAnimationActive: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "gamma",
						stroke: PALETTE.indigo,
						dot: false,
						strokeWidth: 1.6,
						name: "γ field",
						isAnimationActive: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "beta",
						stroke: PALETTE.emerald,
						dot: false,
						strokeWidth: 1.6,
						name: "β new-bio",
						isAnimationActive: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
						x: tau,
						stroke: PALETTE.fg,
						strokeOpacity: .4
					})
				]
			})
		})
	});
}
function WeightChart() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-44 rounded-md bg-elevated" }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart, {})
	});
}
function CyclePage() {
	const m = useKyrexis((s) => s.metrics);
	const chain = useKyrexis((s) => s.chain);
	const chainOk = useKyrexis((s) => s.chainOk);
	const phase = phaseAt(m.tau);
	const spec = sampleSpectrum(m.tau, 12);
	const leaf = chain.length ? chain[chain.length - 1] : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-widest text-muted",
					children: "LAYER 3 — UNITARY CYCLE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl",
					children: "Photonic condensation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted",
					children: [
						phase.signature,
						". Tempo ",
						phase.tempo,
						". The pattern is not created — it is re-represented."
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "overflow-hidden p-0 lg:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-72 sm:h-80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilamentCanvas, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute left-4 top-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: phase.colorToken,
								children: phase.label
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "System state" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Live invariants — sealed each phase" })] }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
							label: "Cycle parameter τ",
							value: m.tau.toFixed(4)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
							label: "Unitarity ‖Ψ‖²",
							value: m.unitarity.toFixed(12),
							tone: "emerald"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
							label: "Coherence C",
							value: m.coherence.toFixed(5),
							tone: m.coherence > .9 ? "primary" : m.coherence > .7 ? "amber" : "crimson"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
							label: "Entropy S",
							value: m.entropy.toFixed(3),
							tone: m.entropy < .5 ? "indigo" : m.entropy < 1.4 ? "amber" : "crimson"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
							label: "Gamma lock",
							value: `${m.gammaFreq.toFixed(1)} Hz`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
							label: "Filaments",
							value: String(m.filaments),
							tone: "muted"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Phase track" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Tap a phase to scrub. Embodied → Collapse → Photonic → Seeding → Growth → New Being" })] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaseTimeline, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CycleControls, {})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "AMOLED gnomon" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Angle = dominant eigenmode · glow = C" })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gnomon, {})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Field G(k)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Polar density of photonic correlations" })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-48 overflow-hidden rounded-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarField, {})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Spectral invariance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardMeta, { children: [
							"Fidelity ",
							(spec.fidelity * 100).toFixed(1),
							"% · r ",
							spec.correlation.toFixed(3)
						] })] }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpectralBars, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 font-mono text-xs text-muted",
							children: ["eig(W) ∝ eig(G) ", spec.preserved ? "— held" : "— drifting"]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Hamiltonian weights" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "α bio + β new-bio + γ interaction = 1" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 font-mono text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-primary",
									children: ["α ", m.alpha.toFixed(3)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-indigo",
									children: ["γ ", m.gamma.toFixed(3)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-emerald",
									children: ["β ", m.beta.toFixed(3)]
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeightChart, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Merkle leaf" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: chainOk ? "Chain verified" : "Chain breached" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: chainOk ? "size-2 rounded-full bg-emerald" : "size-2 rounded-full bg-crimson" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md bg-elevated p-3 font-mono text-xs leading-relaxed text-muted break-all",
							children: leaf ? shortHash(leaf.hash, 32) : "hydrating…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-muted",
							children: [
								chain.length,
								" sealed records · ",
								leaf?.module ?? "—"
							]
						})
					] })
				]
			})
		]
	});
}
//#endregion
export { CyclePage as component };
