import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/common/Chip";
import { ZOOM_GROUPS } from "@/data/body";
import { capitalize } from "@/lib/dates";
import { onKeyActivate } from "@/lib/a11y";
import { zonesFor, zoomBox, type ZoomState } from "@/lib/body";
import { cn } from "@/lib/utils";
import { BodySilhouette } from "./BodySilhouette";

interface BodyZoomProps {
  zoom: ZoomState;
  selected: string[];
  onToggle: (zone: string) => void;
  onChangeZoom: (zoom: ZoomState | null) => void;
}

/** Close-up of one body part with numbered zones. */
export function BodyZoom({ zoom, selected, onToggle, onChangeZoom }: BodyZoomProps) {
  const group = ZOOM_GROUPS[zoom.group];
  const view = group[zoom.view] ? zoom.view : group.fram ? "fram" : "bak";
  const zones = zonesFor(zoom.group, zoom.side, view);
  const box = zoomBox(zoom.group, zoom.side, view);
  const title = group.mid ? group.title : `${zoom.side} ${group.title}`;
  const outside = view === "fram" ? (zoom.side === "Höger" ? "vänster" : "höger") : zoom.side === "Höger" ? "höger" : "vänster";
  const label = (name: string) => capitalize(group.mid ? name : name.slice((zoom.side?.length ?? 0) + 1));

  return (
    <div className="grid gap-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="link" size="inline" className="pl-0" onClick={() => onChangeZoom(null)}>
          <ArrowLeftIcon className="size-4.5" /> Hela kroppen
        </Button>
        {group.fram && group.bak && (
          <div className="flex gap-1">
            <Chip size="md" selected={view === "fram"} onSelect={() => onChangeZoom({ ...zoom, view: "fram" })}>
              Framsida
            </Chip>
            <Chip size="md" selected={view === "bak"} onSelect={() => onChangeZoom({ ...zoom, view: "bak" })}>
              Baksida
            </Chip>
          </div>
        )}
      </div>
      <h4>
        {capitalize(title)}, {view === "fram" ? "framifrån" : "bakifrån"}
      </h4>
      {!group.mid && <p className="text-[.9rem] text-muted-foreground">Utsidan är åt {outside} på bilden.</p>}
      <div className="grid gap-3">
        <svg viewBox={box.join(" ")} role="group" aria-label="Förstorad bild" className="h-[min(360px,55vh)] w-auto max-w-full justify-self-center rounded-[14px] bg-brand-soft">
          <BodySilhouette view={view} />
          {zones.map((z, i) => {
            const on = selected.includes(z.name);
            return (
              <g key={z.name} role="button" tabIndex={0} aria-pressed={on} aria-label={z.name} onClick={() => onToggle(z.name)} onKeyDown={onKeyActivate(() => onToggle(z.name))} className="group/zone cursor-pointer outline-none">
                <ellipse cx={z.x} cy={z.y} rx={z.rx} ry={z.ry} vectorEffect="non-scaling-stroke" strokeWidth={2} className={cn("stroke-danger group-focus-visible/zone:stroke-4", on ? "fill-danger" : "fill-card/90")} />
                <text x={z.x} y={z.y} fontSize={box[2] / 12} textAnchor="middle" dominantBaseline="central" className={cn("pointer-events-none font-extrabold", on ? "fill-white" : "fill-danger")}>
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,190px),1fr))] gap-1.5">
          {zones.map((z, i) => {
            const on = selected.includes(z.name);
            return (
              <Button key={z.name} variant="outline" aria-pressed={on} onClick={() => onToggle(z.name)} className={cn("min-h-11 justify-start gap-2 px-2.5 py-1.5 text-left font-semibold", on && "border-danger bg-danger-soft hover:bg-danger-soft")}>
                <b className={cn("grid size-6 flex-none place-items-center rounded-full text-[.8rem]", on ? "bg-danger text-white" : "bg-danger-soft text-danger")}>{i + 1}</b>
                {label(z.name)}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
