import { Disclosure } from "@/components/common/Disclosure";
import { VideoCameraIcon } from "@phosphor-icons/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Exercise, ProgramItem } from "@/data/types";
import { DemoPlayer } from "./DemoPlayer";
import { ExerciseFigure } from "./ExerciseFigure";
import { MediaGallery } from "./MediaGallery";

/**
 * What to show at the top of an exercise: the physio's own video for this patient,
 * the exercise's uploaded media, or the animated figure.
 */
export function ExerciseMedia({ exercise, item, compact }: { exercise: Exercise; item?: ProgramItem; compact?: boolean }) {
  if (item?.media?.length)
    return (
      <>
        <Alert variant="brand" className="px-3 py-2 text-[.9rem]">
          <VideoCameraIcon />
          <AlertDescription>
            <strong>VideoCameraIcon från Erik</strong>, gjord för dig
          </AlertDescription>
        </Alert>
        <MediaGallery items={item.media} title={exercise.name} />
        {!compact && (
          <Disclosure summary="Visa standardinstruktionen">
            <DemoPlayer pose={exercise.pose} />
          </Disclosure>
        )}
      </>
    );
  if (exercise.media?.length) return <MediaGallery items={exercise.media} title={exercise.name} />;
  if (compact)
    return (
      <div className="aspect-16/10 rounded-[18px] bg-brand-soft">
        <ExerciseFigure pose={exercise.pose} animated />
      </div>
    );
  return <DemoPlayer pose={exercise.pose} />;
}
