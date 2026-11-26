import { useState } from "react";
import { SheetDialog } from "@/components/common/Sheet";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TODAY, addDays, capitalize, formatLong, weekday } from "@/lib/dates";

/** Next six weekday call slots. */
function upcomingSlots() {
  const slots: string[] = [];
  for (let d = addDays(TODAY, 1); slots.length < 6; d = addDays(d, 1)) if (weekday(d) < 5) slots.push(`${capitalize(formatLong(d))} kl 10:30`, `${capitalize(formatLong(d))} kl 14:00`);
  return slots;
}

export function BookCallDialog({ onClose, onBook }: { onClose: () => void; onBook: (slot: string) => void }) {
  const [slot, setSlot] = useState<string | null>(null);
  return (
    <SheetDialog open onClose={onClose} title="Boka telefonmöte">
      <p>Välj en tid. Erik ringer upp dig på numret du har i journalen.</p>
      <RadioGroup value={slot ?? ""} onValueChange={setSlot} aria-label="Tid för telefonmöte" className="gap-2">
        {upcomingSlots().map((s, i) => (
          <FieldLabel key={s} htmlFor={`slot-${i}`}>
            <Field orientation="horizontal">
              <RadioGroupItem value={s} id={`slot-${i}`} />
              <FieldTitle className="font-semibold">{s}</FieldTitle>
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      <Button variant="default" className="w-full" disabled={!slot} onClick={() => slot && onBook(slot)}>
        Boka tiden
      </Button>
    </SheetDialog>
  );
}
