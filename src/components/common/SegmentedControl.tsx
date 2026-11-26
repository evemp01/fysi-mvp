import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  value: T | null;
  options: readonly T[] | { value: T; label: string }[];
  onChange: (value: T) => void;
  label?: string;
  className?: string;
}

export function SegmentedControl<T extends string>({ value, options, onChange, label, className }: SegmentedControlProps<T>) {
  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <ToggleGroup
      type="single"
      spacing={1}
      aria-label={label}
      value={value ?? ""}
      onValueChange={(v) => v && onChange(v as T)}
      className={cn("grid w-full gap-1 rounded-[14px] border bg-background p-1", className)}
      style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map((o) => (
        <ToggleGroupItem key={o.value} variant="seg" size="seg" value={o.value}>
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
