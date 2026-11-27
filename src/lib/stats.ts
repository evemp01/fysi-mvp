import type { Exercise, ExerciseResult, Patient, Program, ProgramItem, Reminder, SessionLog, Tone } from '@/data/types'
import { TODAY, TODAY_KEY, addDays, dayLabel, daysBetween, fromKey, toKey, weekStart, weekday } from './dates'

/* Derived numbers for a patient: adherence, pain trend, weeks, reminders. */

export const isDaily = (p: Pick<Program, 'frequency'>) => p.frequency === 'day'

export const frequencyText = (p: Program) =>
  isDaily(p) ? (p.perDay === 1 ? '1 gång om dagen' : `${p.perDay} gånger om dagen`) : p.perWeek === 1 ? '1 pass i veckan' : `${p.perWeek} pass i veckan`

export const doseText = (item: Pick<ProgramItem, 'sets' | 'reps'>, exercise?: Exercise) =>
  `${item.sets} set × ${item.reps} ${exercise?.unit === 'sek' ? 'sek' : 'rep'}`

const amountDone = (r?: ExerciseResult) => (r ? r.sets.reduce((a, b) => a + b, 0) : 0)

/** Share (0–1) of the prescribed amount done for one exercise. */
export const shareDone = (item: ProgramItem, r?: ExerciseResult) => (r ? Math.min(1, amountDone(r) / (item.sets * item.reps)) : 0)

/** Share (0–1) of the whole session done. */
export const sessionVolume = (p: Patient, log: SessionLog) => {
  const items = p.program.items
  if (!items.length) return 1
  return items.reduce((s, it) => s + shareDone(it, log.items[it.exerciseId]), 0) / items.length
}

export const logsOn = (p: Patient, key: string) => p.logs.filter((l) => l.date === key)
export const logsBetween = (p: Patient, from: Date, to: Date) => p.logs.filter((l) => l.date >= toKey(from) && l.date <= toKey(to))
export const sessionsThisWeek = (p: Patient) => logsBetween(p, weekStart(TODAY), addDays(weekStart(TODAY), 6)).length

/** Sessions logged beyond the plan, in the day (daily programs) or week containing `dateKey`. */
export function extraSessions(p: Patient, dateKey: string) {
  if (isDaily(p.program)) return Math.max(0, logsOn(p, dateKey).length - (p.program.perDay || 1))
  const from = weekStart(fromKey(dateKey))
  return Math.max(0, logsBetween(p, from, addDays(from, 6)).length - p.program.perWeek)
}

export const programWeek = (p: Patient) =>
  p.since ? Math.min(p.weeks, Math.floor(daysBetween(weekStart(fromKey(p.since)), TODAY) / 7) + 1) : 0

export const programEnd = (p: Patient) => (p.since ? addDays(weekStart(fromKey(p.since)), p.weeks * 7 - 1) : null)

/** Planned sessions in program week w (the first week may be partial). */
export const weekPlan = (p: Patient, w: number) => {
  const per = p.program.perWeek
  if (w !== 1 || !p.since) return per
  return Math.max(1, Math.round((per * (7 - weekday(fromKey(p.since)))) / 7))
}

export const weekRange = (p: Patient, w: number) => {
  const from = addDays(weekStart(fromKey(p.since!)), (w - 1) * 7)
  return { from, to: addDays(from, 6) }
}

export function adherence(p: Patient, days = 14) {
  let from = addDays(TODAY, -(days - 1))
  if (p.since && fromKey(p.since) > from) from = fromKey(p.since)
  const plan = Math.max(1, Math.round((p.program.perWeek * (daysBetween(from, TODAY) + 1)) / 7))
  const logs = logsBetween(p, from, TODAY)
  return {
    plan,
    done: logs.length,
    pct: p.since && p.program.items.length ? Math.min(100, Math.round((logs.length / plan) * 100)) : null,
    volume: logs.length ? Math.round((logs.reduce((s, l) => s + sessionVolume(p, l), 0) / logs.length) * 100) : null,
    from,
    logs,
  }
}

