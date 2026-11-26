import { VasBadge } from "@/components/common/VasBadge";
import { PainTypeTag } from "@/components/pain/PainTypeIcon";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Patient } from "@/data/types";
import { formatShort, fromKey } from "@/lib/dates";
import { sessionVolume } from "@/lib/stats";

const cell = "px-2 py-3 max-sm:flex max-sm:justify-between max-sm:gap-3 max-sm:py-1 max-sm:before:text-[.82rem] max-sm:before:font-bold max-sm:before:text-muted-foreground max-sm:before:content-[attr(data-label)]";

export function RecentSessionsTable({ patient }: { patient: Patient }) {
  const logs = patient.logs.slice(-6).reverse();
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4.5 py-4">
        <h3>Senaste pass</h3>
        <span className="text-[.9rem] text-muted-foreground">{patient.logs.length} pass totalt</span>
      </div>
      <Table className="text-[.95rem]">
        <TableHeader className="max-sm:hidden">
          <TableRow className="bg-background hover:bg-background">
            {["Datum", "Mängd", "Smärta", "Upplevt", "Var och hur"].map((h, i) => (
              <TableHead key={h} className={`px-2 text-[.82rem] font-bold text-muted-foreground ${i === 1 || i === 2 ? "text-right" : ""}`}>
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length ? (
            logs.map((l) => (
              <TableRow key={l.id} className="max-sm:grid max-sm:py-2">
                <TableCell data-label="Datum" className={cell}>
                  {formatShort(fromKey(l.date))}
                </TableCell>
                <TableCell data-label="Mängd" className={`${cell} text-right tabular-nums`}>
                  {Math.round(sessionVolume(patient, l) * 100)} %
                </TableCell>
                <TableCell data-label="Smärta" className={`${cell} text-right`}>
                  <VasBadge value={l.pain} />
                </TableCell>
                <TableCell data-label="Upplevt" className={cell}>
                  {l.effort ?? "–"}
                </TableCell>
                <TableCell data-label="Var och hur" className={`${cell} whitespace-normal`}>
                  {l.area.join(", ") || "–"}{" "}
                  {l.type.map((t) => (
                    <PainTypeTag key={t} type={t} size={18} />
                  ))}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">
                Inga pass loggade ännu.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
