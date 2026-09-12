'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { daysFromToday, startOfToday, toISODate } from './dates'
import { createSeed } from './seed'
import type {
  ApplicantStage,
  DepartmentId,
  Employee,
  EmployeeBenefit,
  HrState,
  OnboardingTask,
  PayrollRun,
  PayrollSettings,
  PerformanceReview,
  TimeOffRequest,
} from './types'

// State for the employer console. Kept separate from the candidate store
// (lib/store.tsx) so each side of the demo can grow without touching the
// other. Bump KEY when the shape changes so old saved data is discarded.
const KEY = 'ihr.hr.v5'

interface HrContextValue {
  state: HrState | null // null until loaded from localStorage on the client
  resetHr: () => void
  updatePayrollSettings: (settings: Partial<PayrollSettings>) => void
  savePayrollRun: (run: PayrollRun) => void
  deletePayrollRun: (id: string) => void
  moveApplicantStage: (applicantId: string, stage: ApplicantStage) => void
  addApplicantNote: (applicantId: string, text: string, author?: string) => void
  hireApplicant: (
    applicantId: string,
    department?: DepartmentId,
  ) => Employee | null
  createTimeOffRequest: (
    request: Omit<TimeOffRequest, 'id' | 'createdAt' | 'status'>,
  ) => void
  approveTimeOffRequest: (id: string, reviewerId?: string) => void
  rejectTimeOffRequest: (id: string, reviewerId?: string) => void
  toggleOnboardingTask: (taskId: string) => void
  completeOnboarding: (employeeId: string) => void
  savePerformanceReview: (review: PerformanceReview) => void
  toggleRamadanHours: () => void
  updateEmployeeBenefit: (
    employeeId: string,
    benefit: Partial<EmployeeBenefit>,
  ) => void
}

const HrContext = createContext<HrContextValue | null>(null)

