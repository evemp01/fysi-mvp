import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { Patient } from "@/data/types";
import { weekSeries } from "@/lib/stats";

const config = {
  sessions: { label: "Pass", color: "var(--primary)" },
  pain: { label: "Smärta, snitt", color: "var(--danger)" },
} satisfies ChartConfig;

/** Sessions per week (bars) and average pain (line), for the patient's progress view. */
export function WeeklyProgressChart({ patient }: { patient: Patient }) {
  const data = weekSeries(patient).map((w) => ({ week: `v${w.week}`, sessions: w.sessions, pain: w.pain == null ? null : Math.round(w.pain * 10) / 10 }));
  const max = Math.max(patient.program.perWeek + 1, ...data.map((d) => d.sessions));

  return (
    <ChartContainer config={config} className="aspect-auto h-57.5 w-full">
      <ComposedChart data={data} margin={{ top: 16, right: 0, left: -24, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <YAxis yAxisId="sessions" domain={[0, max]} allowDecimals={false} tickLine={false} axisLine={false} />
        <YAxis yAxisId="pain" orientation="right" domain={[0, 10]} ticks={[0, 5, 10]} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar yAxisId="sessions" dataKey="sessions" fill="var(--color-sessions)" radius={5} isAnimationActive={false} />
        <ReferenceLine yAxisId="pain" y={patient.painLimit} stroke="var(--warning)" strokeWidth={2} strokeDasharray="6 5" />
        <Line yAxisId="pain" dataKey="pain" stroke="var(--color-pain)" strokeWidth={3} dot={{ r: 5, fill: "var(--card)", strokeWidth: 2.5 }} connectNulls isAnimationActive={false} />
      </ComposedChart>
    </ChartContainer>
  );
}
