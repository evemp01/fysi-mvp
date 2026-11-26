import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Chip } from "@/components/common/Chip";
import { Button } from "@/components/ui/button";
import { ExerciseFigure } from "./ExerciseFigure";

/** Large animated figure with play/pause and slow motion. */
export function DemoPlayer({ pose }: { pose: string }) {
  const [paused, setPaused] = useState(false);
  const [slow, setSlow] = useState(false);
  return (
    <div className="grid gap-2">
      <div className="aspect-16/10 rounded-[18px] bg-brand-soft">
        <ExerciseFigure pose={pose} animated paused={paused} slow={slow} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="default" onClick={() => setPaused(!paused)}>
          {paused ? (
            <>
              <PlayIcon weight="fill" className="size-4" /> Spela
            </>
          ) : (
            <>
              <PauseIcon weight="fill" className="size-4" /> Pausa
            </>
          )}
        </Button>
        <Chip size="sm" selected={slow} onSelect={() => setSlow(!slow)}>
          Långsamt
        </Chip>
        <span className="text-[.9rem] text-muted-foreground">Instruktionsfilm. Den ljusa figuren visar startläget.</span>
      </div>
    </div>
  );
}
