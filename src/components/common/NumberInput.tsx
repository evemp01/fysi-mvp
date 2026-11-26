import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  className?: string;
}

/** Digits-only text field that selects on focus and keeps the last value if left empty. */
export function NumberInput({ value, onChange, label, min = 0, max = 300, className }: NumberInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <Input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      aria-label={label}
      value={draft ?? String(value)}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={() => setDraft(null)}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setDraft(raw);
        if (raw) onChange(Math.max(min, Math.min(max, Number(raw))));
      }}
      className={cn("h-11 min-h-0 w-[3.2em] rounded-lg border-0 bg-transparent p-0 text-center text-[1.2rem] font-extrabold tabular-nums focus-visible:bg-card focus-visible:ring-0", className)}
    />
  );
}
