import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { NumberInput } from "./NumberInput";

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

/** − [number] + control. */
export function Stepper({ value, onChange, label, min = 1, max = 300, step = 1 }: StepperProps) {
  const set = (v: number) => onChange(Math.max(min, Math.min(max, v)));
  return (
    <ButtonGroup aria-label={label}>
      <Button size="icon" className="size-11 rounded-xl" aria-label={`Minska ${label.toLowerCase()}`} disabled={value <= min} onClick={() => set(value - step)}>
        <Minus />
      </Button>
      <NumberInput value={value} onChange={set} label={label} min={min} max={max} className="h-11 rounded-none border-[1.5px] border-border bg-card" />
      <Button size="icon" className="size-11 rounded-xl" aria-label={`Öka ${label.toLowerCase()}`} disabled={value >= max} onClick={() => set(value + step)}>
        <Plus />
      </Button>
    </ButtonGroup>
  );
}
