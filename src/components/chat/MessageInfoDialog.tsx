import { Info, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SheetDialog } from "@/components/common/Sheet";
import { Button } from "@/components/ui/button";

/** Shown once before the patient's first message: what messages are for, reply times, emergencies. */
export function MessageInfoDialog({ onClose, onContinue, onBook }: { onClose: () => void; onContinue: () => void; onBook: () => void }) {
  return (
    <SheetDialog open onClose={onClose} title="Innan du skriver">
      <Alert variant="warning" className="text-[1.08rem]">
        <Info />
        <AlertTitle>Meddelanden är till för viktiga frågor</AlertTitle>
        <AlertDescription>Om din träning, till exempel om en övning gör ont eller om du är osäker på hur den görs.</AlertDescription>
      </Alert>
      <p>
        <strong>Erik svarar vanligtvis inom 2 arbetsdagar</strong> (vardagar). Ibland går det fortare.
      </p>
      <p>Har du många frågor? Ett telefonmöte går ofta snabbare.</p>
      <Alert variant="danger">
        <TriangleAlert />
        <AlertTitle>Akut?</AlertTitle>
        <AlertDescription>Ring 1177 för sjukvårdsrådgivning eller 112 vid nödläge. Vänta inte på svar här.</AlertDescription>
      </Alert>
      <Button variant="default" className="w-full" onClick={onContinue}>
        Jag förstår, skriv meddelande
      </Button>
      <Button className="w-full" onClick={onBook}>
        Boka telefonmöte i stället
      </Button>
    </SheetDialog>
  );
}
