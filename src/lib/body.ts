import { REGIONS, REGION_GROUP, ZOOM_GROUPS, type BodyView } from '@/data/body'

/* Geometry helpers for the body map: sides, zoom groups and mirrored fine zones. */

export type Side = 'Höger' | 'Vänster'
export interface Zone { name: string; x: number; y: number; rx: number; ry: number }
export interface ZoomState { group: string; side: Side | null; view: BodyView }

export const sideOf = (name: string): Side | null => (name.startsWith('Höger') ? 'Höger' : name.startsWith('Vänster') ? 'Vänster' : null)

/** Zoom group a full-body region opens, or null if it's selected directly. */
export function groupOf(name: string) {
  if (['Nacke', 'Övre rygg', 'Ländrygg'].includes(name)) return 'back'
  const side = sideOf(name)
  return side ? REGION_GROUP[name.slice(side.length + 1)] ?? null : null
}

// Zones are written for one side; mirror them (x → 160 - x) for the other.
const mirrored = (view: BodyView, side: Side | null) => (view === 'fram' ? side === 'Vänster' : side === 'Höger')

export function zonesFor(group: string, side: Side | null, view: BodyView): Zone[] {
  const g = ZOOM_GROUPS[group]
  const list = g[view] ?? []
  if (g.mid) return list.map(([name, x, y, rx, ry]) => ({ name, x, y, rx, ry }))
  const mir = mirrored(view, side)
  return list.map(([name, x, y, rx, ry]) => ({ name: `${side} ${name}`, x: mir ? 160 - x : x, y, rx, ry }))
}

export function zoomBox(group: string, side: Side | null, view: BodyView) {
  const g = ZOOM_GROUPS[group]
  const [x, y, w, h] = g.box
  return !g.mid && mirrored(view, side) ? [160 - x - w, y, w, h] : g.box
}

/** Every fine zone by name, with the view/group/side it belongs to. */
export const ZONE_INDEX: Record<string, Zone & { view: BodyView; group: string; side: Side | null }> = {}
for (const group of Object.keys(ZOOM_GROUPS))
  for (const view of ['fram', 'bak'] as const)
    for (const side of ZOOM_GROUPS[group].mid ? [null] : (['Höger', 'Vänster'] as const))
      for (const z of zonesFor(group, side, view)) ZONE_INDEX[z.name] ??= { ...z, view, group, side }

const inRegions = (view: BodyView, name: string) => REGIONS[view].some((r) => r[0] === name)

/** Which side of the body figure a region/zone is drawn on. */
export const viewOf = (name: string): BodyView =>
  ZONE_INDEX[name] && !inRegions('fram', name) && !inRegions('bak', name) ? ZONE_INDEX[name].view : inRegions('bak', name) ? 'bak' : 'fram'

export function startZoom(region: string, view: BodyView): ZoomState | null {
  const group = groupOf(region)
  if (!group) return null
  const g = ZOOM_GROUPS[group]
  return { group, side: sideOf(region), view: g[view] ? view : g.fram ? 'fram' : 'bak' }
}
