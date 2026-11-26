import { Chip } from "@/components/common/Chip";
import { Badge } from "@/components/ui/badge";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { RESULTS } from "@/data/feedback";

interface Props {
  role: string;
  text: string;
  value: { result?: string; ease?: number };
  onChange: (value: { result?: string; ease?: number }) => void;
}

/** One test task: did it work, and how easy was it (1–5)? */
export function TaskRating({ role, text, value, onChange }: Props) {
  return (
    <FieldSet className="gap-2.5 border-b py-4">
      <FieldLegend variant="label" className="mb-0 font-semibold">
        <Badge>{role}</Badge>
        <span className="mt-1.5 block">{text}</span>
      </FieldLegend>
      <div className="flex flex-wrap gap-1.5">
        {RESULTS.map((r) => (
          <Chip key={r} selected={value.result === r} onSelect={() => onChange({ ...value, result: r })}>
            {r}
          </Chip>
        ))}
      </div>
      <div>
        <FieldDescription>Hur lätt var det? 1 = mycket svårt, 5 = mycket lätt</FieldDescription>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Chip key={n} className="min-w-12" selected={value.ease === n} onSelect={() => onChange({ ...value, ease: n })}>
              {n}
            </Chip>
          ))}
        </div>
      </div>
    </FieldSet>
  );
}
