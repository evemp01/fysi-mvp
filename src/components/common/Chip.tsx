import type { ComponentProps } from "react";
import { Toggle } from "@/components/ui/toggle";

type ChipProps = Omit<ComponentProps<typeof Toggle>, "variant" | "pressed" | "onPressedChange"> & {
  selected: boolean;
  onSelect: () => void;
};

/** Pressable pill, e.g. filters and single choices. */
export function Chip({ selected, onSelect, size = "default", ...props }: ChipProps) {
  return <Toggle variant="chip" size={size} pressed={selected} onPressedChange={onSelect} {...props} />;
}
