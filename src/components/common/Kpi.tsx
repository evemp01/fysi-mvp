import type { Icon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiProps {
  value: ReactNode;
  label: string;
  /** Phosphor icon component, e.g. `icon={UsersIcon}`. */
  icon?: Icon;
  /** Extra classes for the icon's tinted box, e.g. another tone. */
  iconClassName?: string;
  compact?: boolean;
}

export function Kpi({ value, label, icon: IconComponent, iconClassName, compact }: KpiProps) {
  return (
    <Card className="grid gap-0.5 rounded-2xl px-4 py-3.5">
      <div className="flex items-center gap-4">
        {IconComponent && (
          // Padding sits on a wrapper: with border-box, padding on the 1em svg itself would squeeze the icon away.
          <span className={cn("flex-none rounded-[10px] bg-brand-soft p-4 text-brand", iconClassName)}>
            <IconComponent className="block size-4.5" />
          </span>
        )}
        <strong className={cn("leading-[1.1] font-extrabold tracking-[-0.02em] whitespace-nowrap", compact ? "text-[1.7rem]" : "text-[2rem]")}>{value}</strong>
      </div>
      <span className="text-[.9rem] text-muted-foreground">{label}</span>
    </Card>
  );
}

export function KpiGrid({ children, twoColumns }: { children: ReactNode; twoColumns?: boolean }) {
  return <div className={cn("grid gap-3", twoColumns ? "grid-cols-2" : "grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))]")}>{children}</div>;
}
