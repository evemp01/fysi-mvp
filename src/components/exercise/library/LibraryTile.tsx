import { CheckIcon, PlusIcon, StarIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { LEVELS } from "@/data/exercises";
import type { Exercise } from "@/data/types";
import { hasVideo } from "@/lib/media";
import { cn } from "@/lib/utils";
import { ExerciseThumbnail } from "../ExerciseThumbnail";

interface LibraryTileProps {
  exercise: Exercise;
  why?: string;
  /** In the program being edited (program mode). */
  selected?: boolean;
  /** Number of programs it's used in (bank mode). */
  usedIn?: number;
  favorite: boolean;
  actionLabel: string;
  onClick: () => void;
  onFavorite: () => void;
}

export function LibraryTile({ exercise, why, selected, usedIn, favorite, actionLabel, onClick, onFavorite }: LibraryTileProps) {
  return (
    <div className={cn("relative grid gap-1.5 rounded-[14px] border-[1.5px] bg-card p-2", selected && "border-brand bg-brand-soft")}>
      <Button
        variant="ghost"
        aria-pressed={selected}
        aria-label={`${actionLabel} ${exercise.name}`}
        onClick={onClick}
        className="grid h-auto content-start justify-normal gap-1.5 border-0 p-0 text-left font-medium whitespace-normal hover:bg-transparent">
        <ExerciseThumbnail exercise={exercise} />
        <strong className="text-[.9rem]">{exercise.name}</strong>
        <span className="text-[.82rem] text-muted-foreground">
          {exercise.position} · {LEVELS[exercise.level]}
          {exercise.custom && (
            <>
              {" "}
              · <b className="text-warning-foreground">Egen</b>
            </>
          )}
          {hasVideo(exercise.media) ? " · Video" : exercise.media?.length ? " · Foto" : ""}
          {usedIn ? ` · i ${usedIn} program` : ""}
        </span>
        {why && <span className="justify-self-start rounded-lg bg-brand-muted px-1.5 py-0.5 text-[.76rem] font-bold text-brand">{why}</span>}
      </Button>
      <Button
        variant="ghost"
        aria-pressed={favorite}
        aria-label={`Favorit: ${exercise.name}`}
        onClick={onFavorite}
        className={cn("absolute top-1.5 left-1.5 size-9 min-h-0 rounded-full border-0 bg-card p-0 shadow-[0_1px_3px_rgba(0,0,0,.18)] hover:bg-card", favorite ? "text-warning" : "text-muted-foreground")}>
        <StarIcon weight={favorite ? "fill" : "regular"} className="size-4.5" />
      </Button>
      {selected && (
        <span className="absolute top-2 right-2 grid size-6.5 place-items-center rounded-full bg-brand text-white">
          <CheckIcon className="size-3.75" weight="bold" />
        </span>
      )}
    </div>
  );
}

export function NewExerciseTile({ query, onClick }: { query: string; onClick: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick} className="grid h-auto min-h-37.5 content-center justify-items-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-brand bg-card p-2 text-center whitespace-normal text-brand">
      <span className="grid size-11 place-items-center rounded-full bg-brand-muted">
        <PlusIcon className="size-6" weight="bold" />
      </span>
      <strong className="text-[.9rem]">{query ? `Skapa ”${query}”` : "Skapa egen övning"}</strong>
      <span className="text-[.8rem] font-medium text-muted-foreground">{query ? "som egen övning" : "Om den inte finns här"}</span>
    </Button>
  );
}
