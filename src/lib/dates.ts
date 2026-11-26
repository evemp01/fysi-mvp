const pad = (n: number) => String(n).padStart(2, '0')

export const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
const MONTHS_LONG = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december']
export const DAYS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']
const DAYS_LONG = ['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag']

/** YYYY-MM-DD in local time. */
export const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const fromKey = (k: string) => {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}
export const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
/** Monday = 0 … Sunday = 6 */
export const weekday = (d: Date) => (d.getDay() + 6) % 7
export const weekStart = (d: Date) => addDays(d, -weekday(d))
export const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 864e5)

export const TODAY = (() => {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  return d
})()
export const TODAY_KEY = toKey(TODAY)

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
export const formatShort = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`
export const formatLong = (d: Date) => `${DAYS_LONG[weekday(d)]} ${d.getDate()} ${MONTHS_LONG[d.getMonth()]}`
export const formatTime = (t: number) => {
  const d = new Date(t)
  return `${formatShort(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
export const formatClock = (sec: number) => `${Math.floor(sec / 60)}:${pad(Math.max(0, sec) % 60)}`
export const agoText = (days: number | null) =>
  days == null ? '–' : days === 0 ? 'I dag' : days === 1 ? 'I går' : `${days} dagar sedan`

/** Relative day name used in reminders and reply deadlines. */
export const dayLabel = (d: Date) => {
  const k = toKey(d)
  if (k === TODAY_KEY) return 'i dag'
  if (k === toKey(addDays(TODAY, 1))) return 'i morgon'
  return formatLong(d)
}
