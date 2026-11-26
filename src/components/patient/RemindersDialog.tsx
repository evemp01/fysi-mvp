import { Bell } from "lucide-react";
import { Chip } from "@/components/common/Chip";
import { Alert } from "@/components/ui/alert";
import { SheetDialog } from "@/components/common/Sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import type { Patient, Reminder } from "@/data/types";
import { DAYS } from "@/lib/dates";
import { reminderText } from "@/lib/stats";
import { useApp } from "@/state/app-context";

export function RemindersDialog({ patient, open, onClose }: { patient: Patient; open: boolean; onClose: () => void }) {
  const { update } = useApp();
  const r = patient.reminder;
  const set = (changes: Partial<Reminder>) => update((d) => Object.assign(d.patients[patient.id].reminder, changes));
  const toggleDay = (i: number) => set({ days: r.days.includes(i) ? r.days.filter((x) => x !== i) : [...r.days, i].sort() });

  return (
    <SheetDialog open={open} onClose={onClose} title="Påminnelser">
      <Card className="p-4">
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="reminder-on">Påminn mig om att träna</FieldLabel>
              <FieldDescription>Du bestämmer själv, och kan stänga av när du vill.</FieldDescription>
            </FieldContent>
            <Switch id="reminder-on" checked={r.on} onCheckedChange={(on) => set({ on })} />
          </Field>
          {r.on && (
            <>
              <Field>
                <FieldLabel htmlFor="reminder-time">Tid</FieldLabel>
                <Input id="reminder-time" type="time" value={r.time} onChange={(e) => e.target.value && set({ time: e.target.value })} className="max-w-40 text-[1.1rem]" />
              </Field>
              <FieldSet>
                <FieldLegend variant="label">Dagar</FieldLegend>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS.map((d, i) => (
                    <Chip key={d} size="sm" className="min-w-13" selected={r.days.includes(i)} onSelect={() => toggleDay(i)}>
                      {d}
                    </Chip>
                  ))}
                </div>
              </FieldSet>
              <Field orientation="horizontal">
                <Switch id="reminder-only" size="sm" checked={r.onlyIfNotTrained} onCheckedChange={(v) => set({ onlyIfNotTrained: v })} />
                <FieldLabel htmlFor="reminder-only" className="font-medium">
                  Påminn bara om jag inte redan har tränat den dagen
                </FieldLabel>
              </Field>
            </>
          )}
        </FieldGroup>
      </Card>
      <Alert variant="info" className="text-[.9rem]">
        <Bell />
        {reminderText(patient)}.
      </Alert>
      <p className="text-[.9rem] text-muted-foreground">I testversionen skickas inga riktiga notiser till mobilen.</p>
      <Button variant="default" className="w-full" onClick={onClose}>
        Klar
      </Button>
    </SheetDialog>
  );
}
