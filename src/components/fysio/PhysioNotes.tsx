import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup } from "@/components/ui/item";
import type { Patient } from "@/data/types";
import { formatTime } from "@/lib/dates";
import { useApp } from "@/state/app-context";

/** The physio's private notes about a patient. */
export function PhysioNotes({ patient }: { patient: Patient }) {
  const { update } = useApp();
  const [text, setText] = useState("");
  const notes = patient.physioNotes;

  const add = () => {
    if (!text.trim()) return toast.warning("Skriv något först.");
    update((d) => void d.patients[patient.id].physioNotes.push({ text: text.trim(), time: Date.now() }));
    setText("");
    toast.success("Anteckningen är sparad.");
  };
  const remove = (index: number) => {
    const removed = notes[index];
    update((d) => void d.patients[patient.id].physioNotes.splice(index, 1));
    toast("Anteckningen är borttagen.", {
      action: { label: "Ångra", onClick: () => update((d) => void d.patients[patient.id].physioNotes.splice(index, 0, removed)) },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mina anteckningar om {patient.firstName}</CardTitle>
        <CardDescription>Bara du ser dem. Följer med i journalexporten om du vill.</CardDescription>
      </CardHeader>
      <CardContent>
        {notes.length > 0 && (
          <ItemGroup className="gap-2">
            {notes
              .map((n, i) => ({ n, i }))
              .reverse()
              .map(({ n, i }) => (
                <Item key={n.time} size="sm" className="bg-brand-soft">
                  <ItemContent>
                    <span>{n.text}</span>
                    <ItemDescription>{formatTime(n.time)}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button variant="link" size="inline-sm" onClick={() => remove(i)}>
                      Ta bort
                    </Button>
                  </ItemActions>
                </Item>
              ))}
          </ItemGroup>
        )}
        <InputGroup>
          <InputGroupTextarea aria-label="Ny anteckning" className="min-h-13" placeholder="T.ex. Telefonuppföljning: knät stabilare, fortsätter samma program" value={text} onChange={(e) => setText(e.target.value)} />
          <InputGroupAddon align="inline-end" className="self-end pb-1.5">
            <InputGroupButton size="sm" variant="default" onClick={add}>
              Spara
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </CardContent>
    </Card>
  );
}
