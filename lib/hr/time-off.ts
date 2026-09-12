import { startOfToday } from './dates'
import type { Employee, LeaveBalance, LeaveType, LocalizedText, TimeOffRequest } from './types'

export interface SaudiPublicHoliday {
  id: string
  name: LocalizedText
  gregorianDate: string // YYYY-MM-DD
  hijriNote?: LocalizedText
  durationDays: number
}

// Saudi Public Holidays for 2026 (illustrative & approximate for Hijri moon sightings)
export const SAUDI_PUBLIC_HOLIDAYS_2026: SaudiPublicHoliday[] = [
  {
    id: 'founding-day-2026',
    name: { en: 'Saudi Founding Day', ar: 'يوم التأسيس السعودي' },
    gregorianDate: '2026-02-22',
    durationDays: 1,
  },
  {
    id: 'eid-fitr-2026',
    name: { en: 'Eid al-Fitr Holiday', ar: 'إجازة عيد الفطر المبارك' },
    gregorianDate: '2026-03-20',
    hijriNote: { en: 'Shawwal 1–4, 1447H (Approx.)', ar: '١-٤ شوال ١٤٤٧هـ (تقريبي)' },
    durationDays: 4,
  },
  {
    id: 'eid-adha-2026',
    name: { en: 'Eid al-Adha Holiday', ar: 'إجازة عيد الأضحى المبارك' },
    gregorianDate: '2026-05-27',
    hijriNote: { en: 'Dhu al-Hijjah 9–12, 1447H (Approx.)', ar: '٩-١٢ ذو الحجة ١٤٤٧هـ (تقريبي)' },
    durationDays: 4,
  },
  {
    id: 'national-day-2026',
    name: { en: 'Saudi National Day (96th)', ar: 'اليوم الوطني السعودي (٩٦)' },
    gregorianDate: '2026-09-23',
    durationDays: 1,
  },
]

/**
 * Saudi Labor Law Article 109:
 * "A worker shall be entitled to a prepaid annual leave of not less than twenty-one days,
 * to be increased to a period of not less than thirty days if the worker spends five consecutive
 * years in the service of the employer."
 */
export function getAnnualLeaveEntitlement(hireDate: string, asOfDate: Date = startOfToday()): {
  entitlementDays: number
  isSeniorTenure: boolean
  tenureYears: number
} {
  const hire = new Date(hireDate)
  const diffTime = asOfDate.getTime() - hire.getTime()
  const tenureYears = Math.max(0, diffTime / (1000 * 60 * 60 * 24 * 365.25))
  const isSeniorTenure = tenureYears >= 5
  return {
    entitlementDays: isSeniorTenure ? 30 : 21,
    isSeniorTenure,
    tenureYears: Math.floor(tenureYears * 10) / 10,
  }
}

export const STATUTORY_LEAVE_TYPES: Record<
  LeaveType,
  {
    name: LocalizedText
    defaultAllowance: number
    legalRef: LocalizedText
    paidStatus: LocalizedText
  }
