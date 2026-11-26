import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ExerciseDetailDialog } from "@/components/exercise/ExerciseDetailDialog";
import { ExerciseLibrary, type BankTab } from "@/components/exercise/library/ExerciseLibrary";
import { NewExerciseDialog } from "@/components/exercise/NewExerciseDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp, useExercises } from "@/state/app-context";

type Editor = { name: string } | { editId: string };

export function ExerciseBankPage() {
  const { state, update } = useApp();
  const { exercises, getExercise } = useExercises();
  const navigate = useNavigate();
  const [tab, setTab] = useState<BankTab>("alla");
  const [viewing, setViewing] = useState<string | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const editing = editor && "editId" in editor ? getExercise(editor.editId) : undefined;

  const tabs: { value: BankTab; label: string; count: number }[] = [
    { value: "alla", label: "Alla övningar", count: exercises.length },
    { value: "fav", label: "Favoriter", count: state.favorites.filter((id) => getExercise(id)).length },
    { value: "egna", label: "Mina egna", count: state.customExercises.length },
  ];

  const addToPatient = (patientId: string) => {
    const e = viewing && getExercise(viewing);
    if (!e) return;
    update((d) => void (d.recent = [e.id, ...d.recent.filter((x) => x !== e.id)].slice(0, 8)));
    navigate(`/fysio/patients/${patientId}/program`, { state: { add: e.id } });
    toast.success(`${e.name} är tillagd i ${state.patients[patientId].firstName}s program. Justera dosen och spara.`);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Övningsbank</h1>
          <p className="text-muted-foreground">Sök, spara favoriter och skapa egna övningar. Allt här kan användas för alla dina patienter.</p>
        </div>
        <Button variant="default" onClick={() => setEditor({ name: "" })}>
          <Plus /> Ny övning
        </Button>
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as BankTab)}>
        <TabsList variant="line" className="h-auto w-full justify-start gap-1 rounded-none border-b-2 p-0">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="-mb-0.5 min-h-12 flex-none rounded-none border-0 border-b-[3px] border-transparent px-3.5 py-3 text-base font-bold text-muted-foreground after:hidden data-active:border-brand data-active:text-brand">
              {t.label}
              <Badge dot={false} variant="secondary" className="font-medium">
                {t.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <ExerciseLibrary mode="bank" tab={tab} onOpen={setViewing} onCreate={(name) => setEditor({ name })} />

      {viewing && !editor && <ExerciseDetailDialog exerciseId={viewing} onClose={() => setViewing(null)} onOpen={setViewing} onEdit={(editId) => setEditor({ editId })} onAddToPatient={addToPatient} />}
      {editor && (
        <NewExerciseDialog
          editing={editing}
          initialName={"name" in editor ? editor.name : ""}
          onClose={() => setEditor(null)}
          onSaved={(e) => {
            setEditor(null);
            if (editing) {
              setViewing(e.id);
              toast.success("Ändringarna är sparade.");
            } else {
              setTab("egna");
              toast.success(`${e.name} är sparad i övningsbanken.`);
            }
          }}
        />
      )}
    </>
  );
}
