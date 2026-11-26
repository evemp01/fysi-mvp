import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border-[1.5px] border-transparent bg-clip-padding font-bold no-underline transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border-border bg-card text-foreground hover:bg-muted aria-expanded:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        destructive: "border-destructive bg-destructive text-white hover:bg-destructive/90",
        link: "border-0 bg-transparent font-bold text-primary underline hover:no-underline",
        chip: "rounded-full border-border bg-card text-foreground hover:border-primary",
      },
      size: {
        default: "min-h-[48px] gap-2 px-[18px] py-2.5 text-base",
        sm: "min-h-[42px] gap-2 px-3 py-1.5 text-[.93rem]",
        lg: "min-h-[62px] gap-2 px-[18px] py-2.5 text-[1.2rem]",
        xl: "min-h-[56px] gap-2 px-[18px] py-2.5 text-[1.05rem]",
        inline: "min-h-[44px] gap-1 px-1 py-2 text-base",
        "inline-sm": "min-h-[44px] gap-1 px-1 py-2 text-[.9rem]",
        icon: "size-12 rounded-full border-border bg-card [&_svg:not([class*='size-'])]:size-6",
        "icon-sm": "size-9 rounded-full [&_svg:not([class*='size-'])]:size-4.5",
        "icon-xs": "size-7 rounded-full [&_svg:not([class*='size-'])]:size-4",
        chip: "min-h-[44px] gap-1.5 px-3.5 py-2 text-base",
        "chip-sm": "min-h-[38px] gap-1.5 px-3 py-1 text-[.88rem]",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "outline",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";
  const classes = cn(buttonVariants({ variant, size, className }));

  return <Comp data-slot="button" data-variant={variant} data-size={size} className={classes} {...props} />;
}

export { Button, buttonVariants };
