import { Fragment } from "react";
import type { Patient } from "@/data/types";
import { TODAY, addDays, formatShort, fromKey, toKey } from "@/lib/dates";
import { BodyHeatmap } from "./BodyFigure";
import { PainTypeTag } from "./PainTypeIcon";

/** Where and how the patient has described pain in the last n days (logs + messages). */
export function PainMap({ patient, days = 14 }: { patient: Patient; days?: number }) {
  const from = toKey(addDays(TODAY, -days));
  const reports = [
    ...patient.logs.filter((l) => l.date >= from && l.pain).map((l) => ({ date: l.date, pain: l.pain ?? 0, area: l.area, type: l.type, inMessage: false })),
    ...patient.messages.filter((m) => m.pain && m.time >= fromKey(from).getTime()).map((m) => ({ date: toKey(new Date(m.time)), pain: m.pain!.pain, area: m.pain!.area, type: m.pain!.type, inMessage: true })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  if (!reports.length) return <p className="text-muted-foreground">Ingen smärta beskriven de senaste {days} dagarna.</p>;

  const count = (list: string[]) => Object.entries(list.reduce<Record<string, number>>((acc, x) => ((acc[x] = (acc[x] ?? 0) + 1), acc), {})).sort((a, b) => b[1] - a[1]);
  const areas = count(reports.flatMap((r) => r.area));
  const types = count(reports.flatMap((r) => r.type));
  const last = reports[0];

  return (
    <div className="grid gap-3">
      <div className="flex justify-center gap-1">
        <BodyHeatmap view="fram" counts={Object.fromEntries(areas)} width={120} />
        <BodyHeatmap view="bak" counts={Object.fromEntries(areas)} width={120} />
      </div>
      <div className="grid gap-2.5">
        <div>
          <span className="text-[.9rem] text-muted-foreground">Vanligaste ställen</span>
          <p>
            {areas.map(([a, c], i) => (
              <Fragment key={a}>
                {i > 0 && <br />}
                <strong>{a}</strong> <span className="text-[.9rem] text-muted-foreground">{c} ggr</span>
              </Fragment>
            ))}
          </p>
        </div>
        <div>
          <span className="text-[.9rem] text-muted-foreground">Så beskrivs smärtan</span>
          <div className="mt-1 grid gap-1">
            {types.map(([t, c]) => (
              <PainTypeTag key={t} type={t} size={22}>
                <span className="text-[.9rem] text-muted-foreground">{c} ggr</span>
              </PainTypeTag>
            ))}
          </div>
        </div>
        <p className="text-[.9rem]">
          Senast {formatShort(fromKey(last.date))}
          {last.inMessage && " (i meddelande)"}: VAS {last.pain}
          {last.area.length > 0 && `, ${last.area.join(", ")}`}
          {last.type.length > 0 && `, ${last.type.join(", ").toLowerCase()}`}.
        </p>
      </div>
    </div>
  );
}
