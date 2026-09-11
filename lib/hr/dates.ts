// Dates are stored as local ISO dates (yyyy-mm-dd). toISOString() is avoided
// because it converts to UTC and can shift the day in Saudi time (UTC+3).

const DAY_MS = 86_400_000

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function daysFromToday(days: number): string {
  const d = startOfToday()
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

// Negative when the date is in the past.
export function daysUntil(iso: string, from: Date = startOfToday()): number {
  return Math.round((parseISODate(iso).getTime() - from.getTime()) / DAY_MS)
}

export function nextPayday(payDay: number, from: Date = startOfToday()): Date {
  const onDay = (y: number, m: number) =>
    new Date(y, m, Math.min(payDay, new Date(y, m + 1, 0).getDate()))
  const thisMonth = onDay(from.getFullYear(), from.getMonth())
  return thisMonth >= from ? thisMonth : onDay(from.getFullYear(), from.getMonth() + 1)
}
