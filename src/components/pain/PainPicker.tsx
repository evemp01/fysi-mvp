import { XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/common/Chip";
import { PAIN_TYPES, type BodyView } from "@/data/body";
import { startZoom, type ZoomState } from "@/lib/body";
import { cn } from "@/lib/utils";
import { BodyPicker } from "./BodyFigure";
import { BodyZoom } from "./BodyZoom";
import { PainTypeIcon } from "./PainTypeIcon";

interface PainPickerProps {
  area: string[];
  type: string[];
  onChange: (value: { area: string[]; type: string[] }) => void;
}

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/** Where it hurts (body map with zoom) and how it feels. */
export function PainPicker({ area, type, onChange }: PainPickerProps) {
  const [view, setView] = useState<BodyView>("fram");
  const [zoom, setZoom] = useState<ZoomState | null>(null);
  const toggleArea = (name: string) => onChange({ area: toggle(area, name), type });

  return (
    <div className="mt-2.5 grid gap-3">
      <div>
        <h4>Var gör det ont?</h4>
        <p className="text-[.9rem] text-muted-foreground">{zoom ? "Tryck på de ställen där det gör ont. Du kan välja flera." : "Tryck på en kroppsdel för att zooma in och visa exakt var det gör ont."}</p>
      </div>

      {zoom ? (
        <BodyZoom
          zoom={zoom}
          selected={area}
          onToggle={toggleArea}
          onChangeZoom={(z) => {
            setZoom(z);
            if (z) setView(z.view);
          }}
        />
      ) : (
        <>
          <div className="flex gap-1.5">
            <Chip selected={view === "fram"} onSelect={() => setView("fram")}>
              Framsida
            </Chip>
            <Chip selected={view === "bak"} onSelect={() => setView("bak")}>
              Baksida
            </Chip>
          </div>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3.5">
            <BodyPicker
              view={view}
              selected={area}
              onRegion={(name) => {
                const z = startZoom(name, view);
                if (z) setZoom(z);
                else toggleArea(name);
              }}
            />
            <span className="text-[.9rem] text-muted-foreground">{view === "fram" ? "Du ser kroppen framifrån, som en annan person ser dig." : "Du ser kroppen bakifrån. Byt hit för rygg, säte, vad och häl."}</span>
          </div>
        </>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[.9rem] text-muted-foreground">Valt:</span>
        {area.length ? (
          area.map((a) => (
            <Button key={a} variant="ghost" size="chip-sm" className="min-h-8.5 rounded-full border-0 bg-danger-soft px-2.5 text-[.82rem] text-[light-dark(#9e3226,#ff9d8d)] hover:bg-danger-soft/80" aria-label={`Ta bort ${a}`} onClick={() => toggleArea(a)}>
              {a}
              <XIcon className="size-3.5" />
            </Button>
          ))
        ) : (
          <span className="text-[.9rem]">Inget valt än</span>
        )}
      </div>

      <div>
        <h4>Hur känns det?</h4>
        <p className="text-[.9rem] text-muted-foreground">Välj det eller de som stämmer bäst.</p>
        <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(min(100%,180px),1fr))] gap-2">
          {PAIN_TYPES.map(({ name, description }) => {
            const on = type.includes(name);
            return (
              <Button
                key={name}
                variant="outline"
                aria-pressed={on}
                onClick={() => onChange({ area, type: toggle(type, name) })}
                className={cn("grid min-h-15 grid-cols-[auto_minmax(0,1fr)] justify-start gap-2.5 rounded-[14px] px-3 py-2.5 text-left whitespace-normal", on && "border-danger bg-danger-soft hover:bg-danger-soft")}>
                <PainTypeIcon type={name} size={34} />
                <span>
                  <strong>{name}</strong>
                  <small className="block text-[.85rem] leading-[1.3] font-medium text-muted-foreground">{description}</small>
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
