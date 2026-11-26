import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiProps {
  value: ReactNode;
  label: string;
  icon?: ReactNode;
  iconClassName?: string;
  compact?: boolean;
}

export function Kpi({ value, label, icon, iconClassName, compact }: KpiProps) {
  return (
    <Card className="grid gap-0.5 rounded-2xl px-4 py-3.5">
      {icon && <span className={cn("mb-1.5 grid size-8.5 place-items-center rounded-[10px] bg-brand-soft text-brand [&_svg]:size-4.5", iconClassName)}>{icon}</span>}
      <strong className={cn("leading-[1.1] font-extrabold tracking-[-0.02em] whitespace-nowrap", compact ? "text-[1.7rem]" : "text-[2rem]")}>{value}</strong>
      <span className="text-[.9rem] text-muted-foreground">{label}</span>
    </Card>
  );
}

export function KpiGrid({ children, twoColumns }: { children: ReactNode; twoColumns?: boolean }) {
  return <div className={cn("grid gap-3", twoColumns ? "grid-cols-2" : "grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))]")}>{children}</div>;
}
