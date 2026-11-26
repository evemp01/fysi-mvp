import { Button } from "@/components/ui/button";
import { vasColor } from "@/lib/stats";
import { cn } from "@/lib/utils";

const LABELS = ["Ingen smärta", "Lite ont", "Lite ont", "Lite ont", "Måttligt ont", "Måttligt ont", "Måttligt ont", "Mycket ont", "Mycket ont", "Mycket ont", "Värsta tänkbara"];

/** 0–10 pain scale. */
export function VasScale({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <>
      <div role="group" aria-label="Smärta 0 till 10" className="mt-2 grid grid-cols-6 gap-1 min-[441px]:grid-cols-11">
        {LABELS.map((_, v) => (
          <Button
            key={v}
            variant="outline"
            aria-pressed={value === v}
            onClick={() => onChange(v)}
            style={{ "--vas": vasColor(v) } as React.CSSProperties}
            className={cn("min-h-12.5 rounded-[10px] px-0 text-[1.1rem] font-extrabold", value === v ? "scale-106 border-(--vas) bg-(--vas) text-[#13201a] hover:bg-(--vas)" : "shadow-[inset_0_-5px_0_var(--vas)]")}>
            {v}
          </Button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[.9rem] text-muted-foreground">
        <span>Ingen smärta</span>
        <span>Värsta tänkbara</span>
      </div>
      {value != null && <p className="mt-1.5 font-bold">{LABELS[value]}</p>}
    </>
  );
}
