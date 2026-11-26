import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function InitialsAvatar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Avatar className={cn("size-11 after:hidden", className)}>
      <AvatarFallback className="bg-brand-muted text-[length:inherit] font-extrabold text-brand">{children}</AvatarFallback>
    </Avatar>
  );
}
