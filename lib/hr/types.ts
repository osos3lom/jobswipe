import type { ExperienceLevel, LocalizedText } from '@/lib/types'
export type { ExperienceLevel, LocalizedText }


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
  nationality: Nationality
  gender: 'male' | 'female'
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

export type ContractStatus = 'authenticated' | 'pending' | 'expired'

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
  iban: string // Fictional, non-routable Saudi IBAN
  passportExpiry?: string // ISO date
  contractStatus: ContractStatus // Qiwa contract status
  contractExpiry?: string // ISO date
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
  timeOffRequests: TimeOffRequest[]
  onboardingTasks: OnboardingTask[]
  benefits: Record<string, EmployeeBenefit>
  performanceReviews: PerformanceReview[]
  ramadanHoursEnabled: boolean
}

// ---------------- Time Off (Saudi Labor Law) ----------------
export type LeaveType =
  | 'annual'
  | 'sick'
  | 'maternity'
  | 'paternity'
  | 'marriage'
  | 'bereavement'
  | 'hajj'
  | 'unpaid'

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected'

export interface TimeOffRequest {
  id: string
  employeeId: string
  type: LeaveType
  startDate: string // ISO date
  endDate: string // ISO date
  daysCount: number
  status: LeaveRequestStatus
  reason?: string
  createdAt: string // ISO date
  reviewedAt?: string
  reviewedBy?: string
}

export interface LeaveBalance {
  type: LeaveType
  totalDays: number
  usedDays: number
  pendingDays: number
  availableDays: number
  legalNote?: LocalizedText
}

// ---------------- Onboarding ----------------
export type OnboardingCategory = 'hr' | 'it' | 'docs' | 'team'

export interface OnboardingTask {
  id: string
  employeeId: string
  title: LocalizedText
  description?: LocalizedText
  category: OnboardingCategory
  owner: string
  completed: boolean
  dueDate: string // ISO date
  completedAt?: string
}

export interface OfferLetterTemplate {
  employeeId: string
  title: LocalizedText
  startDate: string
  basic: number
  housing: number
  transport: number
  signedAt?: string
  signedBy?: string
}

// ---------------- Benefits & EOSB (CCHI & Saudi Labor Law) ----------------
export type InsuranceTier = 'vip' | 'class_a' | 'class_b' | 'class_c'

export interface EmployeeBenefit {
  employeeId: string
  insuranceTier: InsuranceTier
  network: string
  dependentsCount: number
  policyNumber: string
  deductiblePercentage: number
  maxCoverageLimit: number
}

export type SeparationReason = 'resignation' | 'contract_expiry' | 'termination' | 'force_majeure'

export interface EosbResult {
  serviceYears: number
  serviceMonths: number
  serviceDays: number
  totalYearsFraction: number
  monthlyWage: number // basic + housing
  tier1Amount: number // first 5 years: 0.5 month per year
  tier2Amount: number // after 5 years: 1.0 month per year
  grossEosb: number
  resignationMultiplier: number // 0, 1/3, 2/3, 1
  separationReason: SeparationReason
  netEosb: number
  isIllustrative: boolean
}

// ---------------- Performance (OKRs & Competencies) ----------------
export interface SmartGoal {
  id: string
  title: LocalizedText
  targetMetric: string
  progress: number // 0 - 100
  status: 'on_track' | 'at_risk' | 'completed'
}

export interface PerformanceReview {
  id: string
  employeeId: string
  cycle: string // e.g. 'Q3 2026'
  rating: number // 1 to 5
  feedback: string
  reviewerId: string
  updatedAt: string
  goals: SmartGoal[]
}

// ---------------- Compliance & Nitaqat ----------------
export type NitaqatBand = 'platinum' | 'high_green' | 'medium_green' | 'low_green' | 'red'

export interface NitaqatThreshold {
  band: NitaqatBand
  name: LocalizedText
  minRate: number
  maxRate: number
  color: string
}

export type DocumentAlertType = 'iqama' | 'passport' | 'contract'

export interface DocumentAlert {
  id: string
  employee: Employee
  type: DocumentAlertType
  title: LocalizedText
  documentNumber?: string
  expiryDate: string
  daysLeft: number
  severity: 'destructive' | 'warning' | 'neutral'
}

