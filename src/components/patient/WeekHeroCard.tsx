import { CheckIcon } from "@phosphor-icons/react";
import { Progress } from "@/components/ui/progress";
import type { Patient } from "@/data/types";
import { TODAY_KEY, formatShort } from "@/lib/dates";
import { isDaily, logsOn, programEnd, programWeek, sessionsThisWeek } from "@/lib/stats";
import { cn } from "@/lib/utils";

function Dots({ total, done }: { total: number; done: number }) {
  return (
    <div className="flex flex-wrap gap-2" aria-hidden="true">
      {Array.from({ length: Math.max(total, done) }, (_, i) => (
        <i
          key={i}
          className={cn(
            "grid size-8.5 place-items-center rounded-full border-2 border-white/45 text-[.85rem] font-extrabold not-italic",
            i < done && "border-white bg-white text-hero",
          )}>
          {i < done ? <CheckIcon className="size-4.5" weight="bold" /> : i + 1}
        </i>
      ))}
    </div>
  );
}

/** "This week: 2 of 5 sessions" card at the top of the patient's day. */
export function WeekHeroCard({ patient }: { patient: Patient }) {
  const daily = isDaily(patient.program);
  const perDay = patient.program.perDay || 1;
  const today = logsOn(patient, TODAY_KEY).length;
  const total = patient.program.perWeek;
  const done = sessionsThisWeek(patient);
  const left = Math.max(0, total - done);
  const end = programEnd(patient);

  return (
    <div className="grid gap-2.5 rounded-[22px] bg-hero px-4.5 pt-4.5 pb-4 text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="opacity-85">{daily ? "I dag" : "Den här veckan"}</span>
        <span className="rounded-full bg-warning px-2.5 py-0.75 text-[.82rem] font-extrabold whitespace-nowrap text-[#2a1a00]">
          Vecka {programWeek(patient)} av {patient.weeks}
        </span>
      </div>
      <div>
        <span className="text-[2.4rem] leading-none font-extrabold tracking-[-0.03em]">{daily ? `${today} av ${perDay}` : `${done} av ${total}`}</span> <span className="opacity-85">{daily ? "pass i dag" : "pass klara"}</span>
      </div>
      <Progress value={Math.min(100, (daily ? today / perDay : done / total) * 100)} className="h-2 bg-white/20" indicatorClassName="bg-warning" />
      {daily ? <Dots total={perDay} done={today} /> : <Dots total={total} done={done} />}
      <span className="text-[.9rem] opacity-90">
        {daily ? (
          <>
            {today >= perDay ? "Dagens pass är gjorda. Bra jobbat!" : `${perDay - today === 1 ? "Ett pass" : `${perDay - today} pass`} kvar i dag, gärna med några timmars mellanrum.`} Den här veckan: {done} av {7 * perDay}.
          </>
        ) : (
          <>
            {left ? `${left === 1 ? "Ett pass" : `${left} pass`} kvar. Välj själv vilka dagar men kom ihåg att låta kroppen återhämta sig.` : "Veckans mål är nått. Snyggt jobbat!"}
            {end && ` Programmet slutar ${formatShort(end)}.`}
          </>
        )}
      </span>
    </div>
  );
}
