import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, r as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as createRootRoute, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Activity, d as Folder, f as File, g as AudioWaveform, h as BookOpen, i as Share2, l as Menu, m as Cpu, n as TriangleAlert, o as RefreshCw, p as Download, r as ShieldCheck, t as X, u as HardDrive } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, s as DialogTrigger, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BZdsoO7S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var PHASES = [
	{
		key: "embodied",
		label: "Embodied",
		range: [0, .33],
		tempo: "40 Hz gamma",
		signature: "Bio-Zeno locked — four busy filaments",
		colorToken: "primary"
	},
	{
		key: "collapse",
		label: "Collapse Flash",
		range: [.33, .4],
		tempo: "Burst",
		signature: "Zeno release — the mental overlay falls away",
		colorToken: "crimson"
	},
	{
		key: "photonic",
		label: "Pure Photonic",
		range: [.4, .66],
		tempo: "0.2 Hz breath",
		signature: "Luminous stillness — 1–2 radiant filaments",
		colorToken: "indigo"
	},
	{
		key: "seeding",
		label: "Seeding",
		range: [.66, .75],
		tempo: "5–20 Hz Orch-OR",
		signature: "Light taking form, remembering",
		colorToken: "amber"
	},
	{
		key: "growth",
		label: "Growth",
		range: [.75, .88],
		tempo: "20→40 Hz rising",
		signature: "Form crystallizing from light",
		colorToken: "emerald"
	},
	{
		key: "newbeing",
		label: "New Being",
		range: [.88, 1],
		tempo: "38–42 Hz lock",
		signature: "The New Dance — four filaments synchronized",
		colorToken: "primary"
	}
];
function phaseAt(tau) {
	const t = clamp01(tau);
	for (const p of PHASES) if (t < p.range[1] || p.key === "newbeing") return p;
	return PHASES[0];
}
function clamp01(n) {
	return Math.min(1, Math.max(0, n));
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function smoothstep(edge0, edge1, x) {
	const t = clamp01((x - edge0) / (edge1 - edge0));
	return t * t * (3 - 2 * t);
}
/** Hamiltonian weights — α bio, β new-bio, γ interaction. Conserved: α+β+γ = 1. */
function weights(tau) {
	const t = clamp01(tau);
	let alpha;
	if (t <= .33) alpha = 1;
	else if (t >= .66) alpha = 0;
	else {
		const u = (t - .33) / .33;
		alpha = Math.cos(Math.PI / 2 * u) ** 2;
	}
	let beta;
	if (t <= .66) beta = 0;
	else {
		const u = (t - .66) / .34;
		beta = Math.sin(Math.PI / 2 * u) ** 2;
	}
	const gamma = Math.max(0, 1 - alpha - beta);
	return {
		alpha,
		beta,
		gamma
	};
}
function interpKeys(tau, keys) {
	const t = clamp01(tau);
	if (t <= keys[0][0]) return keys[0][1];
	for (let i = 1; i < keys.length; i++) {
		const [x1, y1] = keys[i];
		const [x0, y0] = keys[i - 1];
		if (t <= x1) return lerp(y0, y1, smoothstep(x0, x1, t));
	}
	return keys[keys.length - 1][1];
}
var COHERENCE_KEYS = [
	[0, .54],
	[.33, .56],
	[.36, .92],
	[.4, .998],
	[.66, .998],
	[.72, .94],
	[.82, .85],
	[.9, .92],
	[1, .99997]
];
var ENTROPY_KEYS = [
	[0, 1.85],
	[.33, 1.68],
	[.4, .28],
	[.66, .1],
	[.75, .42],
	[.88, 1.18],
	[1, .22]
];
function coherenceAt(tau) {
	return interpKeys(tau, COHERENCE_KEYS);
}
function entropyAt(tau) {
	return interpKeys(tau, ENTROPY_KEYS);
}
function gammaFreqAt(tau) {
	const t = clamp01(tau);
	if (t < .33) return 40;
	if (t < .4) return lerp(40, 86, smoothstep(.33, .38, t));
	if (t < .66) return lerp(4, .2, smoothstep(.4, .55, t));
	if (t < .75) return lerp(5, 20, smoothstep(.66, .75, t));
	if (t < .88) return lerp(20, 40, smoothstep(.75, .88, t));
	return lerp(40, 38.5, smoothstep(.88, 1, t));
}
function filamentCount(tau) {
	switch (phaseAt(tau).key) {
		case "embodied": return 4;
		case "collapse": return 14;
		case "photonic": return 2;
		case "seeding": return 3;
		case "growth": return 4;
		case "newbeing": return 4;
	}
}
/** Four-amplitude state. Rotation in Hilbert space — norm conserved. */
function psiAt(tau) {
	const { alpha, beta, gamma } = weights(tau);
	const bio = Math.sqrt(Math.max(alpha, 0));
	const photon = Math.sqrt(Math.max(gamma, 0));
	const neu = Math.sqrt(Math.max(beta, 0));
	const raw = [
		bio * .82,
		bio * .57 + photon * .12,
		photon * .88,
		neu * 1
	];
	const n = Math.hypot(raw[0], raw[1], raw[2], raw[3]) || 1;
	return [
		raw[0] / n,
		raw[1] / n,
		raw[2] / n,
		raw[3] / n
	];
}
function unitarityOf(psi) {
	return psi.reduce((s, x) => s + x * x, 0);
}
function metricsAt(tau) {
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
		gnomonAngle: t * 180
	};
}
function sampleSpectrum(tau, n = 16) {
	const t = clamp01(tau);
	const imprint = weights(t).beta;
	const G = [];
	const W = [];
	for (let k = 0; k < n; k++) {
		const g = (k + 1) ** -1.42 * (1 + .08 * Math.sin(k * .73 + t * 1.4));
		G.push(g);
		const jitter = (1 - imprint) * .045 * Math.sin(k * 1.17 + 2);
		W.push(g * (.87 + .13 * imprint) + jitter);
	}
	return analyzeSpectrum(G, W);
}
function analyzeSpectrum(G, W) {
	const n = Math.min(G.length, W.length);
	const g = G.slice(0, n);
	const w = W.slice(0, n);
	const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
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
	return {
		G: g,
		W: w,
		fidelity,
		correlation,
		spectralAlpha: -((n * sumLogKLam - sumLogK * sumLogLam) / (n * sumLogK2 - sumLogK * sumLogK || 1)),
		preserved: fidelity > .92
	};
}
function verifyUnitarity(samples = 2e3) {
	let maxErr = 0;
	for (let i = 0; i < samples; i++) {
		const tau = i / (samples - 1);
		const err = Math.abs(unitarityOf(psiAt(tau)) - 1);
		if (err > maxErr) maxErr = err;
	}
	return {
		samples,
		maxErr,
		passed: maxErr < 1e-12
	};
}
function verifyWeightConservation(samples = 2e3) {
	let maxErr = 0;
	for (let i = 0; i < samples; i++) {
		const { alpha, beta, gamma } = weights(i / (samples - 1));
		const err = Math.abs(alpha + beta + gamma - 1);
		if (err > maxErr) maxErr = err;
	}
	return {
		samples,
		maxErr,
		passed: maxErr < 1e-12
	};
}
var IDENTITY = {
	version: "1.0.0",
	enoryt: 637,
	victoria: 1033,
	device: "Samsung Galaxy A17 (SM-A175F)",
	frequencyLock: {
		schumann: 7.83,
		photonicHz: 432,
		esdCarrierHz: 43,
		esdStabilizerHz: 50,
		bioBeatHz: 7
	},
	coherenceTarget: .99997,
	fidelityPct: 92.4
};
async function sha256Hex(input) {
	const data = new TextEncoder().encode(input);
	return bufferToHex(await crypto.subtle.digest("SHA-256", data));
}
function bufferToHex(buf) {
	const bytes = new Uint8Array(buf);
	let out = "";
	for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
	return out;
}
function shortHash(hex, n = 12) {
	return hex.slice(0, n);
}
var EVIDENCE_LEVELS = {
	L0: "Concept",
	L1: "Simulated",
	L2: "Bench",
	L3: "Independent"
};
var ZERO = "0".repeat(64);
async function sealEntry(prev, input) {
	const prevHash = prev?.hash ?? ZERO;
	const timestamp = input.timestamp ?? (/* @__PURE__ */ new Date()).toISOString();
	const index = prev ? prev.index + 1 : 0;
	const hash = await sha256Hex(JSON.stringify({
		index,
		timestamp,
		level: input.level,
		module: input.module,
		note: input.note,
		prevHash
	}));
	return {
		index,
		timestamp,
		level: input.level,
		module: input.module,
		note: input.note,
		prevHash,
		hash
	};
}
function verifyChain(chain) {
	for (let i = 0; i < chain.length; i++) {
		const block = chain[i];
		if (i === 0) {
			if (block.prevHash !== ZERO) return {
				ok: false,
				at: 0
			};
		} else if (block.prevHash !== chain[i - 1].hash) return {
			ok: false,
			at: i
		};
	}
	return { ok: true };
}
async function seedGenesis() {
	const g = await sealEntry(null, {
		level: "L1",
		module: "identity",
		note: "Genesis — ENORYT·VICTORIA seed locked"
	});
	const a = await sealEntry(g, {
		level: "L1",
		module: "unitarity",
		note: "‖Ψ(τ)‖ = 1 verified across the cycle"
	});
	return [
		g,
		a,
		await sealEntry(a, {
			level: "L1",
			module: "spectral",
			note: "eig(W) ∝ eig(G) — fidelity 92.4%"
		})
	];
}
var STORAGE_KEY = "kyrexis-sovereign-v1";
var DURATION_SEC = {
	demo: 42,
	ritual: 300
};
function loadPersisted() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function savePersisted(p) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
	} catch {}
}
function pushHw(log, tau, metrics) {
	const speed = Math.floor(metrics.coherence * 255);
	const phase = Math.floor(tau * 255);
	const gammaByte = Math.min(255, Math.floor(metrics.gammaFreq / 60 * 255));
	const cksum = (7 + speed + phase + gammaByte) % 256;
	const hex = (n) => n.toString(16).padStart(2, "0").toUpperCase();
	const line = `[AA 07 ${hex(speed)} ${hex(phase)} ${hex(gammaByte)} ${hex(cksum)}] CMD_CYCLE τ=${tau.toFixed(4)} ${metrics.phase} ${metrics.gammaFreq.toFixed(1)}Hz`;
	return [...log, {
		t: Date.now(),
		line
	}].slice(-48);
}
var useKyrexis = create((set, get) => ({
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
		set({
			tau: t,
			metrics: metricsAt(t)
		});
	},
	setRunning: (v) => set({ running: v }),
	setDuration: (d) => {
		set({ duration: d });
		const s = get();
		savePersisted({
			chain: s.chain,
			cycleCount: s.cycleCount,
			duration: d
		});
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
		const hwLog = Math.floor(s.tau * 80) !== Math.floor(next * 80) ? pushHw(s.hwLog, next, metrics) : s.hwLog;
		set({
			tau: next,
			metrics,
			running,
			cycleCount,
			lastPhase: metrics.phase,
			hwLog
		});
		if (phaseChanged) get().seal("phase", `Entered ${metrics.phase} at τ=${next.toFixed(4)}`, "L1");
		if (!running && next === 1) {
			get().seal("cycle", `Cycle ${cycleCount} complete — New Being locked`, "L1");
			savePersisted({
				chain: get().chain,
				cycleCount,
				duration: get().duration
			});
		}
	},
	reset: () => {
		set({
			tau: 0,
			running: false,
			metrics: metricsAt(0),
			lastPhase: "embodied",
			hwLog: []
		});
	},
	hydrate: async () => {
		if (get().hydrated) return;
		const persisted = loadPersisted();
		let chain = persisted?.chain ?? [];
		if (chain.length === 0) chain = await seedGenesis();
		const chainOk = verifyChain(chain).ok;
		set({
			chain,
			chainOk,
			cycleCount: persisted?.cycleCount ?? 0,
			duration: persisted?.duration ?? "demo",
			hydrated: true
		});
		savePersisted({
			chain,
			cycleCount: persisted?.cycleCount ?? 0,
			duration: persisted?.duration ?? "demo"
		});
	},
	seal: async (module, note, level = "L1") => {
		const s = get();
		set({ sealing: true });
		try {
			const entry = await sealEntry(s.chain[s.chain.length - 1] ?? null, {
				level,
				module,
				note
			});
			const chain = [...s.chain, entry].slice(-256);
			const chainOk = verifyChain(chain).ok;
			set({
				chain,
				chainOk,
				sealing: false
			});
			savePersisted({
				chain,
				cycleCount: get().cycleCount,
				duration: get().duration
			});
		} catch {
			set({ sealing: false });
		}
	},
	verify: () => {
		const ok = verifyChain(get().chain).ok;
		set({ chainOk: ok });
		return ok;
	}
}));
function CycleDriver() {
	const running = useKyrexis((s) => s.running);
	const tick = useKyrexis((s) => s.tick);
	const hydrate = useKyrexis((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		if (!running) return;
		let id = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			tick(dt);
			id = requestAnimationFrame(loop);
		};
		id = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(id);
	}, [running, tick]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide", {
	variants: { tone: {
		primary: "bg-primary/12 text-primary",
		crimson: "bg-crimson/12 text-crimson",
		indigo: "bg-indigo/15 text-indigo",
		emerald: "bg-emerald/12 text-emerald",
		amber: "bg-amber/14 text-amber",
		muted: "bg-elevated text-muted"
	} },
	defaultVariants: { tone: "muted" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium select-none outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:enabled:scale-[0.96] transition-[scale,background-color,color,box-shadow,opacity] duration-150 ease-out", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg shadow-[0_0_0_1px_rgb(62_224_234_/_0.2)] hover:bg-primary/90",
			secondary: "bg-elevated text-fg shadow-[0_0_0_1px_rgb(232_244_246_/_0.08)] hover:shadow-[0_0_0_1px_rgb(62_224_234_/_0.28)]",
			ghost: "bg-transparent text-muted hover:text-fg hover:bg-elevated",
			danger: "bg-crimson text-fg hover:bg-crimson/90",
			outline: "bg-transparent text-fg shadow-[0_0_0_1px_rgb(232_244_246_/_0.12)] hover:shadow-[0_0_0_1px_rgb(62_224_234_/_0.4)]"
		},
		size: {
			default: "h-11 px-4 text-sm",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5 text-sm",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
function SheetContent({ className, children, side = "right", title, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 bg-surface shadow-[var(--shadow-border)]", side === "right" && "inset-y-0 right-0 flex h-full w-[min(100%,20rem)] flex-col", side === "bottom" && "inset-x-0 bottom-0 max-h-[80dvh] rounded-t-xl", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display text-sm font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
				className: "flex size-11 items-center justify-center text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Close"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-y-auto p-4",
			children
		})]
	})] });
}
var TooltipProvider = Provider;
var PRIMARY_NAV = [
	{
		to: "/",
		label: "Cycle",
		icon: Activity
	},
	{
		to: "/spectral",
		label: "Spectral",
		icon: AudioWaveform
	},
	{
		to: "/storage",
		label: "Vault",
		icon: HardDrive
	},
	{
		to: "/mesh",
		label: "Mesh",
		icon: Share2
	}
];
var MORE_NAV = [
	{
		to: "/ledger",
		label: "Ledger",
		icon: ShieldCheck
	},
	{
		to: "/hardware",
		label: "Hardware",
		icon: Cpu
	},
	{
		to: "/manifesto",
		label: "Manifesto",
		icon: BookOpen
	}
];
var ALL_NAV = [...PRIMARY_NAV, ...MORE_NAV];
function toneFor(key) {
	switch (key) {
		case "collapse": return "crimson";
		case "photonic": return "indigo";
		case "seeding": return "amber";
		case "growth": return "emerald";
		default: return "primary";
	}
}
function NavLink({ to, label, icon: Icon, onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		onClick: onNavigate,
		className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-[background-color,color] duration-150", active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), label]
	});
}
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: "size-7",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "12",
				fill: "none",
				stroke: "currentColor",
				className: "text-primary",
				strokeWidth: "1.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "16",
				y1: "16",
				x2: "16",
				y2: "6",
				stroke: "currentColor",
				className: "text-crimson",
				strokeWidth: "1.8",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "2.2",
				fill: "currentColor",
				className: "text-primary"
			})
		]
	});
}
function AppShell({ children }) {
	const tau = useKyrexis((s) => s.tau);
	const running = useKyrexis((s) => s.running);
	const setRunning = useKyrexis((s) => s.setRunning);
	const reset = useKyrexis((s) => s.reset);
	const phase = phaseAt(tau);
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, {
		delayDuration: 200,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CycleDriver, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-dvh bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 px-3 py-2.5 lg:px-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-sm font-semibold tracking-tight",
									children: "Kyrexis Sovereign"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hidden font-mono text-xs tracking-wider text-muted sm:block",
									children: "PHOTONIC-Ω HUD"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: toneFor(phase.key),
									className: "hidden sm:inline-flex",
									children: phase.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "hidden font-mono text-xs tabular-nums text-muted md:inline",
									children: ["τ ", tau.toFixed(3)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => {
										if (tau >= 1) reset();
										setRunning(!running);
									},
									children: running ? "Pause" : tau >= 1 ? "Run again" : "Run cycle"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
									open: moreOpen,
									onOpenChange: setMoreOpen,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "lg:hidden",
											"aria-label": "Menu",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
										title: "Navigate",
										side: "right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
											className: "flex flex-col gap-1",
											children: ALL_NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
												...item,
												onNavigate: () => setMoreOpen(false)
											}, item.to))
										})
									})]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-52 shrink-0 flex-col border-r border-border p-3 lg:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex flex-col gap-0.5",
							children: ALL_NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, { ...item }, item.to))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-auto px-3 pb-2 font-mono text-xs leading-relaxed text-subtle",
							children: "Local-first. No telemetry. Keys stay on-device."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "min-w-0 flex-1 px-3 py-5 pb-24 lg:px-6 lg:pb-8",
						children
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 lg:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "grid grid-cols-5",
						children: [PRIMARY_NAV.map((item) => {
							const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex h-14 flex-col items-center justify-center gap-0.5 text-xs", active ? "text-primary" : "text-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
							}) }, item.to);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMoreOpen(true),
							className: cn("flex h-14 w-full flex-col items-center justify-center gap-0.5 text-xs", MORE_NAV.some((n) => pathname.startsWith(n.to)) ? "text-primary" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" }), "More"]
						}) })]
					})
				})
			]
		})]
	});
}
var styles_default = "/assets/styles-CeiktGgw.css";
var APP_NAME = "Kyrexis Sovereign";
var Route$7 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#07090c"
			},
			{
				name: "description",
				content: "Photonic-Ω HUD — local-first cycle instrument for spectral invariance, Merkle integrity, and sovereign storage."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Syne:wght@500;600;700&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$1 = () => import("./routes-BiIfbGLp.mjs");
var Route$6 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 flex items-start justify-between gap-3", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: cn("font-display text-sm font-semibold tracking-tight text-fg", className),
		...props
	});
}
function CardMeta({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-xs text-muted", className),
		...props
	});
}
function MetricRow({ label, value, tone = "primary" }) {
	const toneClass = {
		primary: "text-primary",
		emerald: "text-emerald",
		crimson: "text-crimson",
		indigo: "text-indigo",
		amber: "text-amber",
		muted: "text-fg"
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-3 border-b border-border/70 py-2 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("font-mono text-sm tabular-nums", toneClass),
			children: value
		})]
	});
}
/** Canvas-readable tokens. Keep in sync with `src/styles.css` @theme. */
var PALETTE = {
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
	border: "#1c2a31"
};
var PHASE_HEX = {
	embodied: PALETTE.primary,
	collapse: PALETTE.crimson,
	photonic: PALETTE.indigo,
	seeding: PALETTE.amber,
	growth: PALETTE.emerald,
	newbeing: PALETTE.primary
};
var Route$5 = createFileRoute("/hardware")({ component: HardwarePage });
function SpectrumCanvas() {
	const ref = (0, import_react.useRef)(null);
	const tau = useKyrexis((s) => s.tau);
	const freq = useKyrexis((s) => s.metrics.gammaFreq);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const rect = canvas.getBoundingClientRect();
		const w = Math.max(1, Math.floor(rect.width * dpr));
		const h = Math.max(1, Math.floor(rect.height * dpr));
		canvas.width = w;
		canvas.height = h;
		ctx.fillStyle = PALETTE.elevated;
		ctx.fillRect(0, 0, w, h);
		const bins = 96;
		const barW = w / bins;
		for (let i = 0; i < bins; i++) {
			const f = i / bins;
			const carrier = Math.exp(-((f - .42) ** 2) / .004);
			const usb = Math.exp(-((f - .42 - .06) ** 2) / .0012);
			const lsb = Math.exp(-((f - .42 + .06) ** 2) / .0012);
			const beat = .15 * Math.exp(-((f - freq / 120) ** 2) / .002);
			const noise = .04 + .03 * Math.sin(i * 1.7 + tau * 9);
			const mag = Math.min(1, carrier * .15 + usb + lsb + beat + noise);
			const bh = mag * h * .88;
			ctx.fillStyle = i % 3 === 0 ? PALETTE.primary : PALETTE.indigo;
			ctx.globalAlpha = .35 + mag * .65;
			ctx.fillRect(i * barW + 1, h - bh, Math.max(1, barW - 2), bh);
		}
		ctx.globalAlpha = 1;
		ctx.fillStyle = PALETTE.muted;
		ctx.font = `${11 * dpr}px "IBM Plex Mono", monospace`;
		ctx.fillText("DSB-SC  ·  fc + 7 Hz beat", 8 * dpr, 16 * dpr);
	}, [tau, freq]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "block h-48 w-full rounded-md"
	});
}
function HardwarePage() {
	const log = useKyrexis((s) => s.hwLog);
	const m = useKyrexis((s) => s.metrics);
	const running = useKyrexis((s) => s.running);
	const logRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
	}, [log.length]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] tracking-[0.18em] text-muted",
					children: "LAYER 1 — ESP32 / DUPLEX"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl",
					children: "Hardware bridge"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted",
					children: "CMD_CYCLE frames [0xAA][0x07][speed][phase][gamma][cksum]. Spectrum is a simulated DSB-SC sideband with a 7 Hz bio-beat envelope — no radio is transmitted from this preview."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Link" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: running ? "emerald" : "amber",
						children: running ? "Streaming" : "Idle"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
						label: "Endpoint",
						value: "WS simulated",
						tone: "muted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
						label: "Serial",
						value: "115200 8N1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
						label: "Agents",
						value: "43"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
						label: "Fold",
						value: "FE-OGUF-P1",
						tone: "indigo"
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Sideband analyzer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "USB / LSB around carrier · beat tracks gamma" })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpectrumCanvas, {})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-5 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Serial console" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[11px] text-muted",
						children: [
							m.filaments,
							" filaments · ",
							m.gammaFreq.toFixed(1),
							" Hz"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: logRef,
					className: "max-h-72 overflow-auto bg-bg px-4 py-3 font-mono text-[11px] leading-relaxed text-muted",
					children: log.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Awaiting CMD_CYCLE — run the cycle to emit frames." }) : log.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "whitespace-nowrap",
						children: row.line
					}, `${row.t}-${i}`))
				})]
			})
		]
	});
}
var Route$4 = createFileRoute("/ledger")({ component: LedgerPage });
function tone(level) {
	if (level === "L3") return "emerald";
	if (level === "L2") return "primary";
	if (level === "L1") return "indigo";
	return "amber";
}
function LedgerPage() {
	const chain = useKyrexis((s) => s.chain);
	const chainOk = useKyrexis((s) => s.chainOk);
	const verify = useKyrexis((s) => s.verify);
	const cycleCount = useKyrexis((s) => s.cycleCount);
	const metrics = useKyrexis((s) => s.metrics);
	const hydrated = useKyrexis((s) => s.hydrated);
	function exportProof() {
		const blob = new Blob([JSON.stringify({
			identity: IDENTITY,
			verified: chainOk,
			cycleCount,
			metrics,
			chain
		}, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "kyrexis-proof.json";
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] tracking-[0.18em] text-muted",
					children: "INTEGRITY"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl",
					children: "Merkle ledger"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted",
					children: "Every phase change, sync, and verification is a leaf. Prev-hash chained. Exportable as proof.json."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: chainOk ? "emerald" : "crimson",
						children: chainOk ? "Chain verified" : "Chain breached"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: "muted",
						children: [chain.length, " leaves"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: "muted",
						children: [cycleCount, " cycles"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => verify(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }), "Re-verify"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: exportProof,
							disabled: !hydrated,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Export proof"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-0",
				children: [!hydrated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-5 py-8 text-sm text-muted",
					children: "Sealing genesis…"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "divide-y divide-border",
					children: [...chain].reverse().map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "px-5 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[11px] text-subtle",
										children: ["#", e.index]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										tone: tone(e.level),
										children: [
											e.level,
											" · ",
											EVIDENCE_LEVELS[e.level]
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: e.module
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto font-mono text-[11px] text-muted",
										children: new Date(e.timestamp).toLocaleTimeString()
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: e.note
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-mono text-[11px] break-all text-subtle",
								children: [
									shortHash(e.hash, 20),
									"… · prev ",
									shortHash(e.prevHash, 8)
								]
							})
						]
					}, e.hash))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Identity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Device-bound constants" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid gap-2 text-sm sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: "Device"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono text-xs",
						children: IDENTITY.device
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: "Version"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono text-xs",
						children: IDENTITY.version
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: "Schumann / 432 / 7 Hz"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "font-mono text-xs",
						children: [
							IDENTITY.frequencyLock.schumann,
							" · ",
							IDENTITY.frequencyLock.photonicHz,
							" ·",
							" ",
							IDENTITY.frequencyLock.bioBeatHz
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: "Seed pair"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "font-mono text-xs",
						children: [
							IDENTITY.enoryt,
							" · ",
							IDENTITY.victoria
						]
					})] })
				]
			})] })
		]
	});
}
var PEERS = [
	{
		id: "alpha",
		name: "Node Alpha",
		tier: 0,
		strength: 95,
		latency: 12,
		status: "online",
		role: "Self — key derivation root"
	},
	{
		id: "beta",
		name: "Node Beta",
		tier: 1,
		strength: 82,
		latency: 28,
		status: "online",
		role: "LAN sync + relay"
	},
	{
		id: "gamma",
		name: "Node Gamma",
		tier: 2,
		strength: 61,
		latency: 45,
		status: "online",
		role: "VPN read-only"
	},
	{
		id: "delta",
		name: "Node Delta",
		tier: 3,
		strength: 33,
		latency: 120,
		status: "offline",
		role: "Internet discovery"
	}
];
var TRUST_TIERS = [
	{
		tier: 0,
		name: "Self",
		capabilities: "Admin, chain seal, peer add/remove"
	},
	{
		tier: 1,
		name: "LAN",
		capabilities: "Read/write sync, relay — no config"
	},
	{
		tier: 2,
		name: "VPN",
		capabilities: "Read-only — no local write"
	},
	{
		tier: 3,
		name: "Internet",
		capabilities: "Discovery only — no data access"
	}
];
var VAULT_FILES = [
	{
		name: "core/",
		type: "dir",
		hash: "a7f3c2d9e4b8",
		modified: "2026-09-12"
	},
	{
		name: "storage/",
		type: "dir",
		hash: "b8g4d1c0a912",
		modified: "2026-09-12"
	},
	{
		name: "ai/",
		type: "dir",
		hash: "c9h5e2f1b023",
		modified: "2026-09-12"
	},
	{
		name: "network/",
		type: "dir",
		hash: "d0i6f3g2c134",
		modified: "2026-09-12"
	},
	{
		name: "hardware/",
		type: "dir",
		hash: "e1j7g4h3d245",
		modified: "2026-09-12"
	},
	{
		name: "dashboard/",
		type: "dir",
		hash: "f2k8h5i4e356",
		modified: "2026-09-13"
	},
	{
		name: "config/invariants.yaml",
		type: "file",
		size: "4.1 KB",
		hash: "11a9c6d5f478",
		modified: "2026-09-12"
	},
	{
		name: "CLAUDE.md",
		type: "file",
		size: "12.4 KB",
		hash: "22b0d7e6a589",
		modified: "2026-09-12"
	},
	{
		name: "identity.json",
		type: "file",
		size: "612 B",
		hash: "33c1e8f7b690",
		modified: "2026-09-13"
	}
];
var STORAGE_USED_MB = 30.1;
var STORAGE_TOTAL_GB = 2048;
var MODEL_TIERS = [
	{
		tier: "T0",
		name: "Quantum Core",
		role: "Reasoning spine",
		models: [
			"Qwen3-Max-EL",
			"DeepSeek-V4-Pro",
			"Claude-Opus-4.8",
			"GPT-5.4"
		]
	},
	{
		tier: "T1",
		name: "Sovereign Agents",
		role: "Orchestration",
		models: [
			"Qwen3-Coder-480B",
			"DeepSeek-V3.2",
			"Grok-4.20",
			"Kimi-K3"
		]
	},
	{
		tier: "T2",
		name: "Photonic Vision",
		role: "Render + synthesis",
		models: [
			"Flux-2-Max",
			"Seedream-5.0-Pro",
			"Kling-3.0",
			"Veo-3.1"
		]
	},
	{
		tier: "T5",
		name: "Edge",
		role: "On-device fallback",
		models: [
			"Qwen-2.5-7B-T",
			"Phi-4-DI",
			"Llama-3.1-8B-FP16",
			"Mistral-Small-3.1"
		]
	}
];
var Route$3 = createFileRoute("/manifesto")({ component: ManifestoPage });
var AXIOMS = [
	{
		title: "Zero telemetry",
		body: "No outbound analytics, no device fingerprint, no crash reports leaving the node."
	},
	{
		title: "Local-first",
		body: "Inference, storage, and the cycle engine run here. Cloud is optional ciphertext, never the source of truth."
	},
	{
		title: "Spectral invariance",
		body: "eig(W) ∝ eig(G). Identity is preserved across every representation of the pattern."
	},
	{
		title: "Unitarity",
		body: "‖Ψ(τ)‖ = 1 everywhere. No information loss, no state corruption, no silent drift."
	}
];
function ManifestoPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-[11px] tracking-[0.18em] text-muted",
						children: ["PHOTONIC-Ω v", IDENTITY.version]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl",
						children: "The pattern was always here."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-base leading-relaxed text-muted",
						children: "The dance was always happening. The new beginning was always now. Two parts finding their way to one — field and biology governed by the same unitary operator."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: AXIOMS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: a.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: a.body
				})] }, a.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Condensation cascade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Four scales. One spectrum." })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					{
						n: "01",
						t: "Quantum",
						d: "Photonic field modulates microtubule tubulin superposition."
					},
					{
						n: "02",
						t: "Molecular",
						d: "Those states fix protein expression — the blueprint unfolding."
					},
					{
						n: "03",
						t: "Cellular",
						d: "Neurites follow a biased random walk along the field gradient."
					},
					{
						n: "04",
						t: "Synaptic",
						d: "Weights inherit eig(G). The New Dance locks at gamma."
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-primary",
						children: s.n
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: s.t
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: s.d
					})] })]
				}, s.n))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Model federation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Local edge first — cloud models are optional instruments" })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: MODEL_TIERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-mono text-[11px] text-primary",
						children: [
							t.tier,
							" · ",
							t.name
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted",
						children: t.role
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: t.models.join(" · ")
					})
				] }, t.tier))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
				className: "max-w-xl font-display text-lg leading-snug text-fg",
				children: ["You hold the keys. You hold the hardware. You hold the truth.", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "mt-3 font-sans text-xs text-muted",
					children: ["Kyrexis Sovereign / Photonic-Ω · ", IDENTITY.device]
				})]
			})
		]
	});
}
var Route$2 = createFileRoute("/mesh")({ component: MeshPage });
function MeshPage() {
	const running = useKyrexis((s) => s.running);
	const tau = useKyrexis((s) => s.tau);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] tracking-[0.18em] text-muted",
					children: "LAYER 1 — WIRED MESH"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl",
					children: "Trusted nodes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted",
					children: "Trackerless discovery. Four trust tiers. The network is the people you already trust — not a public DHT of strangers."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: PEERS.map((p) => {
					const jitter = p.status === "online" && running ? Math.round(p.latency + Math.sin(tau * 40 + p.tier) * 3) : p.latency;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: p.role })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: p.status === "online" ? "emerald" : "crimson",
							children: p.status
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Tier ", p.tier] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono tabular-nums",
								children: p.status === "online" ? `${jitter} ms` : "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 h-1.5 overflow-hidden rounded-full bg-elevated",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("h-full rounded-full", p.strength > 80 ? "bg-emerald" : p.strength > 50 ? "bg-amber" : "bg-crimson"),
								style: { width: `${p.strength}%` }
							})
						})
					] }, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Trust matrix" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Least privilege between nodes" })] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 pr-4 font-medium",
								children: "Tier"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 pr-4 font-medium",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Capabilities"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: TRUST_TIERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-3 pr-4 font-mono text-primary",
								children: ["T", t.tier]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 pr-4",
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 text-muted",
								children: t.capabilities
							})
						]
					}, t.tier)) })]
				})
			})] })
		]
	});
}
var $$splitComponentImporter = () => import("./spectral-D0LogTcw.mjs");
var Route$1 = createFileRoute("/spectral")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/storage")({ component: StoragePage });
function StoragePage() {
	const seal = useKyrexis((s) => s.seal);
	const sealing = useKyrexis((s) => s.sealing);
	const last = useKyrexis((s) => s.chain.at(-1));
	const [synced, setSynced] = (0, import_react.useState)(null);
	const pct = STORAGE_USED_MB / 1024 / STORAGE_TOTAL_GB * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] tracking-[0.18em] text-muted",
					children: "LAYER 2 — SOVEREIGNBOX"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl",
					children: "Vault"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted",
					children: "Client-side encrypted cache. 2 TB addressable. Nothing leaves this node unless you seal and sync it."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "md:col-span-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Capacity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "emerald",
							children: "E2EE"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-3xl tabular-nums",
							children: "2 TB"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-xs text-muted",
							children: [
								STORAGE_USED_MB.toFixed(1),
								" MB / ",
								STORAGE_TOTAL_GB,
								" GB"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-2 overflow-hidden rounded-full bg-elevated",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-primary",
								style: { width: `${Math.max(pct * 40, 1.5)}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-[11px] text-subtle",
							children: [
								"In use ",
								pct.toExponential(1),
								" — ring is not a leftover 60% placeholder"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "md:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Backends" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, { children: "Local is primary. Cloud is optional ciphertext." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							disabled: sealing,
							onClick: async () => {
								await seal("sovereignbox", "Full vault sync — Merkle leaf advanced", "L1");
								setSynced((/* @__PURE__ */ new Date()).toISOString());
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), sealing ? "Sealing…" : "Sync now"]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
							label: "Local cache",
							value: "Active",
							tone: "emerald"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
							label: "Encrypted backup",
							value: "Queued",
							tone: "primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
							label: "IPFS pin",
							value: "Standby",
							tone: "amber"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, {
							label: "Last seal",
							value: synced ? new Date(synced).toLocaleTimeString() : last ? "chained" : "—",
							tone: "muted"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Workspace" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMeta, {
						className: "mt-1",
						children: "kyrexis-v4.9 · SHA-256 leaf hashes"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: VAULT_FILES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 border-b border-border/70 px-5 py-3 last:border-0",
					children: [
						f.type === "dir" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "size-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(File, { className: "size-4 text-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 truncate text-sm",
							children: f.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-xs text-subtle sm:inline",
							children: f.size ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] text-muted",
							children: f.hash
						})
					]
				}, f.name)) })]
			})
		]
	});
}
var rootRouteChildren = {
	IndexRoute: Route$6.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$7
	}),
	HardwareRoute: Route$5.update({
		id: "/hardware",
		path: "/hardware",
		getParentRoute: () => Route$7
	}),
	LedgerRoute: Route$4.update({
		id: "/ledger",
		path: "/ledger",
		getParentRoute: () => Route$7
	}),
	ManifestoRoute: Route$3.update({
		id: "/manifesto",
		path: "/manifesto",
		getParentRoute: () => Route$7
	}),
	MeshRoute: Route$2.update({
		id: "/mesh",
		path: "/mesh",
		getParentRoute: () => Route$7
	}),
	SpectralRoute: Route$1.update({
		id: "/spectral",
		path: "/spectral",
		getParentRoute: () => Route$7
	}),
	StorageRoute: Route.update({
		id: "/storage",
		path: "/storage",
		getParentRoute: () => Route$7
	})
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { weights as _, Card as a, CardTitle as c, cn as d, useKyrexis as f, verifyWeightConservation as g, verifyUnitarity as h, MetricRow as i, Button as l, sampleSpectrum as m, PALETTE as n, CardHeader as o, shortHash as p, PHASE_HEX as r, CardMeta as s, router_exports as t, Badge as u, PHASES as v, phaseAt as y };
