import { ChatCircleIcon, CheckIcon, PhoneIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { toast } from "sonner";
import { BookCallDialog } from "@/components/chat/BookCallDialog";
import { MessageInfoDialog } from "@/components/chat/MessageInfoDialog";
import { MessageThread } from "@/components/chat/MessageThread";
import { PatientComposer } from "@/components/chat/PatientComposer";
import { InitialsAvatar } from "@/components/common/InitialsAvatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { waitingMessage } from "@/lib/stats";
import { useApp, usePatient } from "@/state/app-context";

type Draft = { text: string; withPain?: boolean };

const QUICK: { label: string; draft: Draft }[] = [
  { label: "Det gör ont", draft: { text: "", withPain: true } },
  { label: "Hur gör jag?", draft: { text: "Jag är osäker på hur jag ska göra " } },
  { label: "Skicka video", draft: { text: "Här är en video på när jag gör övningen. Gör jag rätt? " } },
];

export function ChatPage() {
  const { state, update } = useApp();
  const patient = usePatient(useParams().patientId);
  const location = useLocation();
  const prefill = (location.state as { prefill?: string } | null)?.prefill;

  // A draft waits for the info dialog (shown once) before the composer opens.
  const [pending, setPending] = useState<Draft | null>(prefill != null && !state.messageInfoSeen ? { text: prefill } : null);
  const [composing, setComposing] = useState<Draft | null>(prefill != null && state.messageInfoSeen ? { text: prefill } : null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!patient.seenByPatient) update((d) => void (d.patients[patient.id].seenByPatient = true));
  }, [patient.id, patient.seenByPatient, update]);

  const startDraft = (draft: Draft) => (state.messageInfoSeen ? setComposing(draft) : setPending(draft));

  return (
    <>
      <Item variant="card">
        <ItemMedia>
          <InitialsAvatar>E</InitialsAvatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Erik Lund</ItemTitle>
          <ItemDescription>Din fysioterapeut · svarar vanligtvis inom 2 arbetsdagar</ItemDescription>
        </ItemContent>
      </Item>

      {patient.booking && (
        <Alert variant="success">
          <PhoneIcon />
          <AlertTitle>Telefonmöte bokat</AlertTitle>
          <AlertDescription>{patient.booking}. Erik ringer upp dig.</AlertDescription>
        </Alert>
      )}

      <MessageThread
        messages={patient.messages}
        me="patient"
        otherName="Erik, fysioterapeut"
        footer={
          waitingMessage(patient) && (
            <Marker className="justify-end">
              <MarkerIcon>
                <CheckIcon weight="bold" />
              </MarkerIcon>
              <MarkerContent>Skickat. Erik svarar vanligtvis inom 2 arbetsdagar.</MarkerContent>
            </Marker>
          )
        }
      />

      {composing ? (
        <PatientComposer
          key={composing.text}
          initialText={composing.text}
          startWithPain={composing.withPain}
          onCancel={() => setComposing(null)}
          onSend={(msg) => {
            update((d) => {
              const p = d.patients[patient.id];
              p.messages.push({ ...msg, from: "patient", time: Date.now() });
              p.unread++;
            });
            setComposing(null);
            toast.success("Skickat. Erik svarar vanligtvis inom 2 arbetsdagar.");
          }}
        />
      ) : (
        <>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5" aria-label="Snabbval">
            {QUICK.map((q) => (
              <Button key={q.label} variant="chip" size="chip" className="flex-none" onClick={() => startDraft(q.draft)}>
                {q.label}
              </Button>
            ))}
            <Button variant="chip" size="chip" className="flex-none" onClick={() => setBooking(true)}>
              Boka tid
            </Button>
          </div>
          <Button variant="default" className="w-full" onClick={() => startDraft({ text: "" })}>
            <ChatCircleIcon /> Skriv till Erik
          </Button>
        </>
      )}

      <p className="text-center text-[.9rem] text-muted-foreground">Akut? Ring 1177 eller 112. Vänta inte på svar här.</p>

      {pending && (
        <MessageInfoDialog
          onClose={() => setPending(null)}
          onContinue={() => {
            update((d) => void (d.messageInfoSeen = true));
            setComposing(pending);
            setPending(null);
          }}
          onBook={() => {
            setPending(null);
            setBooking(true);
          }}
        />
      )}
      {booking && (
        <BookCallDialog
          onClose={() => setBooking(false)}
          onBook={(slot) => {
            update((d) => void (d.patients[patient.id].booking = slot));
            setBooking(false);
            toast.success("Telefonmötet är bokat.");
          }}
        />
      )}
    </>
  );
}
