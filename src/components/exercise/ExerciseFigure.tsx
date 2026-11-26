import { POSES, PROPS, type Joints } from "@/data/poses";
import { useAnimationPhase } from "@/hooks/useAnimationPhase";
import { cn } from "@/lib/utils";

// Bones as joint pairs. E2/W2 = second arm, K2/A2/T2 = second leg, M = mid-back (for curved spines).
const BONES: [string, string][] = [
  ["P", "K2"],
  ["K2", "A2"],
  ["A2", "T2"],
  ["S", "H"],
  ["P", "K"],
  ["K", "A"],
  ["A", "T"],
  ["S", "E2"],
  ["E2", "W2"],
  ["S", "E"],
  ["E", "W"],
];

function Skeleton({ joints }: { joints: Joints }) {
  const bones: [string, string][] = joints.M ? [["S", "M"], ["M", "P"], ...BONES] : [["S", "P"], ...BONES];
  return (
    <>
      {bones.map(([a, b]) => (joints[a] && joints[b] ? <line key={a + b} x1={joints[a][0]} y1={joints[a][1]} x2={joints[b][0]} y2={joints[b][1]} /> : null))}
      <circle cx={joints.H[0]} cy={joints.H[1]} r={11} />
    </>
  );
}

const interpolate = (a: Joints, b: Joints, t: number): Joints => Object.fromEntries(Object.entries(a).map(([k, [x, y]]) => [k, [x + (b[k][0] - x) * t, y + (b[k][1] - y) * t]]));

interface ExerciseFigureProps {
  pose: string;
  animated?: boolean;
  paused?: boolean;
  slow?: boolean;
  /** White figure for dark backgrounds. */
  inverted?: boolean;
  className?: string;
}

/** Stick figure showing start pose (faded) and moving between start and end. */
export function ExerciseFigure({ pose, animated = false, paused, slow, inverted, className }: ExerciseFigureProps) {
  const p = POSES[pose] ?? POSES.armRaise;
  const t = useAnimationPhase(animated, { paused, speed: slow ? 0.5 : 1 });
  const props = [...(p.prop === "mat" ? [] : PROPS.mat), ...(PROPS[p.prop] ?? [])];
  return (
    <svg viewBox="0 -4 200 150" aria-hidden="true" className={cn("block size-full", className)}>
      <g className="fill-none stroke-muted-foreground opacity-50" strokeWidth={3}>
        {props.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g strokeWidth={7} strokeLinecap="round" className={cn("[&_circle]:stroke-6", inverted ? "stroke-white [&_circle]:fill-hero" : "stroke-brand [&_circle]:fill-brand-soft")}>
        <g className="opacity-20">
          <Skeleton joints={p.a} />
        </g>
        <Skeleton joints={interpolate(p.a, p.b, t)} />
      </g>
    </svg>
  );
}
