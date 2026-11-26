"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CheckCircleIcon, InfoIcon, SpinnerGapIcon, WarningIcon, WarningOctagonIcon } from "@phosphor-icons/react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CheckCircleIcon className="size-5 text-success" />,
        info: <InfoIcon className="size-5 text-info" />,
        warning: <WarningIcon className="size-5 text-warning-foreground" />,
        error: <WarningOctagonIcon className="size-5 text-danger" />,
        loading: <SpinnerGapIcon className="size-5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          // App sizing: readable text, roomy padding, icon centred on the text.
          toast: "cn-toast items-center! gap-3! rounded-[14px]! px-4! py-3! text-[.95rem]! font-sans!",
          title: "font-semibold! leading-snug!",
          icon: "m-0! size-5! self-center! [&>svg]:size-5!",
          actionButton: "h-8! rounded-lg! bg-primary! px-3! text-[.88rem]! font-bold! text-primary-foreground!",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
