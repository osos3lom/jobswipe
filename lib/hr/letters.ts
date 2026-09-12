import type { Employee, LocalizedText } from './types'
import { formatDate, formatSAR } from './format'
import { startOfToday, toISODate } from './dates'

export type LetterType = 'salary' | 'experience' | 'embassy'

export interface HrLetterData {
  id: string
  employee: Employee
  type: LetterType
  addressedTo: string
  includeSalary: boolean
  issueDate: string
  refNumber: string
}

export function generateRefNumber(empId: string, type: LetterType): string {
  const code = type === 'salary' ? 'SAL' : type === 'experience' ? 'EXP' : 'EMB'
  return `REF-WND-${code}-2026-${empId.toUpperCase()}`
}

export function getLetterTitle(type: LetterType): LocalizedText {
  switch (type) {
    case 'salary':
      return { en: 'Salary & Employment Certificate', ar: 'شهادة تعريف بالراتب والوظيفة' }
    case 'experience':
      return { en: 'Certificate of Service & Experience', ar: 'شهادة خدمة وخبرة مهنية' }
    case 'embassy':
      return { en: 'Embassy Visa Introduction Letter', ar: 'خطاب تعريف لطلب تأشيرة سفر' }
  }
}
