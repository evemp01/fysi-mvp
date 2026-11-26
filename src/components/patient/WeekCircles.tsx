import { Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/data/types";
import { logsBetween, programWeek, weekPlan, weekRange } from "@/lib/stats";
import { cn } from "@/lib/utils";

const circle = "relative grid size-[38px] place-items-center rounded-full border-[1.5px] bg-background font-extrabold text-muted-foreground not-italic [&_svg]:size-[18px]";
const label = "grid justify-items-center gap-1 text-[.82rem] font-bold text-muted-foreground";

/** One circle per program week; past weeks open a summary. */
export function WeekCircles({ patient, onWeek }: { patient: Patient; onWeek: (week: number) => void }) {
  if (!patient.since) return null;
  const current = programWeek(patient);
  return (
    <>
      <div className="flex flex-wrap gap-2.5">
        {Array.from({ length: patient.weeks }, (_, i) => {
          const w = i + 1;
          if (w > current)
            return (
              <div key={w} className={label}>
                <i className={circle} aria-hidden="true" />
                <span>v{w}</span>
              </div>
            );
          const { from, to } = weekRange(patient, w);
          const done = logsBetween(patient, from, to).length;
          const plan = weekPlan(patient, w);
          const full = done >= plan;
          const pct = Math.min(100, Math.round((done / plan) * 100));
          return (
            <Button key={w} variant="ghost" className={cn(label, "h-auto min-h-0 p-0 hover:bg-transparent [&:hover_i]:scale-106")} aria-label={`Vecka ${w}: ${done} av ${plan} pass. Visa sammanställning.`} onClick={() => onWeek(w)}>
              {full ? (
                <i className={cn(circle, "border-success bg-success text-white")}>
                  <Check strokeWidth={3} />
                </i>
              ) : (
                <i
                  className={cn(circle, "border-0 after:absolute after:inset-1.25 after:rounded-full after:bg-card", w === current && "shadow-[0_0_0_2px_var(--brand)]")}
                  style={{ background: `conic-gradient(var(--brand) ${pct}%, var(--brand-muted) 0)` }}
                />
              )}
              <span>v{w}</span>
            </Button>
          );
        })}
        <div className={label}>
          <i className={circle}>
            <Calendar />
          </i>
          Besök
        </div>
      </div>
      <p className="text-[.9rem] text-muted-foreground">Tryck på en vecka för att se vad du gjorde.</p>
    </>
  );
}
