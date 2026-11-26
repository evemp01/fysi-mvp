import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MediaItem } from "@/data/types";
import { VideoPlaceholder } from "./ExerciseThumbnail";

/** One image/video/link shown at full width. */
export function MediaView({ item, title }: { item: MediaItem; title: string }) {
  switch (item.kind) {
    case "image":
      return <img src={item.url} alt="" className="block max-h-110 w-full rounded-2xl bg-brand-soft object-contain" />;
    case "video":
      return <video src={item.url} controls playsInline className="block max-h-110 w-full rounded-2xl bg-black" />;
    case "youtube":
      return (
        <>
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#0b1514]">
            <iframe src={`https://www.youtube-nocookie.com/embed/${item.id}`} title={`Video: ${title}`} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="lazy" className="absolute inset-0 size-full border-0" />
          </div>
          <Button asChild size="sm" className="justify-self-start">
            <a href={`https://www.youtube.com/watch?v=${item.id}`} target="_blank" rel="noopener">
              <ExternalLink className="size-4" />
              Öppna videon på YouTube
            </a>
          </Button>
        </>
      );
    case "link":
      return (
        <Button asChild size="sm" className="flex-wrap justify-start gap-x-2 gap-y-1 text-left">
          <a href={item.url} target="_blank" rel="noopener">
            <Play className="size-4 fill-current" /> Öppna videon
            <span className="text-[.9rem] font-medium text-muted-foreground">{item.url.replace(/^https:\/\/(www\.)?/, "").slice(0, 40)}</span>
          </a>
        </Button>
      );
  }
}

/** Square thumbnail used in upload grids. */
export function MediaThumb({ item }: { item: MediaItem }) {
  if (item.kind === "image") return <img src={item.url} alt="" className="size-full object-cover" />;
  if (item.kind === "video")
    return (
      <>
        <video src={item.url} muted playsInline className="size-full object-cover" />
        <span className="pointer-events-none absolute inset-0 grid place-items-center text-white">
          <Play className="size-7 fill-current drop-shadow" />
        </span>
      </>
    );
  return <VideoPlaceholder label={item.kind === "youtube" ? "YouTube" : "Länk"} />;
}
