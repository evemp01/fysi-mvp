import { XIcon } from "lucide-react";
import { MediaThumb } from "@/components/exercise/MediaView";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentGroup, AttachmentMedia } from "@/components/ui/attachment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MediaItem } from "@/data/types";
import { cn } from "@/lib/utils";

interface AttachmentGridProps {
  items: MediaItem[];
  onRemove: (index: number) => void;
  /** Show "cover" on the first item and a "make cover" button on the rest. */
  onMakeCover?: (index: number) => void;
  small?: boolean;
}

/** Thumbnails of picked images/videos with a remove button. */
export function AttachmentGrid({ items, onRemove, onMakeCover, small }: AttachmentGridProps) {
  if (!items.length) return null;
  return (
    <AttachmentGroup className="flex-wrap overflow-visible">
      {items.map((item, i) => (
        <Attachment key={i} orientation="vertical" className={cn("border-0 bg-transparent p-0!", small ? "w-20" : "w-26")}>
          <AttachmentMedia variant="image" className="relative rounded-xl bg-brand-soft opacity-100">
            <MediaThumb item={item} />
          </AttachmentMedia>
          <AttachmentActions className="top-1! right-1!">
            <AttachmentAction aria-label="Ta bort" onClick={() => onRemove(i)} className="bg-black/60 text-white hover:bg-black/70 hover:text-white">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
          {onMakeCover &&
            (i === 0 ? (
              <Badge variant="warning" dot={false} className="absolute bottom-1 left-1 z-20 rounded-lg bg-warning text-[.75rem] text-[#2a1a00]">
                Omslag
              </Badge>
            ) : (
              <Button variant="ghost" onClick={() => onMakeCover(i)} className="absolute bottom-1 left-1 z-20 h-auto min-h-7 rounded-lg border-0 bg-white/90 px-2 py-0.5 text-[.75rem] text-foreground">
                Gör till omslag
              </Button>
            ))}
        </Attachment>
      ))}
    </AttachmentGroup>
  );
}
