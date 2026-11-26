import { PlayIcon } from "@phosphor-icons/react";
import type { Exercise } from "@/data/types";
import { cn } from "@/lib/utils";
import { ExerciseFigure } from "./ExerciseFigure";

/** Small picture of an exercise: cover photo/video if any, otherwise the stick figure. */
export function ExerciseThumbnail({ exercise, animated, className }: { exercise: Pick<Exercise, "pose" | "media">; animated?: boolean; className?: string }) {
  const cover = exercise.media?.[0];
  return (
    <div className={cn("aspect-4/3 overflow-hidden rounded-xl bg-brand-soft", className)}>
      {cover?.kind === "image" ? <img src={cover.url} alt="" className="size-full object-cover" /> : cover ? <VideoPlaceholder label="Video" /> : <ExerciseFigure pose={exercise.pose} animated={animated} />}
    </div>
  );
}

export function VideoPlaceholder({ label }: { label: string }) {
  return (
    <div className="grid size-full min-h-15 place-items-center content-center gap-1 bg-hero text-[.8rem] font-bold text-white">
      <span className="grid size-11 place-items-center rounded-full bg-white/20">
        <PlayIcon weight="fill" className="size-5" />
      </span>
      {label}
    </div>
  );
}