> = {
  annual: {
    name: { en: 'Annual Leave', ar: 'الإجازة السنوية' },
    defaultAllowance: 21, // becomes 30 if tenure >= 5 yrs
    legalRef: { en: 'Labor Law Art. 109 (21 or 30 days)', ar: 'المادة ١٠٩ من نظام العمل (٢١ أو ٣٠ يوماً)' },
    paidStatus: { en: 'Fully Paid', ar: 'مدفوعة بالكامل' },
  },
  sick: {
    name: { en: 'Sick Leave', ar: 'الإجازة المرضية' },
    defaultAllowance: 30, // Article 117 (30 full, 60 75%, 30 unpaid)
    legalRef: { en: 'Labor Law Art. 117 (Tiered up to 120d)', ar: 'المادة ١١٧ من نظام العمل (متدرجة حتى ١٢٠ يوماً)' },
    paidStatus: { en: 'Paid (Graduated)', ar: 'مدفوعة بنسب متدرجة' },
  },
  maternity: {
    name: { en: 'Maternity Leave', ar: 'إجازة وضع (أمومة)' },
    defaultAllowance: 70, // Article 151 (10 weeks)
    legalRef: { en: 'Labor Law Art. 151 (10 weeks)', ar: 'المادة ١٥١ من نظام العمل (١٠ أسابيع)' },
    paidStatus: { en: 'Fully Paid', ar: 'مدفوعة بالكامل' },
  },
  paternity: {
    name: { en: 'Paternity Leave', ar: 'إجازة مولود (أبوة)' },
    defaultAllowance: 3,
    legalRef: { en: 'Labor Law Art. 113 (3 days)', ar: 'المادة ١١٣ من نظام العمل (٣ أيام)' },
    paidStatus: { en: 'Fully Paid', ar: 'مدفوعة بالكامل' },
  },
  marriage: {
    name: { en: 'Marriage Leave', ar: 'إجازة زواج' },
    defaultAllowance: 5,
    legalRef: { en: 'Labor Law Art. 113 (5 days)', ar: 'المادة ١١٣ من نظام العمل (٥ أيام)' },
    paidStatus: { en: 'Fully Paid', ar: 'مدفوعة بالكامل' },
  },
  bereavement: {
    name: { en: 'Bereavement Leave', ar: 'إجازة وفاة (عزاء)' },
    defaultAllowance: 5,
    legalRef: { en: 'Labor Law Art. 113 (5 days)', ar: 'المادة ١١٣ من نظام العمل (٥ أيام)' },
    paidStatus: { en: 'Fully Paid', ar: 'مدفوعة بالكامل' },
  },
  hajj: {
    name: { en: 'Hajj Leave', ar: 'إجازة حج' },
    defaultAllowance: 10,
    legalRef: { en: 'Labor Law Art. 114 (10–15 days once)', ar: 'المادة ١١٤ من نظام العمل (١٠-١٥ يوماً لمرة واحدة)' },
    paidStatus: { en: 'Fully Paid', ar: 'مدفوعة بالكامل' },
  },
  unpaid: {
    name: { en: 'Unpaid Leave', ar: 'إجازة بدون راتب' },
    defaultAllowance: 30,
    legalRef: { en: 'Labor Law Art. 116 (Mutual consent)', ar: 'المادة ١١٦ من نظام العمل (باتفاق الطرفين)' },
    paidStatus: { en: 'Unpaid', ar: 'غير مدفوعة' },
  },
}

/**
 * Calculate leave balances for an employee, reconciling with approved and pending requests.
 */
export function calculateEmployeeBalances(
  employee: Employee,
  requests: TimeOffRequest[],
): LeaveBalance[] {
  const { entitlementDays } = getAnnualLeaveEntitlement(employee.hireDate)
  const empRequests = requests.filter((r) => r.employeeId === employee.id)

  const leaveTypes: LeaveType[] = [
    'annual',
    'sick',
    'maternity',
    'paternity',
    'marriage',
    'bereavement',
    'hajj',
    'unpaid',
  ]

  return leaveTypes.map((type) => {
    const totalDays = type === 'annual' ? entitlementDays : STATUTORY_LEAVE_TYPES[type].defaultAllowance
    const usedDays = empRequests
      .filter((r) => r.type === type && r.status === 'approved')
      .reduce((sum, r) => sum + r.daysCount, 0)
    const pendingDays = empRequests
      .filter((r) => r.type === type && r.status === 'pending')
      .reduce((sum, r) => sum + r.daysCount, 0)
    const availableDays = Math.max(0, totalDays - usedDays - pendingDays)

    return {
      type,
      totalDays,
      usedDays,
      pendingDays,
      availableDays,
      legalNote: STATUTORY_LEAVE_TYPES[type].legalRef,
    }
  })
}

/**
 * Calculate working days (excluding Friday & Saturday standard Saudi weekend).
 */
export function calculateBusinessDays(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr)
  const end = new Date(endDateStr)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 0

  let count = 0
  const cur = new Date(start)
  while (cur <= end) {
    const day = cur.getDay()
    // 5 = Friday, 6 = Saturday (Saudi standard weekend)
    if (day !== 5 && day !== 6) {
      count++
    }
    cur.setDate(cur.getDate() + 1)
  }
  return Math.max(1, count)
}
