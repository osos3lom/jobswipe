import type { Lang } from './types'

export function formatSalary(min: number, max: number, lang: Lang) {
  const fmt = (n: number) => new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US').format(n)
  return `${fmt(min)}–${fmt(max)} ${lang === 'ar' ? 'ريال' : 'SAR'}`
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function scoreColor(score: number) {
  if (score >= 75) return 'var(--color-success)'
  if (score >= 50) return 'var(--color-primary)'
  return 'var(--color-accent)'
}
