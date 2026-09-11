'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { startOfToday, toISODate } from './dates'
import { createSeed } from './seed'
import type {
  ApplicantStage,
  DepartmentId,
  Employee,
  HrState,
  PayrollRun,
  PayrollSettings,
} from './types'

// State for the employer console. Kept separate from the candidate store
// (lib/store.tsx) so each side of the demo can grow without touching the
// other. Bump KEY when the shape changes so old saved data is discarded.
const KEY = 'ihr.hr.v3'

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
}

const HrContext = createContext<HrContextValue | null>(null)

export function HrProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HrState | null>(null)

  useEffect(() => {
    let saved: HrState | null = null
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) saved = JSON.parse(raw)
    } catch {
      // ignore corrupt storage
    }
    setState(saved ?? createSeed())
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
      const newId = `e${String(prev.employees.length + 1).padStart(2, '0')}`

      createdEmployee = {
        id: newId,
        name: applicant.name,
        title: applicant.headline,
        department: dept,
        managerId: 'e02', // Noura Al-Harbi
        nationality: 'SA',
        gender: 'male',
        city: applicant.city === 'remote' ? 'riyadh' : applicant.city,
        email,
        hireDate: toISODate(startOfToday()),
        status: 'onboarding',
        salary: {
          basic: Math.round(applicant.expectedSalary * 0.7),
          housing: Math.round(applicant.expectedSalary * 0.2),
          transport: Math.round(applicant.expectedSalary * 0.1),
        },
      }

      return {
        ...prev,
        applicants: prev.applicants.map((a) =>
          a.id === applicantId ? { ...a, stage: 'hired' as ApplicantStage } : a,
        ),
        employees: [...prev.employees, createdEmployee],
      }
    })

    return createdEmployee
  }, [])

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

// For components rendered inside the console, which waits for the data to
// load before rendering its pages.
export function useHr(): HrState {
  const { state } = useHrContext()
  if (!state) throw new Error('useHr called before HR data loaded')
  return state
}
