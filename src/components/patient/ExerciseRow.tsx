import { Check, ChevronRight, Pencil } from "lucide-react";
import { ExerciseThumbnail } from "@/components/exercise/ExerciseThumbnail";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import type { Exercise, ProgramItem } from "@/data/types";
import { hasVideo } from "@/lib/media";
import { doseText } from "@/lib/stats";
import { cn } from "@/lib/utils";

interface ExerciseRowProps {
  exercise: Exercise;
  item: ProgramItem;
  doneToday: boolean;
  lastNote?: string;
  onOpen: () => void;
}

/** One exercise in "Ditt pass". */
export function ExerciseRow({ exercise, item, doneToday, lastNote, onOpen }: ExerciseRowProps) {
  const videoLabel = item.media?.length ? "Video från Erik" : hasVideo(exercise.media) ? "Video" : null;
  return (
    <Item asChild variant="card" className="flex-nowrap rounded-2xl px-3 py-2.5 hover:border-brand">
      <button type="button" onClick={onOpen}>
        <ItemMedia className="w-19 translate-y-0! self-center!">
          <ExerciseThumbnail exercise={exercise} animated className="w-full" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-[1.15rem]">{exercise.name}</ItemTitle>
          <ItemDescription className="text-[.95rem] font-semibold">
            {doseText(item, exercise)}
            {videoLabel && (
              <>
                {" "}
                · <span className="font-bold text-brand">{videoLabel}</span>
              </>
            )}
          </ItemDescription>
          {lastNote && (
            <span className="mt-1 flex items-start gap-1.5 text-[.9rem] font-semibold text-warning-foreground">
              <Pencil className="mt-[calc((1lh-0.875rem)/2)] size-3.5 flex-none" />
              <span className="line-clamp-2">{lastNote}</span>
            </span>
          )}
        </ItemContent>
        <ItemActions>
          <span aria-label={doneToday ? "Gjord i dag" : "Visa"} className={cn("grid size-8.5 place-items-center rounded-full border-[1.5px] text-muted-foreground", doneToday && "border-success bg-success text-white")}>
            {doneToday ? <Check className="size-4.5" strokeWidth={3} /> : <ChevronRight className="size-4.5" />}
          </span>
        </ItemActions>
      </button>
    </Item>
  );
}
