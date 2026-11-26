import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-[5px] overflow-hidden rounded-full border border-transparent px-2.5 py-[3px] text-[.82rem] font-bold whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-brand-soft text-brand",
        danger: "bg-danger-soft text-[light-dark(#9e3226,#ff9d8d)]",
        warning: "bg-warning-soft text-warning-foreground",
        success: "bg-success-soft text-[light-dark(#21613c,#7fe0a8)]",
        info: "bg-info-soft text-info",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive/10 text-destructive",
        outline: "border-border text-foreground",
      },
      dot: {
        true: "before:size-1.5 before:rounded-full before:bg-current before:content-['']",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      dot: true,
    },
  },
);

function Badge({ className, variant = "default", dot = true, asChild = false, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return <Comp data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant, dot }), className)} {...props} />;
}

export { Badge, badgeVariants };
