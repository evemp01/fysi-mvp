import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DisclosureProps {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Link-style "show more" section. */
export function Disclosure({ summary, children, ...props }: DisclosureProps) {
  return (
    <Collapsible {...props} className="group/disclosure">
      <CollapsibleTrigger className="flex min-h-11 items-center gap-1.5 font-bold text-brand">
        <ChevronRight className="size-4.5 transition-transform group-data-[state=open]/disclosure:rotate-90" />
        {summary}
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
