import { Bar, BarChart, Cell, LabelList, XAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { Patient } from "@/data/types";
import { ChartLegendRow } from "./ChartLegendRow";
import { logsBetween, programWeek, weekPlan, weekRange } from "@/lib/stats";

const config = { sessions: { label: "Pass", color: "var(--brand)" } } satisfies ChartConfig;

/** Sessions per program week against the plan. Amber when a finished week fell short. */
export function WeekGoalChart({ patient }: { patient: Patient }) {
  if (!patient.since) return null;
  const current = programWeek(patient);
  const data = Array.from({ length: Math.min(patient.weeks, 8) }, (_, i) => {
    const week = i + 1;
    const { from, to } = weekRange(patient, week);
    const sessions = logsBetween(patient, from, to).length;
    const plan = weekPlan(patient, week);
    const started = week <= current;
    return { week: `v${week}`, sessions: started ? Math.min(sessions, plan) : 0, label: started ? `${sessions}/${plan}` : "", plan, short: started && week < current && sessions < plan };
  });

  return (
    <>
      <ChartContainer config={config} className="mt-2.5 aspect-auto h-37.5 w-full">
        <BarChart data={data} barSize={28} barGap={-28} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="week" tickLine={false} axisLine={false} />
          <Bar dataKey="plan" fill="var(--border)" fillOpacity={0.5} radius={6} isAnimationActive={false} />
          <Bar dataKey="sessions" radius={6} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={d.week} fill={d.short ? "var(--warning)" : "var(--color-sessions)"} />
            ))}
            <LabelList dataKey="label" position="top" className="fill-muted-foreground text-[12px] font-bold" />
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChartLegendRow
        items={[
          ["var(--brand)", "Mål nått / pågår"],
          ["var(--warning)", "Färre pass än planerat"],
        ]}
      />
    </>
  );
}
