import { PaperclipIcon, PaperPlaneRightIcon, PhoneIcon, PulseIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { AttachmentGrid } from "@/components/chat/AttachmentGrid";
import { MessageThread } from "@/components/chat/MessageThread";
import { FileButton } from "@/components/common/FileButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupTextarea } from "@/components/ui/input-group";
import type { MediaItem, Patient } from "@/data/types";
import { formatTime } from "@/lib/dates";
import { filesToMedia, isTouchDevice } from "@/lib/media";
import { adherence, painInfo, replyBy, replyByText, waitingMessage } from "@/lib/stats";
import { useApp } from "@/state/app-context";

const QUICK_REPLIES = [
  ["Bra jobbat", "Bra jobbat! Fortsätt som vanligt."],
  ["Minska belastningen", "Minska antalet repetitioner tills det inte gör ont, och hör av dig om det inte blir bättre."],
  ["Jag ringer dig", "Jag ringer upp dig så pratar vi om det."],
];

/** Conversation with one patient, from the physio's side. */
export function PhysioThread({ patient, showProfileLink }: { patient: Patient; showProfileLink?: boolean }) {
  const { update } = useApp();
  const [text, setText] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const a = adherence(patient),
    pain = painInfo(patient),
    waiting = waitingMessage(patient);
  const late = waiting && replyBy(waiting.time) < new Date();

  useEffect(() => {
    if (patient.unread) update((d) => void (d.patients[patient.id].unread = 0));
  }, [patient.id, patient.unread, update]);

  const send = (body: string, files: MediaItem[] = []) => {
    if (!body.trim() && !files.length) return false;
    update((d) => {
      const p = d.patients[patient.id];
      p.messages.push({ from: "physio", text: body.trim(), time: Date.now(), media: files });
      p.seenByPatient = false;
    });
    return true;
  };

  return (
    <div className="grid content-start gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <strong>{patient.name}</strong>
          <br />
          {waiting ? (
            <span className={`text-[.9rem] font-bold ${late ? "text-danger" : "text-warning-foreground"}`}>
              Väntar på svar sedan {formatTime(waiting.time)} · svara senast {replyByText(replyBy(waiting.time))}
            </span>
          ) : (
            <span className="text-[.9rem] text-muted-foreground">Inget obesvarat</span>
          )}
        </div>
        {showProfileLink && (
          <Button asChild size="sm">
            <Link to={`/fysio/patients/${patient.id}`}>Öppna profil</Link>
          </Button>
        )}
      </div>
      {patient.program.items.length > 0 && (
        <Alert variant="brand" className="text-[.9rem]">
          <PulseIcon />
          <AlertDescription>
            Senaste 14 dagarna:{" "}
            <strong>
              {a.done} av {a.plan} pass
            </strong>
            {pain && (
              <>
                , smärta senast <strong>{pain.last.pain}/10</strong> (gräns {patient.painLimit})
              </>
            )}
            .{patient.booking && ` Telefonmöte bokat: ${patient.booking}.`}
          </AlertDescription>
        </Alert>
      )}
      <MessageThread messages={patient.messages} me="physio" otherName={patient.firstName} />
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {QUICK_REPLIES.map(([label, reply]) => (
          <Button key={label} variant="chip" size="chip" className="flex-none" onClick={() => setText(reply)}>
            {label}
          </Button>
        ))}
      </div>
      <InputGroup>
        <InputGroupTextarea aria-label={`Svara ${patient.firstName}`} placeholder={`Skriv ett svar till ${patient.firstName}`} value={text} onChange={(e) => setText(e.target.value)} />
        <InputGroupAddon align="block-end" className="flex-wrap">
          <FileButton multiple onFiles={(files) => setMedia((m) => [...m, ...filesToMedia(files).items])}>
            <PaperclipIcon className="size-4.5" />
            {isTouchDevice() ? "Filma eller bifoga" : "Bifoga video eller bild"}
          </FileButton>
          <Button
            variant="default"
            size="sm"
            className="ml-auto"
            onClick={() => {
              if (send(text, media)) {
                setText("");
                setMedia([]);
                toast.success("Svar skickat.");
              }
            }}>
            <PaperPlaneRightIcon className="size-4.5" />
            Skicka svar
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <AttachmentGrid items={media} onRemove={(i) => setMedia(media.filter((_, k) => k !== i))} />
      <div className="flex flex-wrap gap-2.5">
        <Button
          onClick={() => {
            send("Jag ringer upp dig så pratar vi om det.");
            toast.success(`Svar skickat. Kom ihåg att ringa ${patient.firstName}.`);
          }}>
          <PhoneIcon className="size-4.5" />
          Ring upp i stället
        </Button>
      </div>
    </div>
  );
}
