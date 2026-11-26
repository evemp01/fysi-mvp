import { useState } from "react";
import { SheetDialog } from "@/components/common/Sheet";
import { PainPicker } from "@/components/pain/PainPicker";
import { VasScale } from "@/components/pain/VasScale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PainReport } from "@/data/types";

/** Describe pain (VAS, where, how) to attach to a message. */
export function PainReportDialog({ onClose, onAttach }: { onClose: () => void; onAttach: (report: PainReport) => void }) {
  const [pain, setPain] = useState<number | null>(null);
  const [area, setArea] = useState<string[]>([]);
  const [type, setType] = useState<string[]>([]);

  return (
    <SheetDialog open onClose={onClose} title="Beskriv din smärta">
      <p className="text-muted-foreground">Skickas med ditt meddelande, så att Erik ser hur och var det gör ont utan att du behöver komma in.</p>
      <Card className="p-4">
        <h4>Hur ont har du just nu?</h4>
        <p className="text-[.9rem] text-muted-foreground">0 = ingen smärta, 10 = värsta tänkbara</p>
        <VasScale
          value={pain}
          onChange={(v) => {
            setPain(v);
            if (!v) {
              setArea([]);
              setType([]);
            }
          }}
        />
        {!!pain && (
          <PainPicker
            area={area}
            type={type}
            onChange={(v) => {
              setArea(v.area);
              setType(v.type);
            }}
          />
        )}
      </Card>
      <Button variant="default" size="xl" className="w-full" disabled={pain == null} onClick={() => pain != null && onAttach({ pain, area, type })}>
        Bifoga till meddelandet
      </Button>
    </SheetDialog>
  );
}
