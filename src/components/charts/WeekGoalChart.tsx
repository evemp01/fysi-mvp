import { Bar, BarChart, Cell, LabelList, XAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { Patient } from "@/data/types";
import { ChartLegendRow } from "./ChartLegendRow";
import { logsBetween, programWeek, weekPlan, weekRange } from "@/lib/stats";

const config = { sessions: { label: "Pass", color: "var(--primary)" } } satisfies ChartConfig;
const CURRENT = "var(--sky)";

interface Row {
  week: string;
  sessions: number;
  label: string;
  plan: number;
  short: boolean;
  current: boolean;
}

/** Week name under the bar; the current week in bold blue. */
function WeekTick({ x = 0, y = 0, payload, current }: { x?: number; y?: number; payload?: { value: string }; current: string }) {
  const now = payload?.value === current;
  return (
    <text x={x} y={y + 12} textAnchor="middle" className={now ? "fill-sky text-[13px] font-extrabold" : "fill-muted-foreground text-[12px]"}>
      {payload?.value}
    </text>
  );
}

/** Sessions per program week against the plan. Amber when a finished week fell short, light blue for the week in progress. */
export function WeekGoalChart({ patient }: { patient: Patient }) {
  if (!patient.since) return null;
  const current = programWeek(patient);
  const data: Row[] = Array.from({ length: Math.min(patient.weeks, 8) }, (_, i) => {
    const week = i + 1;
    const { from, to } = weekRange(patient, week);
    const sessions = logsBetween(patient, from, to).length;
    const plan = weekPlan(patient, week);
    const started = week <= current;
    return { week: `v${week}`, sessions: started ? Math.min(sessions, plan) : 0, label: started ? `${sessions}/${plan}` : "", plan, short: started && week < current && sessions < plan, current: week === current };
  });

  return (
    <>
      <ChartContainer config={config} className="mt-2.5 aspect-auto h-37.5 w-full">
        <BarChart data={data} barSize={28} barGap={-28} margin={{ top: 20, right: 6, left: 6, bottom: 0 }}>
          <XAxis dataKey="week" tickLine={false} axisLine={false} interval={0} tick={<WeekTick current={`v${current}`} />} />
          <Bar dataKey="plan" fill="var(--border)" fillOpacity={0.5} radius={6} isAnimationActive={false} />
          <Bar dataKey="sessions" radius={6} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={d.week} fill={d.current ? CURRENT : d.short ? "var(--warning)" : "var(--color-sessions)"} />
            ))}
            <LabelList dataKey="label" position="top" className="fill-muted-foreground text-[12px] font-bold" />
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChartLegendRow
        items={[
          ["var(--primary)", "Mål nått"],
          ["var(--warning)", "Färre pass än planerat"],
          [CURRENT, "Pågående vecka"],
        ]}
      />
    </>
  );
}
