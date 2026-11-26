import { FlagIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from "@/components/ui/empty";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import type { Patient } from "@/data/types";
import { formatShort, fromKey } from "@/lib/dates";
import { flags } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { useExercises } from "@/state/app-context";

/** Flags and comments from the patient's logs, last 3 weeks. */
export function FlagList({ patient }: { patient: Patient }) {
  const { getExercise } = useExercises();
  const list = flags(patient);
  if (!list.length)
    return (
      <Empty className="p-5">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FlagIcon />
          </EmptyMedia>
          <EmptyDescription>Inget flaggat. {patient.firstName} har inte markerat att något känts konstigt.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  return (
    <ItemGroup className="gap-2">
      {list.map((f, i) => {
        const hurt = f.flag === "Gjorde ont";
        return (
          <Item key={i} role="listitem" size="sm" className={cn(hurt ? "bg-danger-soft" : f.flag ? "bg-warning-soft" : "bg-background")}>
            <ItemContent>
              <ItemTitle className="flex-wrap">
                {formatShort(fromKey(f.date))}
                <span className="font-normal">{f.exerciseId ? getExercise(f.exerciseId)?.name : "Om passet"}</span>
                {f.flag && <Badge variant={hurt ? "danger" : "warning"}>{f.flag}</Badge>}
              </ItemTitle>
              {f.comment && <ItemDescription className="text-foreground">”{f.comment}”</ItemDescription>}
            </ItemContent>
          </Item>
        );
      })}
    </ItemGroup>
  );
}
