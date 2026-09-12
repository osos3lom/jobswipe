import { daysUntil } from './dates'
import type {
  ContractStatus,
  DocumentAlert,
  DocumentAlertType,
  Employee,
  NitaqatBand,
  NitaqatThreshold,
} from './types'

/**
 * Illustrative Nitaqat bands for a medium-sized wholesale & distribution enterprise.
 * Real thresholds depend on Qiwa activity classification and workforce size.
 */
export const NITAQAT_THRESHOLDS: NitaqatThreshold[] = [
  {
    band: 'red',
    name: { en: 'Red Band', ar: 'النطاق الأحمر' },
    minRate: 0,
    maxRate: 0.2599,
    color: 'bg-destructive',
  },
  {
    band: 'low_green',
    name: { en: 'Low Green', ar: 'الأخضر المنخفض' },
    minRate: 0.26,
    maxRate: 0.3399,
    color: 'bg-success/60',
  },
  {
    band: 'medium_green',
    name: { en: 'Medium Green', ar: 'الأخضر المتوسط' },
    minRate: 0.34,
    maxRate: 0.4199,
    color: 'bg-success/80',
  },
  {
    band: 'high_green',
    name: { en: 'High Green', ar: 'الأخضر المرتفع' },
    minRate: 0.42,
    maxRate: 0.4999,
    color: 'bg-success',
  },
  {
    band: 'platinum',
    name: { en: 'Platinum', ar: 'النطاق البلاتيني' },
    minRate: 0.50,
    maxRate: 1.0,
    color: 'bg-primary',
  },
]

export interface NitaqatAnalysis {
  saudiCount: number
  nonSaudiCount: number
  totalEmployees: number
  currentRate: number
  currentBand: NitaqatThreshold
  nextBand?: NitaqatThreshold
  saudiHiresNeededToAdvance: number
  safeExpatHiresBuffer: number // how many expats can be hired before falling a band
  thresholds: NitaqatThreshold[]
}

/**
 * Evaluates current Saudization against illustrative Nitaqat bands and computes
 * hiring gaps to advance to the next tier or maintain standing.
 */
export function calculateNitaqat(
  employees: Employee[],
  thresholds = NITAQAT_THRESHOLDS,
): NitaqatAnalysis {
  const saudiCount = employees.filter((e) => e.nationality === 'SA').length
  const totalEmployees = employees.length
  const nonSaudiCount = totalEmployees - saudiCount
  const currentRate = totalEmployees > 0 ? saudiCount / totalEmployees : 0

  // Determine current band
  const currentBand =
    thresholds.find((t) => currentRate >= t.minRate && currentRate <= t.maxRate) ||
    (currentRate >= 0.50 ? thresholds[thresholds.length - 1] : thresholds[0])

  const currentIndex = thresholds.findIndex((t) => t.band === currentBand.band)
  const nextBand = currentIndex < thresholds.length - 1 ? thresholds[currentIndex + 1] : undefined

  // Formula: (S + h) / (T + h) >= targetRate
  // => h >= (targetRate * T - S) / (1 - targetRate)
  let saudiHiresNeededToAdvance = 0
  if (nextBand) {
    const target = nextBand.minRate
    if (target < 1) {
      saudiHiresNeededToAdvance = Math.max(
        0,
        Math.ceil((target * totalEmployees - saudiCount) / (1 - target)),
      )
    }
  }

  // If Platinum, how many non-Saudis can we add before falling below currentBand.minRate?
  // S / (T + e) >= minRate => T + e <= S / minRate => e <= S / minRate - T
  let safeExpatHiresBuffer = 0
  if (currentBand.minRate > 0) {
    safeExpatHiresBuffer = Math.max(
      0,
      Math.floor(saudiCount / currentBand.minRate - totalEmployees),
    )
  }

  return {
    saudiCount,
    nonSaudiCount,
    totalEmployees,
    currentRate,
    currentBand,
    nextBand,
    saudiHiresNeededToAdvance,
    safeExpatHiresBuffer,
    thresholds,
  }
}

export type ExpiryFilter = 'all' | 'expired' | '30' | '60' | '90'
export type DocTypeFilter = 'all' | DocumentAlertType

/**
 * Extracts and consolidates all document alerts across Iqamas, Passports, and Qiwa Contracts,
 * sorted expired-first, followed by closest expiry date.
 */
export function getDocumentAlerts(
  employees: Employee[],
  filter: ExpiryFilter = 'all',
  typeFilter: DocTypeFilter = 'all',
): DocumentAlert[] {
  const alerts: DocumentAlert[] = []

  for (const emp of employees) {
    // 1. Non-Saudi Iqama Expiry
    if (emp.nationality !== 'SA' && emp.iqamaExpiry) {
      const days = daysUntil(emp.iqamaExpiry)
      alerts.push({
        id: `${emp.id}-iqama`,
        employee: emp,
        type: 'iqama',
        title: { en: 'Resident Identity (Iqama)', ar: 'هوية مقيم (إقامة)' },
        documentNumber: `24${emp.id.replace('e', '')}710293`,
        expiryDate: emp.iqamaExpiry,
        daysLeft: days,
        severity: days < 0 ? 'destructive' : days <= 60 ? 'warning' : 'neutral',
      })
    }

    // 2. Passport Expiry (All employees)
    if (emp.passportExpiry) {
      const days = daysUntil(emp.passportExpiry)
      alerts.push({
        id: `${emp.id}-passport`,
        employee: emp,
        type: 'passport',
        title: { en: 'Passport', ar: 'جواز السفر' },
        documentNumber: `P0${emp.id.replace('e', '')}84912`,
        expiryDate: emp.passportExpiry,
        daysLeft: days,
        severity: days < 0 ? 'destructive' : days <= 60 ? 'warning' : 'neutral',
      })
    }

    // 3. Qiwa Employment Contract Expiry / Status
    if (emp.contractExpiry || emp.contractStatus === 'expired') {
      const expiry = emp.contractExpiry || emp.hireDate
      const days = daysUntil(expiry)
      alerts.push({
        id: `${emp.id}-contract`,
        employee: emp,
        type: 'contract',
        title: { en: 'Qiwa Employment Contract', ar: 'عقد عمل منصة قوى' },
        documentNumber: `QW-${emp.id.toUpperCase()}-2026`,
        expiryDate: expiry,
        daysLeft: days,
        severity: days < 0 || emp.contractStatus === 'expired' ? 'destructive' : days <= 60 ? 'warning' : 'neutral',
      })
    }
  }

  // Apply document type filter
  let filtered = typeFilter === 'all' ? alerts : alerts.filter((a) => a.type === typeFilter)

  // Apply days filter
  if (filter === 'expired') {
    filtered = filtered.filter((a) => a.daysLeft < 0)
  } else if (filter === '30') {
    filtered = filtered.filter((a) => a.daysLeft <= 30)
  } else if (filter === '60') {
    filtered = filtered.filter((a) => a.daysLeft <= 60)
  } else if (filter === '90') {
    filtered = filtered.filter((a) => a.daysLeft <= 90)
  }

  // Sort: expired first (most expired first), then ascending days left
  return filtered.sort((a, b) => a.daysLeft - b.daysLeft)
}
