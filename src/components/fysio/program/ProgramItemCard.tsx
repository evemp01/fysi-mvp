import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "@phosphor-icons/react";
import { Stepper } from "@/components/common/Stepper";
import { ExerciseThumbnail } from "@/components/exercise/ExerciseThumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { Exercise, ProgramItem } from "@/data/types";
import { ItemMediaBox } from "./ItemMediaBox";

interface Props {
  item: ProgramItem;
  exercise: Exercise;
  patientName: string;
  isFirst: boolean;
  isLast: boolean;
  editingText: boolean;
  getExercise: (id: string) => Exercise | undefined;
  onChange: (changes: Partial<ProgramItem>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  onSwap: (exerciseId: string) => void;
  onToggleEditText: () => void;
}

/** One exercise in the program builder: dose, own media, variants, patient-specific text. */
export function ProgramItemCard({ item, exercise, patientName, isFirst, isLast, editingText, getExercise, onChange, onMove, onRemove, onSwap, onToggleEditText }: Props) {
  const timed = exercise.unit === "sek";
  const easier = exercise.easier ? getExercise(exercise.easier) : undefined;
  const harder = exercise.harder ? getExercise(exercise.harder) : undefined;
  const customised = !!(item.steps || item.tip);

  return (
    <div className="grid grid-cols-[70px_minmax(0,1fr)] gap-3 rounded-2xl border bg-card p-3">
      <ExerciseThumbnail exercise={exercise} />
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3>{exercise.name}</h3>
          <Badge dot={false}>{exercise.area}</Badge>
        </div>
        <div className="flex flex-wrap">
          <Button variant="link" size="inline-sm" disabled={isFirst} onClick={() => onMove(-1)}>
            <ArrowUpIcon className="size-4" /> Upp
          </Button>
          <Button variant="link" size="inline-sm" disabled={isLast} onClick={() => onMove(1)}>
            <ArrowDownIcon className="size-4" /> Ned
          </Button>
          <Button variant="link" size="inline-sm" className="text-danger" onClick={onRemove}>
            <TrashIcon className="size-4" /> Ta bort
          </Button>
        </div>
      </div>

      <div className="col-span-full grid gap-2.5">
        <div className="flex flex-wrap gap-4">
          <Field className="w-auto gap-1">
            <FieldTitle className="text-[.9rem] font-medium text-muted-foreground">Set</FieldTitle>
            <Stepper label="Antal set" value={item.sets} min={1} max={10} onChange={(sets) => onChange({ sets })} />
          </Field>
          <Field className="w-auto gap-1">
            <FieldTitle className="text-[.9rem] font-medium text-muted-foreground">{timed ? "Sekunder" : "Repetitioner"}</FieldTitle>
            <Stepper label={timed ? "Sekunder" : "Repetitioner"} value={item.reps} min={1} step={timed ? 5 : 1} onChange={(reps) => onChange({ reps })} />
          </Field>
        </div>

        <ItemMediaBox media={item.media ?? []} patientName={patientName} onChange={(media) => onChange({ media })} />

        {(easier || harder) && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[.9rem] text-muted-foreground">Byt till</span>
            {easier && (
              <Button variant="chip" size="chip-sm" onClick={() => onSwap(easier.id)}>
                <ArrowDownIcon className="size-4" /> Lättare: {easier.name}
              </Button>
            )}
            {harder && (
              <Button variant="chip" size="chip-sm" onClick={() => onSwap(harder.id)}>
                <ArrowUpIcon className="size-4" /> Svårare: {harder.name}
              </Button>
            )}
          </div>
        )}

        <Field className="gap-1">
          <FieldLabel htmlFor={`note-${item.exerciseId}`} className="text-[.9rem] font-medium text-muted-foreground">
            Egen instruktion till {patientName} (valfritt)
          </FieldLabel>
          <Input id={`note-${item.exerciseId}`} value={item.note} placeholder="T.ex. Använd en stol med armstöd" onChange={(e) => onChange({ note: e.target.value })} />
        </Field>

        {editingText ? (
          <FieldGroup className="gap-3 rounded-[14px] bg-brand-soft px-3.5 py-3">
            <Field className="gap-1">
              <FieldLabel htmlFor={`steps-${item.exerciseId}`}>Instruktionssteg</FieldLabel>
              <FieldDescription>Ett steg per rad</FieldDescription>
              <Textarea id={`steps-${item.exerciseId}`} value={(item.steps ?? exercise.steps).join("\n")} onChange={(e) => onChange({ steps: e.target.value.split("\n") })} />
            </Field>
            <Field className="gap-1">
              <FieldLabel htmlFor={`tip-${item.exerciseId}`}>Tänk på</FieldLabel>
              <Input id={`tip-${item.exerciseId}`} value={item.tip ?? exercise.tip} onChange={(e) => onChange({ tip: e.target.value })} />
            </Field>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button size="sm" variant="default" onClick={onToggleEditText}>
                Klar
              </Button>
              {customised && (
                <Button variant="link" size="inline-sm" onClick={() => onChange({ steps: undefined, tip: undefined })}>
                  Återställ bibliotekets text
                </Button>
              )}
            </div>
          </FieldGroup>
        ) : (
          <Button variant="link" size="inline-sm" className="justify-self-start pl-0" onClick={onToggleEditText}>
            Ändra instruktionstext{customised && ` (ändrad för ${patientName})`}
          </Button>
        )}
      </div>
    </div>
  );
}
