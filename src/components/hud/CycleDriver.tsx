import { useEffect } from "react";
import { useKyrexis } from "@/lib/photonic/store";

export function CycleDriver() {
  const running = useKyrexis((s) => s.running);
  const tick = useKyrexis((s) => s.tick);
  const hydrate = useKyrexis((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!running) return;
    let id = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      tick(dt);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [running, tick]);

  return null;
}
