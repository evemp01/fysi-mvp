import { Badge } from "@/components/ui/badge";
import { vasColor } from "@/lib/stats";

/** Pain value on its VAS colour. */
export function VasBadge({ value, label = "" }: { value: number | null; label?: string }) {
  return (
    <Badge dot={false} className="rounded-lg px-2.5 text-[.9rem] font-extrabold text-[#13201a]" style={{ background: vasColor(value ?? 0) }}>
      {label}
      {value ?? "–"}
    </Badge>
  );
}
