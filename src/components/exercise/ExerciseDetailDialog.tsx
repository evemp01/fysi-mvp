import { ArrowDownIcon, ArrowUpIcon, CheckIcon, LightbulbIcon, PencilSimpleIcon, PlusIcon, StarIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SheetDialog } from "@/components/common/Sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LEVELS } from "@/data/exercises";
import { cn } from "@/lib/utils";
import { useApp, useExercises } from "@/state/app-context";
import { DemoPlayer } from "./DemoPlayer";
import { DoDont, StepList } from "./ExerciseGuide";
import { MediaGallery } from "./MediaGallery";

interface Props {
  exerciseId: string;
  onClose: () => void;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onAddToPatient: (patientId: string) => void;
}

/** Exercise bank preview: how it's done, variants, and "add to a patient's program". */
export function ExerciseDetailDialog({ exerciseId, onClose, onOpen, onEdit, onAddToPatient }: Props) {
  const { state, update } = useApp();
  const { getExercise } = useExercises();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const e = getExercise(exerciseId);
  if (!e) return null;

  const patients = state.order.map((id) => state.patients[id]);
  const usedBy = patients.filter((p) => p.program.items.some((it) => it.exerciseId === e.id));
  const easier = e.easier ? getExercise(e.easier) : undefined;
  const harder = e.harder ? getExercise(e.harder) : undefined;
  const favorite = state.favorites.includes(e.id);

  const remove = () => {
    if (usedBy.length) return toast.warning(`Övningen används hos ${usedBy.map((p) => p.firstName).join(", ")}. Ta bort den från programmet först.`);
    update((d) => {
      d.customExercises = d.customExercises.filter((x) => x.id !== e.id);
      d.favorites = d.favorites.filter((x) => x !== e.id);
    });
    onClose();
    toast("Övningen är borttagen.");
  };

  return (
    <>
      <SheetDialog open onClose={onClose} title={e.custom ? "Egen övning" : "Övning"}>
        {e.media?.length ? <MediaGallery items={e.media} title={e.name} /> : <DemoPlayer pose={e.pose} />}
        <div className="flex items-center justify-between gap-3">
          <h2>{e.name}</h2>
          <Button
            variant="ghost"
            aria-pressed={favorite}
            aria-label="Favorit"
            onClick={() => update((d) => void (d.favorites = favorite ? d.favorites.filter((x) => x !== e.id) : [...d.favorites, e.id]))}
            className={cn("size-11 min-h-0 rounded-full border-0 bg-card p-0 shadow-[0_1px_3px_rgba(0,0,0,.18)]", favorite ? "text-warning" : "text-muted-foreground")}>
            <StarIcon weight={favorite ? "fill" : "regular"} className="size-4.5" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge dot={false}>{e.area}</Badge>
          <Badge variant="info" dot={false}>
            {e.position}
          </Badge>
          <Badge variant="warning" dot={false}>
            {LEVELS[e.level]}
          </Badge>
          {e.goals.map((g) => (
            <Badge key={g} variant="success" dot={false}>
              {g}
            </Badge>
          ))}
          {e.equipment
            .filter((x) => x !== "Ingen")
            .map((x) => (
              <Badge key={x} dot={false}>
                {x}
              </Badge>
            ))}
          <Badge dot={false}>Mäts i {e.unit === "sek" ? "sekunder" : "repetitioner"}</Badge>
        </div>
        {e.why && (
          <Alert variant="brand">
            <LightbulbIcon />
            <AlertTitle>Varför?</AlertTitle>
            <AlertDescription>{e.why}</AlertDescription>
          </Alert>
        )}
        <h3>Så gör du</h3>
        <StepList steps={e.steps} />
        <DoDont ok>{e.tip}</DoDont>
        {e.avoid && <DoDont ok={false}>{e.avoid}</DoDont>}
        {(easier || harder) && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[.9rem] text-muted-foreground">Varianter</span>
            {easier && (
              <Button variant="chip" size="chip-sm" onClick={() => onOpen(easier.id)}>
                <ArrowDownIcon className="size-4" /> Lättare: {easier.name}
              </Button>
            )}
            {harder && (
              <Button variant="chip" size="chip-sm" onClick={() => onOpen(harder.id)}>
                <ArrowUpIcon className="size-4" /> Svårare: {harder.name}
              </Button>
            )}
          </div>
        )}
        {(e.synonyms || e.diagnoses) && <p className="text-[.9rem] text-muted-foreground">Hittas även på: {`${e.synonyms} ${e.diagnoses}`.trim().split(" ").slice(0, 14).join(", ")}</p>}
        <Card className="p-4">
          <CardHeader className="mb-2">
            <CardTitle className="text-[1.05rem]">Lägg till i ett program</CardTitle>
            <CardDescription>
              {usedBy.length ? `Finns redan hos ${usedBy.map((p) => p.firstName).join(", ")}.` : "Används inte i något program än."} Välj en patient så öppnas programmet, där du justerar dos och sparar.
            </CardDescription>
          </CardHeader>
          <div className="flex flex-wrap gap-1.5">
            {patients.map((p) => {
              const has = usedBy.includes(p);
              return (
                <Button key={p.id} variant="chip" size="chip-sm" disabled={has} onClick={() => onAddToPatient(p.id)}>
                  {has ? <CheckIcon className="size-4" /> : <PlusIcon className="size-4" />}
                  {p.firstName}
                </Button>
              );
            })}
          </div>
        </Card>
        {e.custom && (
          <div className="flex gap-2.5">
            <Button size="sm" onClick={() => onEdit(e.id)}>
              <PencilSimpleIcon className="size-4.5" />
              Ändra övningen
            </Button>
            <Button size="sm" className="text-danger" onClick={() => setConfirmDelete(true)}>
              <TrashIcon className="size-4.5" />
              Ta bort
            </Button>
          </div>
        )}
      </SheetDialog>
      <ConfirmDialog open={confirmDelete} onOpenChange={setConfirmDelete} title="Ta bort övningen?" description={`${e.name} tas bort från din övningsbank. Det går inte att ångra.`} confirmLabel="Ta bort" destructive onConfirm={remove} />
    </>
  );
}
