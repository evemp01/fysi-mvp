import { Check, ChevronRight, Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { NumberInput } from "@/components/common/NumberInput";
import { SheetDialog } from "@/components/common/Sheet";
import { ExerciseMedia } from "@/components/exercise/ExerciseMedia";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import type { Patient } from "@/data/types";
import { formatClock } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useExercises } from "@/state/app-context";

/** Reps (or seconds) done per set, per exercise. */
export type SessionResult = Record<string, number[]>;

interface Props {
  patient: Patient;
  onClose: () => void;
  /** Session finished (or stopped early): open the log with what was done. */
  onLog: (result: SessionResult) => void;
}

/** Guided session: one exercise and set at a time, with a timer for timed exercises. */
export function RunSessionDialog({ patient, onClose, onLog }: Props) {
  const { getExercise } = useExercises();
  const items = patient.program.items;
  const [index, setIndex] = useState(0);
  const [set, setSet] = useState(1);
  const [done, setDone] = useState<SessionResult>({});
  const [flash, setFlash] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

  const item = items[index];
  const exercise = item && getExercise(item.exerciseId);
  const timed = exercise?.unit === "sek";
  const [reps, setReps] = useState(item?.reps ?? 0);
  const [secondsLeft, setSecondsLeft] = useState(timed ? item.reps : 0);
  const [ticking, setTicking] = useState(false);

  // The timer stops by itself at zero; "running" is derived instead of stored.
  const timeUp = secondsLeft <= 0;
  const running = ticking && !timeUp;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (ticking && timeUp) navigator.vibrate?.(300);
  }, [ticking, timeUp]);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(false), 600);
    return () => clearTimeout(id);
  }, [flash]);

  const goToExercise = (i: number) => {
    const next = items[i];
    setIndex(i);
    setSet(1);
    setTicking(false);
    if (next) {
      setReps(next.reps);
      setSecondsLeft(getExercise(next.exerciseId)?.unit === "sek" ? next.reps : 0);
    }
  };

  const record = (values: number[]) => {
    setDone((d) => ({ ...d, [item.exerciseId]: [...(d[item.exerciseId] ?? []), ...values] }));
    setFlash(true);
  };

  const completeSet = () => {
    const got = timed ? (secondsLeft < item.reps ? Math.max(1, item.reps - Math.max(0, secondsLeft)) : item.reps) : reps;
    record([got]);
    if (set < item.sets) {
      setSet(set + 1);
      setTicking(false);
      setReps(item.reps);
      setSecondsLeft(timed ? item.reps : 0);
    } else goToExercise(index + 1);
  };

  const completeExercise = () => {
    const rest = item.sets - (done[item.exerciseId]?.length ?? 0);
    if (rest > 0) record(Array.from({ length: rest }, (_, k) => (k === 0 && !timed ? reps : item.reps)));
    goToExercise(index + 1);
  };

  const requestClose = () => {
    if (index < items.length && Object.keys(done).length) {
      setTicking(false);
      setConfirmExit(true);
    } else onClose();
  };

  const started = timed && secondsLeft < item?.reps;
  const finished = index >= items.length;

  return (
    <>
      <SheetDialog open onClose={requestClose} title="Träningspass">
        {finished ? (
          <>
            <div className="grid justify-items-center gap-2 py-5 text-center">
              <span className="grid size-19 place-items-center rounded-full bg-success text-white">
                <Check className="size-10" strokeWidth={3} />
              </span>
              <h2>Bra jobbat, {patient.firstName}!</h2>
              <p className="text-muted-foreground">Passet är klart. Det du gjort är redan ifyllt i loggen, du behöver bara kontrollera.</p>
            </div>
            <Button variant="default" size="xl" className="w-full" onClick={() => onLog(done)}>
              Logga passet
            </Button>
          </>
        ) : (
          exercise && (
            <>
              <div className="flex gap-1" aria-hidden="true">
                {items.map((_, i) => (
                  <i key={i} className={cn("h-1.5 flex-1 rounded-md", i < index ? "bg-success" : i === index ? "bg-brand" : "bg-border")} />
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[.9rem] text-muted-foreground">
                  Övning {index + 1} av {items.length}
                </span>
                <Button variant="link" size="inline-sm" onClick={() => goToExercise(index + 1)}>
                  Hoppa över övningen
                </Button>
              </div>
              <ExerciseMedia exercise={exercise} item={item} compact />
              <h2>{exercise.name}</h2>

              <div className={cn("grid justify-items-center gap-2.5 rounded-[18px] border bg-card p-4 text-center", flash && "animate-[flash_.6s_ease-out] motion-reduce:animate-none")}>
                <span className="text-[1.05rem] font-extrabold text-brand">
                  Set {set} av {item.sets}
                </span>
                <div className="flex justify-center gap-2" aria-hidden="true">
                  {Array.from({ length: item.sets }, (_, k) => (
                    <i key={k} className={cn("grid size-7.5 place-items-center rounded-full border-2 bg-card", k < set - 1 && "border-success bg-success text-white", k === set - 1 && "border-brand shadow-[0_0_0_3px_var(--brand-muted)]")}>
                      {k < set - 1 && <Check className="size-4" strokeWidth={3} />}
                    </i>
                  ))}
                </div>

                {timed ? (
                  <>
                    <span className={cn("text-[3.2rem] leading-none font-extrabold tracking-[-0.03em] tabular-nums", secondsLeft <= 0 && "text-success")}>{secondsLeft <= 0 ? "Klart!" : formatClock(secondsLeft)}</span>
                    <span className="text-[.9rem] text-muted-foreground">{secondsLeft <= 0 ? "Tiden är ute." : `Håll i ${item.reps} sekunder. Starta timern när du är redo.`}</span>
                    <div className="flex flex-wrap justify-center gap-2">
                      {secondsLeft > 0 && (
                        <Button variant={running ? "outline" : "default"} className="min-w-32.5" onClick={() => setTicking(!running)}>
                          {running ? (
                            <>
                              <Pause className="size-4 fill-current" /> Pausa
                            </>
                          ) : started ? (
                            <>
                              <Play className="size-4 fill-current" /> Fortsätt
                            </>
                          ) : (
                            <>
                              <Play className="size-4 fill-current" /> Starta timer
                            </>
                          )}
                        </Button>
                      )}
                      {(started || running) && (
                        <Button
                          className="min-w-32.5"
                          onClick={() => {
                            setTicking(false);
                            setSecondsLeft(item.reps);
                          }}>
                          <RotateCcw className="size-4" /> Starta om
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="flex items-baseline">
                      <NumberInput
                        value={reps}
                        onChange={setReps}
                        label="Antal repetitioner"
                        className="h-auto w-[2.2em] rounded-none border-b-2 border-dashed text-[3.2rem] tracking-[-0.03em] focus-visible:border-brand focus-visible:bg-transparent"
                      />
                      <small className="text-[1.1rem] font-bold text-muted-foreground"> rep</small>
                    </span>
                    <ButtonGroup>
                      <Button aria-label="Färre repetitioner" onClick={() => setReps(Math.max(0, reps - 1))}>
                        <Minus className="size-4.5" /> 1
                      </Button>
                      <Button aria-label="Fler repetitioner" onClick={() => setReps(reps + 1)}>
                        <Plus className="size-4.5" /> 1
                      </Button>
                    </ButtonGroup>
                    <span className="text-[.9rem] text-muted-foreground">Gjorde du fler eller färre? Tryck på siffran och skriv, eller använd − och +.</span>
                  </>
                )}

                <Button variant="default" size="xl" className="w-full" onClick={completeSet}>
                  <Check className="size-5" strokeWidth={3} />
                  {set < item.sets ? `Set ${set} klart` : index < items.length - 1 ? "Klar, nästa övning" : "Klar, avsluta passet"}
                </Button>
                {set < item.sets && (
                  <Button className="w-full" onClick={completeExercise}>
                    Hela övningen klar, gå till {index < items.length - 1 ? "nästa övning" : "slutet"}
                    <ChevronRight className="size-4.5" />
                  </Button>
                )}
              </div>
            </>
          )
        )}
      </SheetDialog>
      <ConfirmDialog
        open={confirmExit}
        onOpenChange={setConfirmExit}
        title="Avsluta passet?"
        description="Du har gjort en del av passet. Vill du logga det du har gjort?"
        confirmLabel="Logga det jag gjort"
        onConfirm={() => onLog(done)}
        altLabel="Avsluta utan att logga"
        onAlt={onClose}
        cancelLabel="Fortsätt träna"
      />
    </>
  );
}
