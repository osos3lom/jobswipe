import type { ExperienceLevel, LocalizedText } from '@/lib/types'

export type DepartmentId = 'exec' | 'hr' | 'finance' | 'sales' | 'ops' | 'it' | 'cs'
export type Nationality = 'SA' | 'EG' | 'IN' | 'PK' | 'PH' | 'JO' | 'SY'
export type EmployeeStatus = 'active' | 'on_leave' | 'onboarding'
export type WorkCity = 'riyadh' | 'jeddah' | 'dammam'

export type ApplicantStage =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'

export interface ApplicantNote {
  id: string
  author: string
  text: string
  createdAt: string // ISO date/time
}

export interface Applicant {
  id: string
  jobId: string
  name: LocalizedText
  headline: LocalizedText
  city: WorkCity | 'remote'
  skills: string[]
  experience: ExperienceLevel
  expectedSalary: number
  stage: ApplicantStage
  appliedAt: string // ISO date
  notes: ApplicantNote[]
  source: 'app' | 'referral' | 'linkedin' | 'direct'
  email: string
  phone: string
  cvSummary: LocalizedText
  avatar?: string
}

export interface Department {
  id: DepartmentId
  name: LocalizedText
}

// Monthly amounts in SAR.
export interface SalaryPackage {
  basic: number
  housing: number
  transport: number
}

export interface Employee {
  id: string
  name: LocalizedText
  title: LocalizedText
  department: DepartmentId
  managerId?: string
  nationality: Nationality
  gender: 'male' | 'female'
  city: WorkCity
  email: string
  hireDate: string // ISO date
  status: EmployeeStatus
  salary: SalaryPackage
  iqamaExpiry?: string // ISO date; non-Saudi residents only
}

export interface Company {
  name: LocalizedText
  industry: LocalizedText
  city: WorkCity
  payDay: number // day of the month salaries are paid
  adminId: string // the HR admin persona the console is "signed in" as
}

export type AdditionType = 'overtime' | 'bonus' | 'allowance' | 'commission' | 'other'
export type DeductionType = 'unpaid_leave' | 'advance' | 'loan' | 'violation' | 'other'

export interface PayrollAdjustment {
  id: string
  type: AdditionType | DeductionType
  amount: number
  label: LocalizedText
}

export interface PayrollLine {
  employeeId: string
  basic: number
  housing: number
  transport: number
  additions: PayrollAdjustment[]
  deductions: PayrollAdjustment[]
  gosiEmployee: number
  gosiEmployer: number
  gross: number
  net: number
  employerCost: number
}

export interface PayrollSettings {
  gosiSaudiEmployee: number // illustrative e.g. 0.0975 (9.75%)
  gosiSaudiEmployer: number // illustrative e.g. 0.1175 (11.75%)
  gosiExpatEmployee: number // illustrative e.g. 0.00 (0%)
  gosiExpatEmployer: number // illustrative e.g. 0.02 (2.0%)
  gosiCap: number // SAR 45,000 illustrative max contributory wage
}

export interface PayrollRunTotals {
  totalGross: number
  totalNet: number
  totalAdditions: number
  totalDeductions: number
  totalEmployeeGosi: number
  totalEmployerGosi: number
  totalEmployerCost: number
  employeeCount: number
}

export interface PayrollRun {
  id: string
  periodMonth: string // e.g. '2026-09'
  payDate: string // e.g. '2026-09-27'
  status: 'draft' | 'submitted'
  submittedAt?: string
  lines: PayrollLine[]
  totals: PayrollRunTotals
}

export interface HrState {
  company: Company
  employees: Employee[]
  payrollRuns: PayrollRun[]
  payrollSettings: PayrollSettings
  applicants: Applicant[]
}
