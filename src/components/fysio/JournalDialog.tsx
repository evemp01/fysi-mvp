import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SheetDialog } from "@/components/common/Sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { Patient } from "@/data/types";
import { journalText } from "@/lib/stats";
import { useExercises } from "@/state/app-context";

/** Summary text to paste into the medical record. */
export function JournalDialog({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const { getExercise } = useExercises();
  const [notes, setNotes] = useState(true);
  const [flags, setFlags] = useState(true);
  const text = journalText(patient, getExercise, { notes, flags });
  const copy = () =>
    navigator.clipboard.writeText(text).then(
      () => toast.success("Kopierat."),
      () => toast.warning("Markera texten och kopiera manuellt."),
    );
  return (
    <SheetDialog open onClose={onClose} title="Exportera till journal">
      <p className="text-[.9rem] text-muted-foreground">Kopiera och klistra in i journalsystemet. Texten är skriven för att kunna användas som underlag vid en uppföljning utan återbesök.</p>
      <FieldGroup className="flex-row flex-wrap gap-x-5 gap-y-2">
        <Field orientation="horizontal" className="w-auto">
          <Checkbox id="journal-notes" checked={notes} onCheckedChange={(v) => setNotes(v === true)} />
          <FieldLabel htmlFor="journal-notes" className="font-medium">
            Ta med mina anteckningar
          </FieldLabel>
        </Field>
        <Field orientation="horizontal" className="w-auto">
          <Checkbox id="journal-flags" checked={flags} onCheckedChange={(v) => setFlags(v === true)} />
          <FieldLabel htmlFor="journal-flags" className="font-medium">
            Ta med patientens flaggor
          </FieldLabel>
        </Field>
      </FieldGroup>
      <Textarea readOnly aria-label="Journaltext" className="min-h-65" value={text} />
      <Button variant="default" onClick={copy}>
        <Copy className="size-4.5" />
        Kopiera text
      </Button>
    </SheetDialog>
  );
}
