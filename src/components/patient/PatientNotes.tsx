import { PencilSimpleIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup } from "@/components/ui/item";
import type { Patient } from "@/data/types";
import { formatShort } from "@/lib/dates";
import { useApp } from "@/state/app-context";

/** The patient's own notes on one exercise. */
export function PatientNotes({ patient, exerciseId }: { patient: Patient; exerciseId: string }) {
  const { update } = useApp();
  const [text, setText] = useState("");
  const notes = patient.patientNotes[exerciseId] ?? [];

  const add = () => {
    if (!text.trim()) return toast.warning("Skriv något först.");
    update((d) => {
      const p = d.patients[patient.id];
      (p.patientNotes[exerciseId] ??= []).push({ text: text.trim(), time: Date.now() });
    });
    setText("");
    toast.success("Anteckningen är sparad.");
  };
  const remove = (index: number) => {
    const removed = notes[index];
    update((d) => void d.patients[patient.id].patientNotes[exerciseId].splice(index, 1));
    toast("Anteckningen är borttagen.", {
      action: { label: "Ångra", onClick: () => update((d) => void d.patients[patient.id].patientNotes[exerciseId].splice(index, 0, removed)) },
    });
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <PencilSimpleIcon className="size-4.5" />
          Mina anteckningar
        </CardTitle>
        <CardDescription>Saker du vill komma ihåg. Bara du ser dem. Vill du fråga Erik något, tryck på Fråga.</CardDescription>
      </CardHeader>
      <CardContent>
        {notes.length > 0 && (
          <ItemGroup className="gap-2">
            {notes.map((n, i) => (
              <Item key={n.time} size="sm" className="bg-warning-soft">
                <ItemContent>
                  <span>{n.text}</span>
                  <ItemDescription>{formatShort(new Date(n.time))}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="link" size="inline-sm" onClick={() => remove(i)} aria-label="Ta bort anteckningen">
                    Ta bort
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
        <InputGroup>
          <InputGroupTextarea aria-label="Ny anteckning" className="min-h-17.5" placeholder="T.ex. Lägg en kudde på stolen, då blir det lagom djupt" value={text} onChange={(e) => setText(e.target.value)} />
          <InputGroupAddon align="block-end">
            <InputGroupButton size="sm" variant="outline" onClick={add}>
              <PlusIcon className="size-4" />
              Spara anteckning
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </CardContent>
    </Card>
  );
}
