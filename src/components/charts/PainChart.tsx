import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { Patient } from "@/data/types";
import { TODAY, addDays, formatShort, fromKey, toKey } from "@/lib/dates";
import { painInfo } from "@/lib/stats";

const config = { pain: { label: "Smärta", color: "var(--brand)" } } satisfies ChartConfig;

/** Pain (VAS) after each session, last 28 days, with the pain limit as a dashed line. */
export function PainChart({ patient }: { patient: Patient }) {
  const from = toKey(addDays(TODAY, -28));
  const data = (painInfo(patient)?.series ?? []).filter((l) => l.date >= from).map((l) => ({ date: formatShort(fromKey(l.date)), pain: l.pain }));
  const limit = patient.painLimit;

  return (
    <ChartContainer config={config} className="aspect-auto h-52.5 w-full">
      <AreaChart data={data} margin={{ top: 16, right: 12, left: -24, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ReferenceLine y={limit} stroke="var(--warning)" strokeWidth={2} strokeDasharray="6 5" />
        <Area
          dataKey="pain"
          type="linear"
          stroke="var(--color-pain)"
          strokeWidth={2.5}
          fill="var(--color-pain)"
          fillOpacity={0.12}
          dot={({ cx, cy, payload, index }) => {
            const over = payload.pain > limit;
            return <circle key={index} cx={cx} cy={cy} r={over ? 5 : 3.5} strokeWidth={2} fill={over ? "var(--danger)" : "var(--card)"} stroke={over ? "var(--danger)" : "var(--brand)"} />;
          }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
