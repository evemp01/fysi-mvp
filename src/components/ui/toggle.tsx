import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Toggle as TogglePrimitive } from "radix-ui";

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg font-bold transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted data-[state=on]:bg-muted",
        outline: "border border-input bg-transparent hover:bg-muted data-[state=on]:bg-muted",
        chip: "rounded-full border-[1.5px] border-border bg-card text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        seg: "flex-1 rounded-[10px] border-0 bg-transparent text-muted-foreground data-[state=on]:bg-card data-[state=on]:text-primary data-[state=on]:shadow-[0_1px_3px_rgba(0,0,0,.12)]",
      },
      size: {
        default: "min-h-[44px] px-3.5 py-2 text-base",
        sm: "min-h-[38px] px-3 py-1 text-[.88rem]",
        md: "min-h-[40px] px-3 py-1 text-[.95rem]",
        seg: "min-h-[46px] px-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({ className, variant = "default", size = "default", ...props }: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ variant, size, className }))} {...props} />;
}

export { Toggle, toggleVariants };
