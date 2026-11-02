import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  AudioWaveform,
  BookOpen,
  Cpu,
  HardDrive,
  Menu,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { CycleDriver } from "@/components/hud/CycleDriver";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { phaseAt } from "@/lib/photonic/phases";
import { useKyrexis } from "@/lib/photonic/store";
import { buildInfo } from "@/generated/build-info";
import { cn } from "@/lib/utils";

const PRIMARY_NAV = [
  { to: "/", label: "Cycle", icon: Activity },
  { to: "/spectral", label: "Spectral", icon: AudioWaveform },
  { to: "/storage", label: "Vault", icon: HardDrive },
  { to: "/mesh", label: "Mesh", icon: Share2 },
] as const;

const MORE_NAV = [
  { to: "/ledger", label: "Ledger", icon: ShieldCheck },
  { to: "/hardware", label: "Hardware", icon: Cpu },
  { to: "/manifesto", label: "Manifesto", icon: BookOpen },
] as const;

const ALL_NAV = [...PRIMARY_NAV, ...MORE_NAV];

function toneFor(key: string) {
  switch (key) {
    case "collapse":
      return "crimson" as const;
    case "photonic":
      return "indigo" as const;
    case "seeding":
      return "amber" as const;
    case "growth":
      return "emerald" as const;
    default:
      return "primary" as const;
  }
}

function NavLink({
  to,
  label,
  icon: Icon,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: typeof Activity;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(
        "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-[background-color,color] duration-150",
        active ? "bg-elevated text-fg" : "text-fg/75 hover:bg-elevated/60 hover:text-fg",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1.4" />
      <line x1="16" y1="16" x2="16" y2="6" stroke="currentColor" className="text-crimson" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2.2" fill="currentColor" className="text-primary" />
    </svg>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const tau = useKyrexis((s) => s.tau);
  const running = useKyrexis((s) => s.running);
  const setRunning = useKyrexis((s) => s.setRunning);
  const reset = useKyrexis((s) => s.reset);
  const phase = phaseAt(tau);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <TooltipProvider delayDuration={200}>
      <CycleDriver />
      <div className="min-h-dvh bg-bg text-fg">
        <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-3 py-2.5 lg:px-5">
            <Link to="/" className="flex items-center gap-2.5">
              <Mark />
              <div className="leading-tight">
                <div className="font-display text-sm font-semibold tracking-tight">
                  Kyrexis Sovereign
                </div>
                <div className="hidden font-mono text-xs tracking-wider text-muted sm:block">
                  PHOTONIC-Ω HUD
                </div>
              </div>
            </Link>

            <div className="ml-auto flex items-center gap-2">
              <Badge tone={toneFor(phase.key)} className="hidden sm:inline-flex">
                {phase.label}
              </Badge>
              <span className="hidden font-mono text-xs tabular-nums text-muted md:inline">
                τ {tau.toFixed(3)}
              </span>
              <Button
                size="sm"
                onClick={() => {
                  if (tau >= 1) reset();
                  setRunning(!running);
                }}
              >
                {running ? "Pause" : tau >= 1 ? "Run again" : "Run cycle"}
              </Button>
              <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent title="Navigate" side="right">
                  <nav className="flex flex-col gap-1">
                    {ALL_NAV.map((item) => (
                      <NavLink
                        key={item.to}
                        {...item}
                        onNavigate={() => setMoreOpen(false)}
                      />
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <div className="mx-auto flex max-w-7xl">
          <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-52 shrink-0 flex-col border-r border-border bg-surface/40 p-3 lg:flex">
            <nav className="flex flex-col gap-0.5">
              {ALL_NAV.map((item) => (
                <NavLink key={item.to} {...item} />
              ))}
            </nav>
            <p className="mt-auto px-3 pb-2 font-mono text-xs leading-relaxed text-subtle">
              Local-first. No telemetry. Keys stay on-device.
            </p>
          </aside>

          <main className="min-w-0 flex-1 px-3 py-5 pb-24 lg:px-6 lg:pb-8">{children}</main>
        </div>

        <footer className="border-t border-border px-3 py-2.5 lg:px-5">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 font-mono text-[10px] text-muted">
            <span>Evidence: L2 simulation · non-binding</span>
            <span title={buildInfo.commitSha}>
              Build {buildInfo.shortSha} · {buildInfo.buildTime.slice(0, 10)}
            </span>
          </div>
        </footer>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 lg:hidden">
          <ul className="grid grid-cols-5">
            {PRIMARY_NAV.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex h-14 flex-col items-center justify-center gap-0.5 text-xs",
                      active ? "text-primary" : "text-muted",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                className={cn(
                  "flex h-14 w-full flex-col items-center justify-center gap-0.5 text-xs",
                  MORE_NAV.some((n) => pathname.startsWith(n.to))
                    ? "text-primary"
                    : "text-muted",
                )}
              >
                <Menu className="size-4" />
                More
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </TooltipProvider>
  );
}
