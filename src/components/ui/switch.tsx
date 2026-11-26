import * as React from "react";
import { cn } from "cn";
import { Switch as SwitchPrimitive } from "radix-ui";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none group-has-focus-visible/field-label:border-transparent group-has-focus-visible/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 p-0.75 data-[size=default]:h-8 data-[size=default]:w-14 data-[size=sm]:h-7 data-[size=sm]:w-12 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-success data-unchecked:bg-border data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}>
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.25)] ring-0 transition-transform group-data-[size=default]/switch:size-6.5 group-data-[size=sm]/switch:size-5.5 data-checked:translate-x-6 data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-checked:translate-x-5"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
