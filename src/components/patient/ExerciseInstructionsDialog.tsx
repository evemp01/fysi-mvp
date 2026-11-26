import { Lightbulb, MessageCircle } from "lucide-react";
import { InitialsAvatar } from "@/components/common/InitialsAvatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SheetDialog } from "@/components/common/Sheet";
import { DoDont, StepList } from "@/components/exercise/ExerciseGuide";
import { ExerciseMedia } from "@/components/exercise/ExerciseMedia";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemMedia } from "@/components/ui/item";
import type { Patient } from "@/data/types";
import { doseText, frequencyText } from "@/lib/stats";
import { useExercises } from "@/state/app-context";
import { PatientNotes } from "./PatientNotes";

interface Props {
  patient: Patient;
  exerciseId: string | null;
  onClose: () => void;
  onAsk: (exerciseName: string) => void;
}

/** "How to do it" for one exercise in the patient's program. */
export function ExerciseInstructionsDialog({ patient, exerciseId, onClose, onAsk }: Props) {
  const { getExercise } = useExercises();
  const items = patient.program.items;
  const index = items.findIndex((x) => x.exerciseId === exerciseId);
  const item = items[index];
  const exercise = exerciseId ? getExercise(exerciseId) : undefined;

  return (
    <SheetDialog open={!!exercise} onClose={onClose} title={index >= 0 ? `Övning ${index + 1} av ${items.length}` : (exercise?.name ?? "")}>
      {exercise && item && (
        <>
          <ExerciseMedia exercise={exercise} item={item} />
          <h2>{exercise.name}</h2>
          <div className="flex flex-wrap gap-1.5">
            <Badge dot={false}>{doseText(item, exercise)}</Badge>
            <Badge variant="info" dot={false}>
              {frequencyText(patient.program)}
            </Badge>
            <Badge variant="warning" dot={false}>
              Smärtgräns {patient.painLimit}/10
            </Badge>
          </div>
          {exercise.why && (
            <Alert variant="brand">
              <Lightbulb />
              <AlertTitle>Varför den här övningen?</AlertTitle>
              <AlertDescription>{exercise.why}</AlertDescription>
            </Alert>
          )}
          <h3>Så gör du</h3>
          <StepList steps={item.steps ?? exercise.steps} />
          <h3>Tänk på</h3>
          <DoDont ok>{item.tip ?? exercise.tip}</DoDont>
          {exercise.avoid && <DoDont ok={false}>{exercise.avoid}</DoDont>}
          {item.note && (
            <Item variant="card" size="sm">
              <ItemMedia>
                <InitialsAvatar className="size-9">E</InitialsAvatar>
              </ItemMedia>
              <ItemContent>
                <ItemDescription>Erik skriver</ItemDescription>
                <span>”{item.note}”</span>
              </ItemContent>
            </Item>
          )}
          <PatientNotes patient={patient} exerciseId={exercise.id} />
          <div className="grid grid-cols-[1fr_1.4fr] gap-2">
            <Button onClick={() => onAsk(exercise.name)}>
              <MessageCircle className="size-4.5" />
              Fråga
            </Button>
            <Button variant="default" onClick={onClose}>
              Jag förstår
            </Button>
          </div>
        </>
      )}
    </SheetDialog>
  );
}
