import { ChatCircleIcon, PulseIcon, UsersIcon, WarningIcon } from "@phosphor-icons/react";
import { Kpi, KpiGrid } from "@/components/common/Kpi";
import { AttentionList } from "@/components/fysio/AttentionList";
import { PatientTable } from "@/components/fysio/PatientTable";
import { UpcomingVisits } from "@/components/fysio/UpcomingVisits";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttentionItems } from "@/hooks/useAttentionItems";
import { weekAdherence } from "@/lib/stats";
import { useApp } from "@/state/app-context";

export function OverviewPage() {
  const { state } = useApp();
  const attention = useAttentionItems();
  const patients = state.order.map((id) => state.patients[id]);
  // Only patients with at least one finished week have a percentage.
  const pcts = patients.map((p) => weekAdherence(p).pct).filter((x): x is number => x != null);
  const avgAdherence = pcts.length ? Math.round(pcts.reduce((s, x) => s + x, 0) / pcts.length) : null;

  return (
    <>
      {/* The greeting and the "Mina patienter" shortcut live in FysioHeader. */}
      <h1 className="sr-only">Översikt</h1>
      <KpiGrid>
        <Kpi icon={UsersIcon} value={patients.length} label="Aktiva patienter" />
        <Kpi icon={PulseIcon} value={`${avgAdherence ?? "–"} %`} label="Snittföljsamhet, avslutade veckor" />
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
