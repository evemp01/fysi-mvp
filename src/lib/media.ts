import type { MediaItem } from '@/data/types'

/** Uploaded files become in-memory object URLs (the prototype has no backend). */
export function filesToMedia(files: File[]) {
  const items: MediaItem[] = []
  let skipped = 0
  for (const file of files) {
    const image = file.type.startsWith('image/'), video = file.type.startsWith('video/')
    if ((!image && !video) || (image && file.size > 15e6) || (video && file.size > 300e6)) {
      skipped++
      continue
    }
    items.push({ kind: image ? 'image' : 'video', url: URL.createObjectURL(file), name: file.name })
  }
  return { items, skipped }
}

export function youtubeId(url: string) {
  return url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/)?.[1] ?? null
}

/** YouTube or https link → media item, or null if the text isn't a usable link. */
export function linkToMedia(text: string): MediaItem | null {
  const url = text.trim()
  const id = youtubeId(url)
  if (id) return { kind: 'youtube', id }
  if (/^https:\/\/\S+\.\S+/.test(url)) return { kind: 'link', url }
  return null
}

export const hasVideo = (media?: MediaItem[]) => !!media?.some((m) => m.kind !== 'image')

/** Phones get "film/photo" buttons that open the camera. */
export const isTouchDevice = () => matchMedia('(pointer: coarse)').matches
