import { ChatCircleIcon, PulseIcon, UsersIcon, WarningIcon } from "@phosphor-icons/react";
import { Link } from "react-router";
import { Kpi, KpiGrid } from "@/components/common/Kpi";
import { AttentionList } from "@/components/fysio/AttentionList";
import { PatientTable } from "@/components/fysio/PatientTable";
import { UpcomingVisits } from "@/components/fysio/UpcomingVisits";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttentionItems } from "@/hooks/useAttentionItems";
import { TODAY, capitalize, formatLong } from "@/lib/dates";
import { adherence } from "@/lib/stats";
import { useApp } from "@/state/app-context";

export function OverviewPage() {
  const { state } = useApp();
  const attention = useAttentionItems();
  const patients = state.order.map((id) => state.patients[id]);
  const active = patients.filter((p) => p.program.items.length);
  const avgAdherence = active.length ? Math.round(active.reduce((s, p) => s + (adherence(p).pct ?? 0), 0) / active.length) : 0;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>God morgon, Erik</h1>
          <p className="text-muted-foreground">{capitalize(formatLong(TODAY))}</p>
        </div>
        <Button asChild variant="default">
          <Link to="patients">
            <UsersIcon className="size-4.5" /> Mina patienter
          </Link>
        </Button>
      </div>
      <KpiGrid>
        <Kpi icon={UsersIcon} value={patients.length} label="Aktiva patienter" />
        <Kpi icon={PulseIcon} value={`${avgAdherence} %`} label="Snittföljsamhet, 14 dagar" />
        <Kpi icon={WarningIcon} iconClassName="bg-warning-soft text-warning-foreground" value={attention.length} label="Kräver uppmärksamhet" />
        <Kpi icon={ChatCircleIcon} value={patients.reduce((s, p) => s + p.unread, 0)} label="Olästa meddelanden" />
      </KpiGrid>
      <div className="grid grid-cols-1 gap-4.5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card className="content-start">
          <CardHeader>
            <CardTitle>Kräver uppmärksamhet</CardTitle>
            <CardDescription>Sorterat efter vad som brådskar mest</CardDescription>
          </CardHeader>
          <AttentionList items={attention} />
        </Card>
        <Card className="content-start">
          <CardHeader>
            <CardTitle>Kommande</CardTitle>
          </CardHeader>
          <UpcomingVisits />
        </Card>
      </div>
      <PatientTable />
    </>
  );
}
