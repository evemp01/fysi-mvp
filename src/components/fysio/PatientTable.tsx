import { useNavigate } from "react-router";
import { InitialsAvatar } from "@/components/common/InitialsAvatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { agoText } from "@/lib/dates";
import { initials } from "@/lib/patient";
import { adherence, daysSinceLastSession, frequencyText, painInfo, patientStatus, programWeek } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { useApp } from "@/state/app-context";

/** Stacks into label/value rows on phones. */
const cell = "px-2 py-3 max-sm:flex max-sm:justify-between max-sm:gap-3 max-sm:border-0 max-sm:px-2 max-sm:py-1 max-sm:before:text-[.82rem] max-sm:before:font-bold max-sm:before:text-muted-foreground max-sm:before:content-[attr(data-label)]";

export function PatientTable() {
  const { state } = useApp();
  const navigate = useNavigate();
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4.5 py-4">
        <h3>Mina patienter</h3>
        <span className="text-[.9rem] text-muted-foreground">Klicka på en patient för att öppna</span>
      </div>
      <Table className="text-[.95rem]">
        <TableHeader className="max-sm:hidden">
          <TableRow className="bg-background hover:bg-background">
            {["Patient", "Program", "Pass, 14 dagar", "Smärta", "Senaste pass", "Status"].map((h) => (
              <TableHead key={h} className="px-2 text-[.82rem] font-bold text-muted-foreground">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.order.map((id) => {
            const p = state.patients[id];
            const a = adherence(p),
              pain = painInfo(p),
              [status, tone] = patientStatus(p);
            const open = () => navigate(`/fysio/patients/${id}`);
            return (
              <TableRow key={id} tabIndex={0} role="button" onClick={open} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open())} className="cursor-pointer hover:bg-brand-soft max-sm:grid max-sm:py-2">
                <TableCell data-label="Patient" className={cell}>
                  <span className="flex items-center gap-2.5">
                    <InitialsAvatar>{initials(p)}</InitialsAvatar>
                    <span>
                      <strong>{p.name}</strong>
                      <br />
                      <span className="text-[.9rem] text-muted-foreground">{p.diagnosis}</span>
                    </span>
                  </span>
                </TableCell>
                <TableCell data-label="Program" className={cell}>
                  {p.program.items.length ? (
                    <span>
                      Vecka {programWeek(p)} av {p.weeks}
                      <br />
                      <span className="text-[.9rem] text-muted-foreground">{frequencyText(p.program)}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">–</span>
                  )}
                </TableCell>
                <TableCell data-label="Pass, 14 dagar" className={cell}>
                  {a.pct == null ? (
                    <span className="text-muted-foreground">–</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Progress value={a.pct} className="h-2 w-22.5 bg-border" indicatorClassName={cn(a.pct < 60 ? "bg-danger" : a.pct < 85 ? "bg-warning" : "bg-brand")} />
                      <span className="text-[.9rem] tabular-nums">
                        {a.done}/{a.plan}
                      </span>
                    </span>
                  )}
                </TableCell>
                <TableCell data-label="Smärta" className={cell}>
                  {pain ? (
                    <span>
                      VAS {pain.first.pain} → <strong>{pain.last.pain}</strong> {pain.trend > 0.5 ? <span className="text-danger">↑</span> : pain.trend < -0.5 ? <span className="text-success">↓</span> : null}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">–</span>
                  )}
                </TableCell>
                <TableCell data-label="Senaste pass" className={cell}>
                  {agoText(daysSinceLastSession(p))}
                </TableCell>
                <TableCell data-label="Status" className={cell}>
                  <Badge variant={tone === "brand" ? "default" : tone}>{status}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
