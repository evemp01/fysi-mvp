import { Check, Info } from "lucide-react";
import { Fragment } from "react";
import { Kpi, KpiGrid } from "@/components/common/Kpi";
import { Alert } from "@/components/ui/alert";
import { SheetDialog } from "@/components/common/Sheet";
import { VasBadge } from "@/components/common/VasBadge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription } from "@/components/ui/empty";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "@/components/ui/item";
import type { Patient } from "@/data/types";
import { capitalize, formatLong, formatShort, fromKey } from "@/lib/dates";
import { logsBetween, programWeek, sessionVolume, weekPlan, weekRange } from "@/lib/stats";
import { useExercises } from "@/state/app-context";

interface Props {
  patient: Patient;
  week: number;
  onClose: () => void;
  onToday: () => void;
}

/** What the patient did in one program week. */
export function WeekSummaryDialog({ patient, week, onClose, onToday }: Props) {
  const { getExercise } = useExercises();
  const { from, to } = weekRange(patient, week);
  const logs = logsBetween(patient, from, to).sort((a, b) => (a.date < b.date ? -1 : 1));
  const plan = weekPlan(patient, week);
  const withPain = logs.filter((l) => l.pain != null);
  const current = week === programWeek(patient);
  const summary = logs.length >= plan ? `Du gjorde alla ${plan} pass. Snyggt!` : current ? `${logs.length} av ${plan} pass hittills. Veckan är inte slut än.` : `Du gjorde ${logs.length} av ${plan} pass. Det är helt okej, varje pass räknas.`;

  return (
    <SheetDialog open onClose={onClose} title={`Vecka ${week}`}>
      <p className="-mt-1.5 text-muted-foreground">
        {formatShort(from)} – {formatShort(to)}
      </p>
      <KpiGrid twoColumns>
        <Kpi value={`${logs.length} av ${plan}`} label="pass" />
        <Kpi value={withPain.length ? (withPain.reduce((x, l) => x + (l.pain ?? 0), 0) / withPain.length).toFixed(1).replace(".", ",") : "–"} label="smärta i snitt" />
      </KpiGrid>
      <Alert variant={logs.length >= plan ? "success" : "info"}>
        {logs.length >= plan ? <Check /> : <Info />}
        {summary}
      </Alert>
      {logs.length ? (
        <ItemGroup className="gap-0 rounded-[18px] border bg-card p-1">
          {logs.map((l, i) => {
            const sameDay = logs.filter((x) => x.date === l.date);
            const done = patient.program.items.filter((it) => (l.items[it.exerciseId]?.sets.length ?? 0) > 0).length;
            return (
              <Fragment key={l.id}>
                {i > 0 && <ItemSeparator className="my-0" />}
                <Item role="listitem">
                  <ItemContent>
                    <ItemTitle>
                      {capitalize(formatLong(fromKey(l.date)))}
                      {sameDay.length > 1 && ` · pass ${sameDay.indexOf(l) + 1}`}
                    </ItemTitle>
                    <ItemDescription>
                      {done} av {patient.program.items.length} övningar · {Math.round(sessionVolume(patient, l) * 100)} % av planerat
                      {l.effort && ` · kändes ${l.effort.toLowerCase()}`}
                    </ItemDescription>
                    {Object.entries(l.items)
                      .filter(([, r]) => r.flag)
                      .map(([id, r]) => (
                        <span key={id} className="text-[.9rem] font-semibold text-warning-foreground">
                          {getExercise(id)?.name ?? id}: {r.flag}
                          {r.comment && ` – ${r.comment}`}
                        </span>
                      ))}
                    {l.note && <span className="text-[.9rem]">”{l.note}”</span>}
                  </ItemContent>
                  <ItemActions className="self-start">{l.pain != null ? <VasBadge value={l.pain} label="Smärta " /> : <span className="text-[.9rem] text-muted-foreground">Ingen smärta</span>}</ItemActions>
                </Item>
              </Fragment>
            );
          })}
        </ItemGroup>
      ) : (
        <Empty className="p-5">
          <EmptyDescription>Inga pass loggade den här veckan.</EmptyDescription>
        </Empty>
      )}
      {current ? (
        <Button variant="default" className="w-full" onClick={onToday}>
          Till dagens övningar
        </Button>
      ) : (
        <Button className="w-full" onClick={onClose}>
          Stäng
        </Button>
      )}
    </SheetDialog>
  );
}