export function HrProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HrState | null>(null)

  useEffect(() => {
    let saved: Partial<HrState> | null = null
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) saved = JSON.parse(raw)
    } catch {
      // ignore corrupt storage
    }
    const seed = createSeed()
    if (saved) {
      setState({
        ...seed,
        ...saved,
        company: saved.company ?? seed.company,
        employees: saved.employees ?? seed.employees,
        payrollRuns: saved.payrollRuns ?? seed.payrollRuns,
        payrollSettings: saved.payrollSettings ?? seed.payrollSettings,
        applicants: saved.applicants ?? seed.applicants,
        timeOffRequests: saved.timeOffRequests ?? seed.timeOffRequests,
        onboardingTasks: saved.onboardingTasks ?? seed.onboardingTasks,
        benefits: saved.benefits ?? seed.benefits,
        performanceReviews: saved.performanceReviews ?? seed.performanceReviews,
        ramadanHoursEnabled: saved.ramadanHoursEnabled ?? seed.ramadanHoursEnabled,
      })
    } else {
      setState(seed)
    }
  }, [])

  useEffect(() => {
    if (!state) return
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // storage full or blocked; the demo still works in memory
    }
  }, [state])

  const resetHr = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY)
    } catch {
      // ignore
    }
    setState(createSeed())
  }, [])

  const updatePayrollSettings = useCallback((settings: Partial<PayrollSettings>) => {
    setState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        payrollSettings: {
          ...prev.payrollSettings,
          ...settings,
        },
      }
    })
  }, [])

  const savePayrollRun = useCallback((run: PayrollRun) => {
    setState((prev) => {
      if (!prev) return prev
      const existingIdx = prev.payrollRuns.findIndex((r) => r.id === run.id)
      const nextRuns =
        existingIdx >= 0
          ? prev.payrollRuns.map((r, i) => (i === existingIdx ? run : r))
          : [run, ...prev.payrollRuns]
      return {
        ...prev,
        payrollRuns: nextRuns,
      }
    })
  }, [])

  const deletePayrollRun = useCallback((id: string) => {
    setState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        payrollRuns: prev.payrollRuns.filter((r) => r.id !== id),
      }
    })
  }, [])

  const moveApplicantStage = useCallback((applicantId: string, stage: ApplicantStage) => {
    setState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        applicants: prev.applicants.map((a) =>
          a.id === applicantId ? { ...a, stage } : a,
        ),
      }
    })
  }, [])

  const addApplicantNote = useCallback((applicantId: string, text: string, author = 'Noura Al-Harbi') => {
    setState((prev) => {
      if (!prev) return prev
      const newNote = {
        id: `note-${Date.now()}`,
        author,
        text,
        createdAt: toISODate(startOfToday()),
      }
      return {
        ...prev,
        applicants: prev.applicants.map((a) =>
          a.id === applicantId
            ? { ...a, notes: [newNote, ...a.notes] }
            : a,
        ),
      }
    })
  }, [])

  const hireApplicant = useCallback((applicantId: string, customDepartment?: DepartmentId): Employee | null => {
    let createdEmployee: Employee | null = null

    setState((prev) => {
      if (!prev) return prev
      const applicant = prev.applicants.find((a) => a.id === applicantId)
      if (!applicant) return prev

      const dept: DepartmentId = customDepartment ?? (
        applicant.jobId === 'j1' || applicant.jobId === 'j8' ? 'it' :
        applicant.jobId === 'j2' ? 'it' :
        applicant.jobId === 'j3' ? 'finance' :
        applicant.jobId === 'j6' ? 'sales' : 'ops'
      )

      const [first, ...rest] = applicant.name.en.toLowerCase().replace(/[^a-z ]/g, '').split(' ')
      const email = `${first}.${rest.join('')}@wadialnoor.example`
      // Ids must not collide with anyone already on the books, so continue
      // from the highest existing number rather than counting the list.
      const highest = prev.employees.reduce((max, e) => {
        const n = Number(e.id.replace(/[^0-9]/g, ''))
        return Number.isFinite(n) && n > max ? n : max
      }, 0)
      const newId = `e${String(highest + 1).padStart(2, '0')}`

      const newEmp: Employee = {
        id: newId,
        name: applicant.name,
        title: applicant.headline,
        department: dept,
        managerId: 'e02', // Noura Al-Harbi
        nationality: applicant.nationality ?? 'SA',
        gender: applicant.gender ?? 'male',
        city: applicant.city === 'remote' ? 'riyadh' : applicant.city,
        email,
        hireDate: toISODate(startOfToday()),
        status: 'onboarding',
        salary: {
          basic: Math.round(applicant.expectedSalary * 0.7),
          housing: Math.round(applicant.expectedSalary * 0.2),
          transport: Math.round(applicant.expectedSalary * 0.1),
        },
        // Fictional, non-routable. A new hire's Qiwa contract is not
        // authenticated yet, which is what the compliance view should show.
        iban: `SA0380000000608010${String(highest + 1).padStart(4, '0')}00`,
        contractStatus: 'pending',
      }
      createdEmployee = newEmp

      // Create initial onboarding tasks for the new hire
      const newTasks: OnboardingTask[] = [
        {
          id: `ob-${newId}-1`,
          employeeId: newId,
          title: { en: 'Authenticate employment contract on Qiwa', ar: 'توثيق عقد العمل عبر منصة قوى' },
          category: 'docs',
          owner: 'Sara Al-Dosari',
          completed: false,
          dueDate: daysFromToday(3),
        },
        {
          id: `ob-${newId}-2`,
          employeeId: newId,
          title: { en: 'Enroll in medical insurance (CCHI Class B)', ar: 'التسجيل في التأمين الصحي (الفئة B)' },
          category: 'hr',
          owner: 'Sara Al-Dosari',
          completed: false,
          dueDate: daysFromToday(2),
        },
        {
          id: `ob-${newId}-3`,
          employeeId: newId,
          title: { en: 'Upload national ID / Iqama & bank IBAN certificate', ar: 'رفع الهوية والتحقق من شهادة الآيبان' },
          category: 'docs',
          owner: newEmp.name.en,
          completed: false,
          dueDate: daysFromToday(1),
        },
        {
          id: `ob-${newId}-4`,
          employeeId: newId,
          title: { en: 'Configure corporate laptop, email & workspace accounts', ar: 'تجهيز جهاز العمل والبريد الإلكتروني' },
          category: 'it',
          owner: 'Rajesh Kumar',
          completed: false,
          dueDate: daysFromToday(1),
        },
        {
          id: `ob-${newId}-5`,
          employeeId: newId,
          title: { en: 'Department orientation sync with manager', ar: 'جلسة توجيهية مع المدير المباشر' },
          category: 'team',
          owner: 'Noura Al-Harbi',
          completed: false,
          dueDate: daysFromToday(4),
        },
      ]

      const newBenefit: EmployeeBenefit = {
        employeeId: newId,
        insuranceTier: 'class_b',
        network: 'Bupa Classic Care (Al-Hammadi, Dallah, Mouwasat)',
        dependentsCount: 0,
        policyNumber: `CCHI-2026-${newId.toUpperCase()}-01`,
        deductiblePercentage: 20,
        maxCoverageLimit: 250000,
      }

      return {
        ...prev,
        applicants: prev.applicants.map((a) =>
          a.id === applicantId ? { ...a, stage: 'hired' as ApplicantStage } : a,
        ),
        employees: [...prev.employees, newEmp],
        onboardingTasks: [...prev.onboardingTasks, ...newTasks],
        benefits: { ...prev.benefits, [newId]: newBenefit },
      }
    })

    return createdEmployee
  }, [])

  const createTimeOffRequest = useCallback(
    (request: Omit<TimeOffRequest, 'id' | 'createdAt' | 'status'>) => {
      setState((prev) => {
        if (!prev) return prev
        const newReq: TimeOffRequest = {
          ...request,
          id: `req-${Date.now()}`,
          createdAt: toISODate(startOfToday()),
          status: 'pending',
        }
        return {
          ...prev,
          timeOffRequests: [newReq, ...prev.timeOffRequests],
        }
      })
    },
    [],
  )

  const approveTimeOffRequest = useCallback((id: string, reviewerId = 'e02') => {
    setState((prev) => {
      if (!prev) return prev
      const today = toISODate(startOfToday())
      const target = prev.timeOffRequests.find((r) => r.id === id)
      let nextEmployees = prev.employees
      if (target) {
        // If the approved leave is current, update employee status to on_leave
        if (target.startDate <= today && target.endDate >= today) {
          nextEmployees = prev.employees.map((e) =>
            e.id === target.employeeId ? { ...e, status: 'on_leave' as const } : e,
          )
        }
      }
      return {
        ...prev,
        employees: nextEmployees,
        timeOffRequests: prev.timeOffRequests.map((r) =>
          r.id === id
            ? { ...r, status: 'approved' as const, reviewedAt: today, reviewedBy: reviewerId }
            : r,
        ),
      }
    })
  }, [])

  const rejectTimeOffRequest = useCallback((id: string, reviewerId = 'e02') => {
    setState((prev) => {
      if (!prev) return prev
      const today = toISODate(startOfToday())
      return {
        ...prev,
        timeOffRequests: prev.timeOffRequests.map((r) =>
          r.id === id
            ? { ...r, status: 'rejected' as const, reviewedAt: today, reviewedBy: reviewerId }
            : r,
        ),
      }
    })
  }, [])

  const toggleOnboardingTask = useCallback((taskId: string) => {
    setState((prev) => {
      if (!prev) return prev
      const today = toISODate(startOfToday())
      return {
        ...prev,
        onboardingTasks: prev.onboardingTasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed ? today : undefined,
              }
            : t,
        ),
      }
    })
  }, [])

  const completeOnboarding = useCallback((employeeId: string) => {
    setState((prev) => {
      if (!prev) return prev
      const today = toISODate(startOfToday())
      return {
        ...prev,
        employees: prev.employees.map((e) =>
          e.id === employeeId ? { ...e, status: 'active' as const } : e,
        ),
        onboardingTasks: prev.onboardingTasks.map((t) =>
          t.employeeId === employeeId
            ? { ...t, completed: true, completedAt: t.completedAt ?? today }
            : t,
        ),
      }
    })
  }, [])

  const savePerformanceReview = useCallback((review: PerformanceReview) => {
    setState((prev) => {
      if (!prev) return prev
      const exists = prev.performanceReviews.some((r) => r.id === review.id)
      const nextReviews = exists
        ? prev.performanceReviews.map((r) => (r.id === review.id ? review : r))
        : [review, ...prev.performanceReviews]
      return {
        ...prev,
        performanceReviews: nextReviews,
      }
    })
  }, [])

  const toggleRamadanHours = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        ramadanHoursEnabled: !prev.ramadanHoursEnabled,
      }
    })
  }, [])

  const updateEmployeeBenefit = useCallback(
    (employeeId: string, benefit: Partial<EmployeeBenefit>) => {
      setState((prev) => {
        if (!prev) return prev
        const current = prev.benefits[employeeId]
        if (!current) return prev
        return {
          ...prev,
          benefits: {
            ...prev.benefits,
            [employeeId]: { ...current, ...benefit },
          },
        }
      })
    },
    [],
  )

  const value = useMemo(
    () => ({
      state,
      resetHr,
      updatePayrollSettings,
      savePayrollRun,
      deletePayrollRun,
      moveApplicantStage,
      addApplicantNote,
      hireApplicant,
      createTimeOffRequest,
      approveTimeOffRequest,
      rejectTimeOffRequest,
      toggleOnboardingTask,
      completeOnboarding,
      savePerformanceReview,
      toggleRamadanHours,
      updateEmployeeBenefit,
    }),
    [
      state,
      resetHr,
      updatePayrollSettings,
      savePayrollRun,
      deletePayrollRun,
      moveApplicantStage,
      addApplicantNote,
      hireApplicant,
      createTimeOffRequest,
      approveTimeOffRequest,
      rejectTimeOffRequest,
      toggleOnboardingTask,
      completeOnboarding,
      savePerformanceReview,
      toggleRamadanHours,
      updateEmployeeBenefit,
    ],
  )
  return <HrContext.Provider value={value}>{children}</HrContext.Provider>
}

