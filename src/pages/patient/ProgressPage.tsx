import { Activity, Check, Info, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChartLegendRow } from "@/components/charts/ChartLegendRow";
import { WeeklyProgressChart } from "@/components/charts/WeeklyProgressChart";
import { Kpi, KpiGrid } from "@/components/common/Kpi";
import { Alert } from "@/components/ui/alert";
import { DayCircles } from "@/components/patient/DayCircles";
import { WeekCircles } from "@/components/patient/WeekCircles";
import { WeekSummaryDialog } from "@/components/patient/WeekSummaryDialog";
import { ExerciseProgressList } from "@/components/progress/ExerciseProgressList";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from "@/components/ui/empty";
import { formatShort, fromKey } from "@/lib/dates";
import { adherence, painInfo, programEnd, programWeek, sessionsThisWeek } from "@/lib/stats";
import { usePatient } from "@/state/app-context";

export function ProgressPage() {
  const patient = usePatient(useParams().patientId);
  const navigate = useNavigate();
  const [week, setWeek] = useState<number | null>(null);

  if (!patient.program.items.length)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TrendingUp />
          </EmptyMedia>
          <EmptyDescription>Här ser du din träning och smärta när du har kommit igång.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  const pain = painInfo(patient);
  const end = programEnd(patient);
  const weeksLeft = patient.weeks - programWeek(patient);
  const painMessage = !pain
    ? null
    : pain.last.pain > patient.painLimit
      ? `Smärtan ligger över din gräns på ${patient.painLimit}/10. Ta det lugnare och skriv till Erik om det håller i sig.`
      : pain.trend > 0.5
        ? "Smärtan har ökat lite de senaste passen. Håll koll, och skriv till Erik om den fortsätter öka."
        : pain.trend < -0.5
          ? "Smärtan minskar. Det går åt rätt håll!"
          : "Smärtan är ganska stabil.";

  return (
    <>
      <Card className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2>
            Vecka {programWeek(patient)} av {patient.weeks}
          </h2>
          <span className="text-[.9rem] font-bold text-brand">{weeksLeft > 0 ? `${weeksLeft} ${weeksLeft === 1 ? "vecka" : "veckor"} kvar` : "Sista veckan"}</span>
        </div>
        <WeekCircles patient={patient} onWeek={setWeek} />
        {patient.since && (
          <div className="flex justify-between text-[.9rem] text-muted-foreground">
            <span>Start {formatShort(fromKey(patient.since))}</span>
            <span>Mål {end && formatShort(end)}</span>
          </div>
        )}
      </Card>

      <Card className="grid gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3>Den här veckan</h3>
          <span className="text-[.9rem] font-bold text-brand">
            {sessionsThisWeek(patient)} av {patient.program.perWeek} pass
          </span>
        </div>
        <DayCircles patient={patient} />
      </Card>

      <KpiGrid twoColumns>
        <Kpi compact icon={<Activity />} value={`${adherence(patient, 28).pct ?? "–"} %`} label="Följsamhet, 4 veckor" />
        <Kpi compact icon={<Check />} value={patient.logs.length} label="Loggade pass" />
      </KpiGrid>

      <Card>
        <CardHeader className="mb-0">
          <CardTitle>Din utveckling</CardTitle>
          <CardDescription>Staplarna visar dina pass, linjen hur ont du har haft i snitt.</CardDescription>
          <CardAction className="text-[.9rem] text-muted-foreground">Per vecka</CardAction>
        </CardHeader>
        <WeeklyProgressChart patient={patient} />
        <ChartLegendRow
          items={[
            ["var(--brand)", "Pass"],
            ["var(--danger)", "Smärta, snitt"],
            ["var(--warning)", `Din smärtgräns ${patient.painLimit}`],
          ]}
        />
        {painMessage && (
          <Alert variant="info" className="mt-2 text-[.9rem]">
            <Info />
            {painMessage}
          </Alert>
        )}
      </Card>

      <Card>
        <CardHeader className="mb-1">
          <CardTitle>Per övning</CardTitle>
          <CardDescription>Senaste 14 dagarna</CardDescription>
        </CardHeader>
        <ExerciseProgressList patient={patient} />
      </Card>

      {week != null && <WeekSummaryDialog patient={patient} week={week} onClose={() => setWeek(null)} onToday={() => navigate("..", { relative: "path" })} />}
    </>
  );
}
