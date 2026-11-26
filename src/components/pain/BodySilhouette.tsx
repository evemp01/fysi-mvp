import type { BodyView } from "@/data/body";

/** Soft body outline, front or back (viewBox 0 0 160 300). */
export function BodySilhouette({ view }: { view: BodyView }) {
  const footX = view === "fram" ? [57, 103] : [60, 100];
  return (
    <g className="fill-brand-muted stroke-brand-muted">
      <g stroke="none">
        <ellipse cx="80" cy="22" rx="15" ry="18" />
        <rect x="72" y="36" width="16" height="18" rx="5" />
        <path d="M50 60Q80 50 110 60L114 100Q108 128 112 154L48 154Q52 128 46 100Z" />
        <ellipse cx="37" cy="164" rx="6" ry="9" />
        <ellipse cx="123" cy="164" rx="6" ry="9" />
        <ellipse cx={footX[0]} cy="291" rx="11" ry="6" />
        <ellipse cx={footX[1]} cy="291" rx="11" ry="6" />
      </g>
      <g fill="none" strokeLinecap="round">
        <path d="M54 62L42 110L37 156M106 62L118 110L123 156" strokeWidth="15" />
        <path d="M66 150L64 216L62 280M94 150L96 216L98 280" strokeWidth="22" />
      </g>
      {view === "bak" && <path d="M80 58V150" className="stroke-border" strokeWidth="2" strokeDasharray="4 4" fill="none" />}
    </g>
  );
}
