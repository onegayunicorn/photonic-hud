import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as cn, f as useKyrexis, m as sampleSpectrum, n as PALETTE } from "./router-BZdsoO7S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ClientOnly-CUK-XwI3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PolarField({ className }) {
	const canvasRef = (0, import_react.useRef)(null);
	const tau = useKyrexis((s) => s.tau);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const paint = () => {
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			const rect = canvas.getBoundingClientRect();
			const w = Math.max(1, Math.floor(rect.width * dpr));
			const h = Math.max(1, Math.floor(rect.height * dpr));
			canvas.width = w;
			canvas.height = h;
			const { G } = sampleSpectrum(useKyrexis.getState().tau, 24);
			const max = Math.max(...G, 1e-9);
			const cx = w / 2;
			const cy = h / 2;
			const maxR = Math.min(w, h) * .46;
			const t = useKyrexis.getState().tau;
			ctx.fillStyle = PALETTE.surface;
			ctx.fillRect(0, 0, w, h);
			const rings = 7;
			const segs = 28;
			for (let ring = 0; ring < rings; ring++) {
				const r0 = ring / rings * maxR;
				const r1 = (ring + 1) / rings * maxR;
				for (let s = 0; s < segs; s++) {
					const a0 = s / segs * Math.PI * 2 + t * Math.PI;
					const a1 = (s + 1) / segs * Math.PI * 2 + t * Math.PI;
					const mix = G[Math.floor(s / segs * G.length) % G.length] / max * (.4 + ring / rings);
					ctx.beginPath();
					ctx.moveTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0);
					ctx.lineTo(cx + Math.cos(a1) * r0, cy + Math.sin(a1) * r0);
					ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
					ctx.lineTo(cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1);
					ctx.closePath();
					const hue = 186 - mix * 40;
					ctx.fillStyle = `hsla(${hue}, 72%, ${42 + mix * 18}%, ${.12 + mix * .55})`;
					ctx.fill();
				}
			}
			ctx.beginPath();
			ctx.arc(cx, cy, 3 * dpr, 0, Math.PI * 2);
			ctx.fillStyle = PALETTE.primary;
			ctx.fill();
		};
		paint();
		const ro = new ResizeObserver(paint);
		ro.observe(canvas);
		return () => ro.disconnect();
	}, [tau]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: cn("block h-full w-full rounded-md", className),
		"aria-label": "Photonic field polar density"
	});
}
function ClientOnly({ children, fallback }) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return fallback ?? null;
	return children;
}
//#endregion
export { PolarField as n, ClientOnly as t };
