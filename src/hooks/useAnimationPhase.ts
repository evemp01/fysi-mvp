import { useEffect, useRef, useState } from "react";

const CYCLE_MS = 3600;
const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);

/**
 * 0 → 1 → 0 loop for the exercise figures: move (40%), hold (10%), return (40%), rest (10%).
 * Returns 1 (end pose) when not animated or when the user prefers reduced motion.
 */
export function useAnimationPhase(animated: boolean, { paused = false, speed = 1 } = {}) {
  const [phase, setPhase] = useState(0);
  const elapsed = useRef(0);
  const enabled = animated && !prefersReducedMotion();

  useEffect(() => {
    if (!enabled || paused) return;
    let frame = 0,
      last = 0;
    const tick = (ms: number) => {
      elapsed.current += last ? Math.min(100, ms - last) * speed : 0;
      last = ms;
      const p = (elapsed.current % CYCLE_MS) / CYCLE_MS;
      setPhase(p < 0.4 ? ease(p / 0.4) : p < 0.5 ? 1 : p < 0.9 ? 1 - ease((p - 0.5) / 0.4) : 0);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, paused, speed]);

  return enabled ? phase : 1;
}