/**
 * Adherence per program week, matching the week chart: finished weeks count (extra sessions
 * are capped at the plan), the current week is reported separately since it isn't over yet.
 */
export function weekAdherence(p: Patient) {
  const current = programWeek(p)
  let done = 0
  let plan = 0
  const logs: SessionLog[] = []
  for (let w = 1; w < current; w++) {
    const { from, to } = weekRange(p, w)
    const inWeek = logsBetween(p, from, to)
    done += Math.min(inWeek.length, weekPlan(p, w))
    plan += weekPlan(p, w)
    logs.push(...inWeek)
  }
  const now = current ? logsBetween(p, weekRange(p, current).from, weekRange(p, current).to).length : 0
  return {
    done,
    plan,
    finishedWeeks: Math.max(0, current - 1),
    pct: plan && p.program.items.length ? Math.round((done / plan) * 100) : null,
    volume: logs.length ? Math.round((logs.reduce((s, l) => s + sessionVolume(p, l), 0) / logs.length) * 100) : null,
    current: { week: current, done: now, plan: current ? weekPlan(p, current) : 0 },
  }
}

export function painInfo(p: Patient) {
  const series = p.logs.filter((l): l is SessionLog & { pain: number } => l.pain != null).sort((a, b) => (a.date < b.date ? -1 : 1))
  if (!series.length) return null
  const avg = (a: { pain: number }[]) => a.reduce((s, l) => s + l.pain, 0) / a.length
  const recent = series.slice(-3), before = series.slice(-6, -3)
  return { first: series[0], last: series[series.length - 1], trend: before.length ? avg(recent) - avg(before) : 0, series }
}

