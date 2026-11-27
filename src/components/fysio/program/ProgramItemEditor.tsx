import { ArrowDownIcon, ArrowUpIcon, CheckIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Stepper } from "@/components/common/Stepper";
import { ExerciseThumbnail } from "@/components/exercise/ExerciseThumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { Exercise, ProgramItem } from "@/data/types";
import { ItemMediaBox } from "./ItemMediaBox";

interface Props {
  item: ProgramItem;
  exercise: Exercise;
  patientName: string;
  /** Not in the program yet: the main button adds it. */
  isNew: boolean;
  getExercise: (id: string) => Exercise | undefined;
  onChange: (changes: Partial<ProgramItem>) => void;
  onSwap: (exerciseId: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onRemove: () => void;
}

/** Sets up one exercise before it goes into the program: dose, own media, variants, patient-specific text. */
export function ProgramItemEditor({ item, exercise, patientName, isNew, getExercise, onChange, onSwap, onSubmit, onCancel, onRemove }: Props) {
  const [editingText, setEditingText] = useState(false);
  const timed = exercise.unit === "sek";
  const easier = exercise.easier ? getExercise(exercise.easier) : undefined;
  const harder = exercise.harder ? getExercise(exercise.harder) : undefined;
  const customised = !!(item.steps || item.tip);

  return (
    <Card className="grid gap-3 p-3.5">
      <div className="grid grid-cols-[70px_minmax(0,1fr)] items-center gap-3">
        <ExerciseThumbnail exercise={exercise} />
        <div className="grid gap-1">
          <h3>{exercise.name}</h3>
          <Badge dot={false} className="justify-self-start">
            {exercise.area}
          </Badge>
        </div>
      </div>

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
            <Button size="sm" variant="default" onClick={() => setEditingText(false)}>
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
        <Button variant="link" size="inline-sm" className="justify-self-start pl-0" onClick={() => setEditingText(true)}>
          Ändra instruktionstext{customised && ` (ändrad för ${patientName})`}
        </Button>
      )}

      <div className="flex flex-wrap items-center gap-2.5 border-t pt-3">
        <Button variant="default" onClick={onSubmit}>
          {isNew ? (
            <>
              <PlusIcon className="size-4.5" weight="bold" /> Lägg till i träningsprogrammet
            </>
          ) : (
            <>
              <CheckIcon className="size-4.5" weight="bold" /> Uppdatera i programmet
            </>
          )}
        </Button>
        <Button onClick={onCancel}>Avbryt</Button>
        {!isNew && (
          <Button variant="link" size="inline-sm" className="text-danger" onClick={onRemove}>
            <TrashIcon className="size-4" /> Ta bort ur programmet
          </Button>
        )}
      </div>
    </Card>
  );
}
