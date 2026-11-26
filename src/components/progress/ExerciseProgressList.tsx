import { Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item";
import { ExerciseThumbnail } from "@/components/exercise/ExerciseThumbnail";
import type { Patient, Tone } from "@/data/types";
import { adherence, doseText, shareDone } from "@/lib/stats";
import { useExercises } from "@/state/app-context";

/** How much of each exercise the patient does, last 14 days. */
export function ExerciseProgressList({ patient }: { patient: Patient }) {
  const { getExercise } = useExercises();
  const { logs } = adherence(patient);
  return (
    <ItemGroup className="gap-0">
      {patient.program.items.map((item, i) => {
        const exercise = getExercise(item.exerciseId);
        if (!exercise) return null;
        const pct = logs.length ? Math.round((logs.reduce((s, l) => s + shareDone(item, l.items[item.exerciseId]), 0) / logs.length) * 100) : null;
        const flagged = logs.filter((l) => l.items[item.exerciseId]?.flag).length;
        const [tone, text]: [Exclude<Tone, "brand">, string] = flagged
          ? ["danger", flagged === 1 ? "Flaggad 1 gång" : `Flaggad ${flagged} ggr`]
          : pct == null
            ? ["info", "Ingen data"]
            : pct >= 90
              ? ["success", "Gör allt"]
              : ["warning", `Gör ${pct} %`];
        return (
          <Fragment key={item.exerciseId}>
            {i > 0 && <ItemSeparator className="my-0" />}
            <Item role="listitem" size="sm" className="px-0">
              <ItemMedia className="w-13 translate-y-0! self-center!">
                <ExerciseThumbnail exercise={exercise} className="w-full" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{exercise.name}</ItemTitle>
                <ItemDescription>{doseText(item, exercise)}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant={tone}>{text}</Badge>
              </ItemActions>
            </Item>
          </Fragment>
        );
      })}
    </ItemGroup>
  );
}
