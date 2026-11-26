import { CameraIcon, PaperclipIcon, PaperPlaneRightIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { FileButton } from "@/components/common/FileButton";
import { PainSummary } from "@/components/pain/PainSummary";
import { PainTypeIcon } from "@/components/pain/PainTypeIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupTextarea } from "@/components/ui/input-group";
import type { MediaItem, Message, PainReport } from "@/data/types";
import { filesToMedia, isTouchDevice } from "@/lib/media";
import { AttachmentGrid } from "./AttachmentGrid";
import { PainReportDialog } from "./PainReportDialog";

interface Props {
  initialText: string;
  /** Open the pain dialog straight away ("Det gör ont"). */
  startWithPain?: boolean;
  onSend: (message: Omit<Message, "from" | "time">) => void;
  onCancel: () => void;
}

export function PatientComposer({ initialText, startWithPain, onSend, onCancel }: Props) {
  const [text, setText] = useState(initialText);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [pain, setPain] = useState<PainReport | null>(null);
  const [painOpen, setPainOpen] = useState(!!startWithPain);

  const addFiles = (files: File[]) => {
    const { items, skipped } = filesToMedia(files);
    setMedia((m) => [...m, ...items]);
    if (skipped) toast(`${skipped} fil${skipped > 1 ? "er" : ""} hoppades över (fel format eller över 300 MB).`);
  };
  const send = () => {
    if (!text.trim() && !media.length && !pain) return toast.warning("Skriv något först.");
    onSend({ text: text.trim(), media, pain });
  };

  return (
    <Card className="grid gap-2.5">
      <Field>
        <FieldLabel htmlFor="patient-message">Ditt meddelande till Erik</FieldLabel>
        <InputGroup>
          <InputGroupTextarea id="patient-message" autoFocus placeholder="Beskriv kort vad du undrar över" value={text} onChange={(e) => setText(e.target.value)} />
          <InputGroupAddon align="block-end" className="flex-wrap">
            <Button size="sm" onClick={() => setPainOpen(true)}>
              <PainTypeIcon type="Huggande" size={20} />
              Beskriv din smärta
            </Button>
            {isTouchDevice() && (
              <FileButton capture onFiles={addFiles}>
                <CameraIcon className="size-4.5" />
                Filma eller fota
              </FileButton>
            )}
            <FileButton multiple onFiles={addFiles}>
              <PaperclipIcon className="size-4.5" />
              Bifoga video eller bild
            </FileButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <AttachmentGrid items={media} onRemove={(i) => setMedia(media.filter((_, k) => k !== i))} />
      {pain && (
        <div>
          <PainSummary report={pain} />
          <Button variant="link" size="inline-sm" onClick={() => setPain(null)}>
            Ta bort smärtbeskrivningen
          </Button>
        </div>
      )}
      <div className="flex gap-2.5">
        <Button variant="default" onClick={send}>
          <PaperPlaneRightIcon className="size-4.5" />
          Skicka
        </Button>
        <Button onClick={onCancel}>Avbryt</Button>
      </div>
      {painOpen && (
        <PainReportDialog
          onClose={() => setPainOpen(false)}
          onAttach={(r) => {
            setPain(r);
            setPainOpen(false);
          }}
        />
      )}
    </Card>
  );
}
