import { LEVELS } from '@/data/exercises'
import { TEMPLATES } from '@/data/templates'
import type { Exercise } from '@/data/types'

/** Exercise search that understands synonyms, Latin, diagnoses and typos. */

const normalize = (s: string) => s.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/é/g, 'e')
const STOP_WORDS = new Set(['for', 'och', 'i', 'pa', 'med', 'ovning', 'ovningar', 'en', 'ett', 'av', 'vid', 'till', 'som', 'mot', 'det', 'den'])

function levenshtein(a: string, b: string) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    prev = cur
  }
  return prev[b.length]
}

/** How well a query word matches a token, 0–1. */
function tokenMatch(q: string, t: string) {
  if (t === q) return 1
  if (q.length === 3 && t.length === 3 && q.slice(0, 2) === t.slice(0, 2)) return 0.5
  if (q.length >= 3 && t.startsWith(q)) return 0.7
  if (t.length >= 4 && q.startsWith(t) && q.length - t.length <= 3) return 0.75
  if (q.length >= 4 && t.includes(q)) return 0.6
  if (q.length >= 4 && Math.abs(q.length - t.length) <= 2 && levenshtein(q, t) <= (q.length >= 7 ? 2 : 1)) return 0.5
  if (q.length >= 5 && t.length > q.length && levenshtein(q, t.slice(0, q.length)) <= 1) return 0.45
  return 0
}

type Field = 'name' | 'synonym' | 'tag' | 'diagnosis' | 'area' | 'meta'
const fieldsOf = (e: Exercise): [string, number, Field][] => [
  [e.name, 10, 'name'],
  [e.synonyms, 6, 'synonym'],
  [e.tags, 5, 'tag'],
  [e.diagnoses, 4, 'diagnosis'],
  [e.area, 3, 'area'],
  [[e.position, ...e.equipment, ...e.goals, LEVELS[e.level]].join(' '), 2, 'meta'],
]

export interface SearchHit {
  exercise: Exercise
  why?: string
}
export interface SearchResult {
  hits: SearchHit[]
  /** No exercise matched every word; showing closest. */
  partial: boolean
  /** Typo-corrected words, shown as "Visar träffar för …". */
  corrections: string[]
  /** Template indexes that fit the query. */
  templates: number[]
}

export function searchExercises(query: string, exercises: Exercise[]): SearchResult | null {
  const words = query.toLowerCase().split(/[\s,;/]+/).map(normalize).filter((w) => w && !STOP_WORDS.has(w))
  if (!words.length) return null
  const scored = []
  for (const exercise of exercises) {
    let total = 0, hits = 0, whyScore = 0
    let why: string | undefined
    const fuzzy: string[] = []
    for (const w of words) {
      let best = 0, bestField: Field | null = null, bestToken = '', bestScore = 0
      for (const [text, weight, field] of fieldsOf(exercise))
        for (const t of text.toLowerCase().split(/[\s,;/()]+/)) {
          if (!t) continue
          const sc = tokenMatch(w, normalize(t))
          if (sc && sc * weight > best) { best = sc * weight; bestField = field; bestToken = t; bestScore = sc }
        }
      if (!best) continue
      hits++
      total += best
      if (bestField !== 'name' && bestField !== 'area' && bestField !== 'meta' && best > whyScore) {
        whyScore = best
        why = bestField === 'diagnosis' ? `Vid ${bestToken}` : bestField === 'synonym' ? `Synonym: ${bestToken}` : `Sökord: ${bestToken}`
      }
      if (bestScore <= 0.5) fuzzy.push(bestToken)
    }
    if (hits) scored.push({ exercise, total, hits, why, fuzzy })
  }
  const all = scored.filter((x) => x.hits === words.length)
  const list = (all.length ? all : scored).sort((a, b) => b.hits - a.hits || b.total - a.total)
  return {
    hits: list.map(({ exercise, why }) => ({ exercise, why })),
    partial: !all.length && scored.length > 0,
    corrections: [...new Set(list.slice(0, 3).flatMap((x) => x.fuzzy))].slice(0, 3),
    templates: TEMPLATES.map((_, i) => i).filter((i) => words.some((w) => TEMPLATES[i].keywords.split(' ').some((k) => tokenMatch(w, normalize(k)) >= 0.75))),
  }
}

export interface Filters {
  area: string
  position: string[]
  equipment: string[]
  level: string[]
  goal: string[]
}
export const EMPTY_FILTERS: Filters = { area: 'Alla', position: [], equipment: [], level: [], goal: [] }
export const filterCount = (f: Filters) => f.position.length + f.equipment.length + f.level.length + f.goal.length

export const matchesFilters = (e: Exercise, f: Filters) =>
  (f.area === 'Alla' || e.area === f.area) &&
  (!f.position.length || f.position.includes(e.position)) &&
  (!f.equipment.length || f.equipment.some((x) => e.equipment.includes(x))) &&
  (!f.level.length || f.level.includes(LEVELS[e.level])) &&
  (!f.goal.length || f.goal.some((x) => e.goals.includes(x)))
