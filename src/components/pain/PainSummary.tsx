import { VasBadge } from "@/components/common/VasBadge";
import type { PainReport } from "@/data/types";
import { viewOf } from "@/lib/body";
import { BodyHeatmap } from "./BodyFigure";
import { PainTypeTag } from "./PainTypeIcon";

/** Compact pain report attached to a message. */
export function PainSummary({ report }: { report: PainReport }) {
  const counts = Object.fromEntries(report.area.map((a) => [a, 1]));
  const views = (["fram", "bak"] as const).filter((v) => report.area.some((a) => viewOf(a) === v));
  return (
    <div className="mt-2 grid gap-2 rounded-xl border bg-card p-2.5 text-foreground">
      <div className="flex flex-wrap items-center gap-1.5">
        <VasBadge value={report.pain} label="Smärta " />
        <span className="-ml-1 text-[.9rem] font-extrabold">/10</span>
        {report.type.map((t) => (
          <PainTypeTag key={t} type={t} />
        ))}
      </div>
      {views.length > 0 && (
        <div className="flex flex-wrap items-end gap-2.5">
          {views.map((v) => (
            <BodyHeatmap key={v} view={v} counts={counts} width={72} />
          ))}
          <span className="text-[.9rem]">{report.area.join(", ")}</span>
        </div>
      )}
    </div>
  );
}
