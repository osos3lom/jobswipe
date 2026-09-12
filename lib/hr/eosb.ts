import { startOfToday } from './dates'
import type { Employee, EosbResult, SeparationReason } from './types'

/**
 * Saudi Labor Law Articles 84 & 85 End of Service Benefit (EOSB) Calculator
 *
 * Article 84:
 * Upon the end of the work relation, the employer shall pay to the worker an end-of-service
 * award calculated on the basis of half a month's wage for each of the first five years
 * and a month's wage for each of the following years. The worker shall be entitled to an
 * award for parts of the year in proportion to the time spent on the job.
 *
 * Article 85:
 * If the work relation ends due to the worker's resignation, he shall be entitled to:
 * - One-third of the award after a period of service not less than two consecutive years and not more than five years.
 * - Two-thirds if his service exceeds five consecutive years and not more than ten years.
 * - The full award if his service reaches ten years or more.
 * - (Less than 2 years of service yields no award in case of resignation).
 *
 * Wage used: Basic salary + Housing allowance (standard contributory wage under Saudi Labor Law).
 */
export function calculateEosb({
  hireDate,
  endDate = startOfToday(),
  basicSalary,
  housingAllowance,
  separationReason = 'resignation',
}: {
  hireDate: string | Date
  endDate?: string | Date
  basicSalary: number
  housingAllowance: number
  separationReason?: SeparationReason
}): EosbResult {
  const hire = typeof hireDate === 'string' ? new Date(hireDate) : hireDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate

  const diffMs = Math.max(0, end.getTime() - hire.getTime())
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const totalYearsFraction = totalDays / 365.25

  const serviceYears = Math.floor(totalYearsFraction)
  const remainingDays = totalDays - Math.floor(serviceYears * 365.25)
  const serviceMonths = Math.floor(remainingDays / 30.4375)
  const serviceDays = Math.max(0, Math.floor(remainingDays - serviceMonths * 30.4375))

  // Statutory wage base: basic + housing
  const monthlyWage = basicSalary + housingAllowance

  // Article 84 calculation
  const first5Years = Math.min(5, totalYearsFraction)
  const tier1Amount = first5Years * (monthlyWage * 0.5)

  const beyond5Years = Math.max(0, totalYearsFraction - 5)
  const tier2Amount = beyond5Years * monthlyWage

  const grossEosb = tier1Amount + tier2Amount

  // Article 85 resignation reduction multiplier
  let resignationMultiplier = 1
  if (separationReason === 'resignation') {
    if (totalYearsFraction < 2) {
      resignationMultiplier = 0
    } else if (totalYearsFraction < 5) {
      resignationMultiplier = 1 / 3
    } else if (totalYearsFraction < 10) {
      resignationMultiplier = 2 / 3
    } else {
      resignationMultiplier = 1
    }
  }

  const netEosb = Math.round(grossEosb * resignationMultiplier)

  return {
    serviceYears,
    serviceMonths,
    serviceDays,
    totalYearsFraction: Math.round(totalYearsFraction * 100) / 100,
    monthlyWage,
    tier1Amount: Math.round(tier1Amount),
    tier2Amount: Math.round(tier2Amount),
    grossEosb: Math.round(grossEosb),
    resignationMultiplier: Math.round(resignationMultiplier * 100) / 100,
    separationReason,
    netEosb,
    isIllustrative: true,
  }
}

export function calculateEmployeeEosb(
  employee: Employee,
  separationReason: SeparationReason = 'resignation',
  customEndDate?: string,
): EosbResult {
  return calculateEosb({
    hireDate: employee.hireDate,
    endDate: customEndDate ?? startOfToday(),
    basicSalary: employee.salary.basic,
    housingAllowance: employee.salary.housing,
    separationReason,
  })
}