export interface FlagEntry { date: string; exerciseId: string | null; flag: string | null; comment: string }
export function flags(p: Patient, days = 21): FlagEntry[] {
  const from = toKey(addDays(TODAY, -days))
  const out: FlagEntry[] = []
  for (const l of p.logs) {
    if (l.date < from) continue
    for (const [exerciseId, r] of Object.entries(l.items)) if (r.flag || r.comment) out.push({ date: l.date, exerciseId, flag: r.flag, comment: r.comment })
    if (l.note) out.push({ date: l.date, exerciseId: null, flag: null, comment: l.note })
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function patientStatus(p: Patient): [string, Tone] {
  if (!p.program.items.length) return ['Inget program', 'info']
  const pi = painInfo(p)
  if (pi && pi.last.pain > p.painLimit) return ['Över smärtgräns', 'danger']
  if (pi && pi.trend > 0.5) return ['Smärta ökar', 'warning']
  const a = weekAdherence(p)
  if (a.pct != null && a.pct < 60) return ['Låg följsamhet', 'warning']
  return ['På spår', 'success']
}

export const daysSinceLastSession = (p: Patient) => (p.logs.length ? daysBetween(fromKey(p.logs[p.logs.length - 1].date), TODAY) : null)

export function weekSeries(p: Patient) {
  if (!p.since) return []
  return Array.from({ length: programWeek(p) }, (_, i) => {
    const w = i + 1
    const { from, to } = weekRange(p, w)
    const logs = logsBetween(p, from, to)
    const withPain = logs.filter((l) => l.pain != null)
    return { week: w, sessions: logs.length, goal: weekPlan(p, w), pain: withPain.length ? withPain.reduce((x, l) => x + (l.pain ?? 0), 0) / withPain.length : null }
  })
}

/** Last message if it's from the patient and still unanswered. */
export const waitingMessage = (p: Patient) => {
  const m = p.messages[p.messages.length - 1]
  return m && m.from === 'patient' ? m : null
}

/** Reply deadline: two working days later, 16:00. */
export function replyBy(time: number) {
  const x = new Date(time)
  for (let n = 0; n < 2; ) {
    x.setDate(x.getDate() + 1)
    if (x.getDay() !== 0 && x.getDay() !== 6) n++
  }
  x.setHours(16, 0, 0, 0)
  return x
}
export const replyByText = (d: Date) => `${dayLabel(d)} kl 16`

export function reminderText(p: Patient, r: Reminder = p.reminder) {
  if (!r.on) return 'Påminnelser är avstängda'
  const [hh, mm] = r.time.split(':').map(Number)
  const now = new Date()
  for (let i = 0; i < 8; i++) {
    const d = addDays(TODAY, i)
    d.setHours(hh, mm, 0, 0)
    if (!r.days.includes(weekday(d)) || d < now) continue
    if (r.onlyIfNotTrained && i === 0 && logsOn(p, TODAY_KEY).length) continue
    return `Nästa påminnelse ${dayLabel(d)} kl ${r.time}`
  }
  return 'Inga påminnelsedagar valda'
}

export function journalText(p: Patient, getExercise: (id: string) => Exercise | undefined, opts: { notes: boolean; flags: boolean }) {
  const a = adherence(p), w = weekAdherence(p), pi = painInfo(p)
  const count = (list: string[]) => list.reduce<Record<string, number>>((acc, x) => ((acc[x] = (acc[x] ?? 0) + 1), acc), {})
  const areas = count(a.logs.flatMap((l) => l.area))
  const types = count(a.logs.flatMap((l) => l.type))
  const efforts = count(a.logs.flatMap((l) => (l.effort ? [l.effort] : [])))
  const lines = [
    `Hemträning, sammanfattning ${TODAY_KEY}`,
    `Patient: ${p.name}, ${p.age} år. ${p.diagnosis}.`,
    `Program vecka ${programWeek(p)} av ${p.weeks} (${frequencyText(p.program)}, smärtgräns ${p.painLimit}/10): ${p.program.items.map((it) => `${getExercise(it.exerciseId)?.name} ${doseText(it, getExercise(it.exerciseId))}`).join('; ')}.`,
    `Genomförda pass, avslutade veckor: ${w.finishedWeeks ? `${w.done} av ${w.plan} planerade (${w.pct} %)${w.volume != null ? `, i snitt ${w.volume} % av ordinerad mängd per pass` : ''}` : 'ingen vecka avslutad än'}. Vecka ${w.current.week} pågår: ${w.current.done} av ${w.current.plan} pass.`,
    `Upplevd ansträngning: ${Object.entries(efforts).map(([k, v]) => `${k.toLowerCase()} ${v}`).join(', ') || '–'}.`,
    `Smärta (VAS): ${pi ? `start ${pi.first.pain}/10, senast ${pi.last.pain}/10, trend ${pi.trend > 0.5 ? 'ökande' : pi.trend < -0.5 ? 'minskande' : 'stabil'}` : 'ej loggad'}.`,
    `Smärtlokalisation: ${Object.keys(areas).join(', ') || '–'}. Karaktär: ${Object.keys(types).join(', ') || '–'}.`,
  ]
  if (opts.notes && p.physioNotes.length) lines.push(`Fysioterapeutens anteckningar: ${p.physioNotes.map((n) => `${toKey(new Date(n.time))}: ${n.text}`).join(' | ')}.`)
  if (opts.flags)
    lines.push(`Flaggat av patienten: ${flags(p, 14).map((f) => `${f.date} ${f.exerciseId ? getExercise(f.exerciseId)?.name : 'passet'}${f.flag ? ` (${f.flag})` : ''}${f.comment ? `: ${f.comment}` : ''}`).join(' | ') || '–'}`)
  return lines.join('\n')
}

/** VAS colour from green (0) to red (10). */
export const vasColor = (v: number) => `hsl(${140 - 13.5 * v} 62% ${74 - v * 1.2}%)`
