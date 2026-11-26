import type { ReactNode } from "react";

/** Hand-drawn symbol per pain quality (viewBox 0 0 40 40). */
const ICONS: Record<string, ReactNode> = {
  Molande: (
    <>
      <circle cx="20" cy="20" r="5" fill="currentColor" stroke="none" />
      <circle cx="20" cy="20" r="11" />
      <circle cx="20" cy="20" r="17" opacity=".45" />
    </>
  ),
  Huggande: <path d="M24 2L10 22h9l-4 16 15-22h-9z" fill="currentColor" stroke="none" />,
  Brännande: <path d="M20 3c2 8 11 11 11 21a11 11 0 0 1-22 0c0-6 3-8 5-12 1 4 3 5 4 6 1-6-1-10 2-15z" fill="currentColor" stroke="none" />,
  Stickande: <path d="M7 7l8 8M20 3v11M33 7l-8 8M7 33l8-8M20 37V26M33 33l-8-8" />,
  Pirrande: (
    <g fill="currentColor" stroke="none">
      {[
        [9, 10],
        [21, 7],
        [32, 12],
        [14, 21],
        [27, 22],
        [8, 31],
        [20, 33],
        [32, 31],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" />
      ))}
    </g>
  ),
  Strålande: (
    <>
      <circle cx="10" cy="20" r="5" fill="currentColor" stroke="none" />
      <path d="M18 20h17M30 15l5 5-5 5M17 13l13-7M17 27l13 7" />
    </>
  ),
  Stelt: (
    <>
      <rect x="7" y="16" width="26" height="8" rx="2" fill="currentColor" stroke="none" />
      <path d="M7 8v24M33 8v24" />
    </>
  ),
  Krampande: <path d="M20 20m-3 0a3 3 0 1 1 6 0a7 7 0 1 1-14 0a11 11 0 1 1 22 0a15 15 0 1 1-30 0" />,
};

export function PainTypeIcon({ type, size = 28 }: { type: string; size?: number }) {
  if (!ICONS[type]) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden="true" className="flex-none text-danger">
      {ICONS[type]}
    </svg>
  );
}

/** Icon + name, as used in lists. */
export function PainTypeTag({ type, size = 20, children }: { type: string; size?: number; children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold">
      <PainTypeIcon type={type} size={size} />
      {type}
      {children}
    </span>
  );
}
