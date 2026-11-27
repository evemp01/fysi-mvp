import { ArrowDownIcon, ArrowUpIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { ExerciseThumbnail } from "@/components/exercise/ExerciseThumbnail";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import type { Exercise, ProgramItem } from "@/data/types";
import { hasVideo } from "@/lib/media";
import { doseText } from "@/lib/stats";
import { cn } from "@/lib/utils";

interface Props {
  index: number;
  item: ProgramItem;
  exercise: Exercise;
  active: boolean;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}

/** One exercise in the program overview: name, dose and what's been customised. */
export function ProgramItemRow({ index, item, exercise, active, isFirst, isLast, onEdit, onMove, onRemove }: Props) {
  const extras = [item.media?.length ? (hasVideo(item.media) ? "egen video" : "egen bild") : null, item.steps || item.tip ? "ändrad instruktionstext" : null].filter(Boolean);

  return (
    <Item variant="card" size="sm" role="listitem" className={cn("flex-nowrap", active && "border-brand bg-brand-soft")}>
      <ItemMedia className="w-14 self-start">
        <ExerciseThumbnail exercise={exercise} className="w-full rounded-lg" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-[.95rem]">
          {index + 1}. {exercise.name}
        </ItemTitle>
        <ItemDescription className="font-semibold text-foreground">{doseText(item, exercise)}</ItemDescription>
        {item.note.trim() && <ItemDescription className="line-clamp-1">Instruktion: {item.note.trim()}</ItemDescription>}
        {extras.length > 0 && <ItemDescription className="first-letter:uppercase">{extras.join(" · ")}</ItemDescription>}
      </ItemContent>
      <ItemActions className="gap-0.5 self-start">
        <Button size="icon-sm" aria-label={`Ändra ${exercise.name}`} onClick={onEdit}>
          <PencilSimpleIcon />
        </Button>
        <Button size="icon-sm" aria-label={`Flytta upp ${exercise.name}`} disabled={isFirst} onClick={() => onMove(-1)}>
          <ArrowUpIcon />
        </Button>
        <Button size="icon-sm" aria-label={`Flytta ned ${exercise.name}`} disabled={isLast} onClick={() => onMove(1)}>
          <ArrowDownIcon />
        </Button>
        <Button size="icon-sm" className="text-danger" aria-label={`Ta bort ${exercise.name}`} onClick={onRemove}>
          <TrashIcon />
        </Button>
      </ItemActions>
    </Item>
  );
}
