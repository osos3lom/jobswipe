import type { Lang } from '@/lib/types'

const locale = (lang: Lang) => (lang === 'ar' ? 'ar-SA' : 'en-US')

export function formatNumber(n: number, lang: Lang): string {
  return new Intl.NumberFormat(locale(lang)).format(n)
}

export function formatSAR(n: number, lang: Lang): string {
  return new Intl.NumberFormat(locale(lang), {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatPercent(rate: number, lang: Lang): string {
  return new Intl.NumberFormat(locale(lang), {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(rate)
}

// ar-SA defaults to the Umm al-Qura calendar, so Gregorian dates in Arabic
// need an explicit -u-ca-gregory.
export function formatDate(
  d: Date | string,
  lang: Lang,
  opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string {
  const dateObj = typeof d === 'string' ? new Date(d) : d
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-GB', opts).format(dateObj)
}

export function formatHijri(d: Date | string, lang: Lang): string {
  const dateObj = typeof d === 'string' ? new Date(d) : d
  return new Intl.DateTimeFormat(
    lang === 'ar' ? 'ar-SA-u-ca-islamic-umalqura' : 'en-US-u-ca-islamic-umalqura',
    { day: 'numeric', month: 'long', year: 'numeric' },
  ).format(dateObj)
}

// A day count as it reads after a preposition ("in 12 days" / "خلال ١٢ يومًا").
// Arabic number agreement: 1 and 2 have their own forms, 3–10 take the
// plural, 11 and up take the accusative singular.
export function formatDays(n: number, lang: Lang): string {
  const abs = Math.abs(n)
  const num = formatNumber(abs, lang)
  if (lang === 'en') return `${num} ${abs === 1 ? 'day' : 'days'}`
  if (abs === 1) return 'يوم واحد'
  if (abs === 2) return 'يومين'
  if (abs >= 3 && abs <= 10) return `${num} أيام`
  return `${num} يومًا`
}