function useHrContext() {
  const ctx = useContext(HrContext)
  if (!ctx) throw new Error('useHr must be used within HrProvider')
  return ctx
}

export function useHrLoaded() {
  return useHrContext().state !== null
}

export function useHrReset() {
  return useHrContext().resetHr
}

export function useUpdatePayrollSettings() {
  return useHrContext().updatePayrollSettings
}

export function useSavePayrollRun() {
  return useHrContext().savePayrollRun
}

export function useDeletePayrollRun() {
  return useHrContext().deletePayrollRun
}

export function useMoveApplicantStage() {
  return useHrContext().moveApplicantStage
}

export function useAddApplicantNote() {
  return useHrContext().addApplicantNote
}

export function useHireApplicant() {
  return useHrContext().hireApplicant
}

export function useCreateTimeOffRequest() {
  return useHrContext().createTimeOffRequest
}

export function useApproveTimeOffRequest() {
  return useHrContext().approveTimeOffRequest
}

export function useRejectTimeOffRequest() {
  return useHrContext().rejectTimeOffRequest
}

export function useToggleOnboardingTask() {
  return useHrContext().toggleOnboardingTask
}

export function useCompleteOnboarding() {
  return useHrContext().completeOnboarding
}

export function useSavePerformanceReview() {
  return useHrContext().savePerformanceReview
}

export function useToggleRamadanHours() {
  return useHrContext().toggleRamadanHours
}

export function useUpdateEmployeeBenefit() {
  return useHrContext().updateEmployeeBenefit
}

export function useHr(): HrState {
  const { state } = useHrContext()
  if (!state) return createSeed()
  return state
}

export function useHrSafe(): HrState | null {
  return useHrContext().state
}

