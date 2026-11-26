import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { MediaItem } from "@/data/types";
import { MediaView } from "./MediaView";

/** Swipeable list of images and videos. */
export function MediaGallery({ items, title }: { items: MediaItem[]; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  if (items.length === 1) return <MediaView item={items[0]} title={title} />;

  const go = (dir: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: el.scrollLeft + dir * el.clientWidth, behavior: "smooth" });
  };
  return (
    <div className="grid gap-2">
      <div ref={track} className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl scrollbar-none" onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}>
        {items.map((item, i) => (
          <div key={i} className="grid flex-[0_0_100%] snap-start content-center">
            <MediaView item={item} title={title} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <Button size="sm" onClick={() => go(-1)}>
          <CaretLeftIcon className="size-4.5" /> Föregående
        </Button>
        <span className="text-[.9rem] text-muted-foreground">
          {index + 1} av {items.length}
        </span>
        <Button size="sm" onClick={() => go(1)}>
          Nästa <CaretRightIcon className="size-4.5" />
        </Button>
      </div>
    </div>
  );
}
