import { CameraIcon, LinkSimpleIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { AttachmentGrid } from "@/components/chat/AttachmentGrid";
import { FileButton } from "@/components/common/FileButton";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import type { MediaItem } from "@/data/types";
import { filesToMedia, isTouchDevice, linkToMedia } from "@/lib/media";

/** The physio's own video/photo of an exercise for one patient. */
export function ItemMediaBox({ media, patientName, onChange }: { media: MediaItem[]; patientName: string; onChange: (media: MediaItem[]) => void }) {
  const [link, setLink] = useState("");
  const addFiles = (files: File[]) => {
    const { items } = filesToMedia(files);
    onChange([...media, ...items]);
    toast(items.length ? `${items.length === 1 ? "Filen är tillagd." : `${items.length} filer tillagda.`} Glöm inte att spara programmet.` : "Inga filer kunde läggas till.");
  };
  const addLink = () => {
    const item = linkToMedia(link);
    if (!item) return toast.warning("Klistra in en länk som börjar med https://");
    onChange([...media, item]);
    setLink("");
    toast.success("Videon är tillagd. Glöm inte att spara programmet.");
  };
  return (
    <div className="grid gap-2 rounded-[14px] border border-dashed bg-background px-3 py-2.5">
      <span className="text-[.9rem] font-bold">
        Egen video eller bild till {patientName} <span className="font-medium text-muted-foreground">(valfritt)</span>
      </span>
      {media.length ? (
        <AttachmentGrid small items={media} onRemove={(i) => onChange(media.filter((_, k) => k !== i))} />
      ) : (
        <span className="text-[.9rem] text-muted-foreground">Filma {patientName} under besöket, så ser hen exakt hur du visade övningen. Visas före standardinstruktionen.</span>
      )}
      <div className="flex flex-wrap gap-1.5">
        {isTouchDevice() && (
          <FileButton primary capture onFiles={addFiles}>
            <CameraIcon className="size-4.5" />
            Filma
          </FileButton>
        )}
        <FileButton multiple onFiles={addFiles}>
          <UploadSimpleIcon className="size-4.5" />
          Ladda upp
        </FileButton>
        <InputGroup className="min-h-10.5 w-auto min-w-52 flex-1">
          <InputGroupAddon>
            <LinkSimpleIcon />
          </InputGroupAddon>
          <InputGroupInput inputMode="url" aria-label="YouTube-länk" placeholder="eller klistra in YouTube-länk" value={link} onChange={(e) => setLink(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLink()} />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="sm" variant="outline" className="min-h-8" onClick={addLink}>
              Lägg till
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}
