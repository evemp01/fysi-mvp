import { CheckIcon } from "@phosphor-icons/react";
import type { Patient } from "@/data/types";
import { DAYS, TODAY, TODAY_KEY, addDays, toKey, weekStart } from "@/lib/dates";
import { sessionVolume } from "@/lib/stats";
import { cn } from "@/lib/utils";

/** Mon–Sun of the current week: full, partial or today. */
export function DayCircles({ patient }: { patient: Patient }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {DAYS.map((day, i) => {
        const key = toKey(addDays(weekStart(TODAY), i));
        const log = patient.logs.find((l) => l.date === key);
        const full = log && sessionVolume(patient, log) >= 0.9;
        return (
          <div key={day} className="grid justify-items-center gap-1 text-[.82rem] font-bold text-muted-foreground">
            <i
              className={cn(
                "grid size-9.5 place-items-center rounded-full border-[1.5px] bg-background not-italic",
                log && (full ? "border-success bg-success text-white" : "border-warning bg-warning text-[#2a1a00]"),
                !log && key === TODAY_KEY && "border-2 border-brand text-brand",
              )}>
              {log && <CheckIcon className="size-4.5" weight="bold" />}
            </i>
            {day}
          </div>
        );
      })}
    </div>
  );
}
