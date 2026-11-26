import { REGIONS, ZOOM_GROUPS, type BodyView } from "@/data/body";
import { onKeyActivate } from "@/lib/a11y";
import { ZONE_INDEX, groupOf, sideOf } from "@/lib/body";
import { BodySilhouette } from "./BodySilhouette";

interface InteractiveProps {
  view: BodyView;
  selected: string[];
  /** Region tapped; parent decides whether to zoom or select. */
  onRegion: (name: string) => void;
  width?: number;
}

/** Full body with tappable regions. Selected fine zones are shown as dots. */
export function BodyPicker({ view, selected, onRegion, width = 170 }: InteractiveProps) {
  const fine = selected.map((a) => ZONE_INDEX[a]).filter(Boolean);
  return (
    <svg viewBox="0 0 160 300" width={width} role="group" aria-label={view === "fram" ? "Kroppen framifrån" : "Kroppen bakifrån"} className="h-auto max-w-full flex-none">
      <BodySilhouette view={view} />
      <SideLabels view={view} />
      {REGIONS[view].map(([name, cx, cy, rx, ry]) => {
        const group = groupOf(name),
          side = sideOf(name);
        const on = selected.includes(name) || fine.some((z) => z.group === group && (z.side === side || ZOOM_GROUPS[group].mid));
        return (
          <g
            key={name}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={(group ? "Zooma in på " : "") + name}
            onClick={() => onRegion(name)}
            onKeyDown={onKeyActivate(() => onRegion(name))}
            className="group/region cursor-pointer outline-none">
            <ellipse cx={cx} cy={cy} rx={Math.max(rx, 13)} ry={Math.max(ry, 13)} fill="transparent" />
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              strokeWidth={2}
              className={on ? "fill-danger stroke-danger" : "fill-transparent stroke-danger [stroke-dasharray:3_3] group-hover/region:fill-danger-soft group-focus-visible/region:stroke-4 group-focus-visible/region:[stroke-dasharray:none]"}
            />
            <title>{name}</title>
          </g>
        );
      })}
      {fine
        .filter((z) => z.view === view)
        .map((z) => (
          <ellipse key={z.name} cx={z.x} cy={z.y} rx={Math.max(2.5, z.rx * 0.8)} ry={Math.max(2.5, z.ry * 0.8)} className="pointer-events-none fill-danger stroke-card" strokeWidth={1} />
        ))}
    </svg>
  );
}

/** Read-only body with pain areas shaded by how often they occur. */
export function BodyHeatmap({ view, counts, width = 150 }: { view: BodyView; counts: Record<string, number>; width?: number }) {
  const max = Math.max(1, ...Object.values(counts));
  return (
    <svg viewBox="0 0 160 300" width={width} role="img" aria-label={view === "fram" ? "Kroppen framifrån" : "Kroppen bakifrån"} className="h-auto max-w-full flex-none">
      <BodySilhouette view={view} />
      <SideLabels view={view} />
      {Object.entries(counts).map(([name, count]) => {
        const opacity = 0.3 + (0.7 * count) / max;
        const region = REGIONS[view].find((r) => r[0] === name);
        const zone = ZONE_INDEX[name];
        const shape = region ? { cx: region[1], cy: region[2], rx: region[3] + 2, ry: region[4] + 2 } : zone?.view === view ? { cx: zone.x, cy: zone.y, rx: zone.rx + 1.5, ry: zone.ry + 1.5 } : null;
        return shape ? (
          <ellipse key={name} {...shape} className="fill-danger" opacity={opacity}>
            <title>{`${name}: ${count}`}</title>
          </ellipse>
        ) : null;
      })}
    </svg>
  );
}

function SideLabels({ view }: { view: BodyView }) {
  return (
    <g className="fill-muted-foreground text-[14px] font-extrabold">
      <text x="10" y="16">
        {view === "fram" ? "H" : "V"}
      </text>
      <text x="150" y="16" textAnchor="end">
        {view === "fram" ? "V" : "H"}
      </text>
    </g>
  );
}
