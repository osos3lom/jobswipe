'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useHrLoaded, useHrSafe } from '@/lib/hr/store'
import type { Employee } from '@/lib/hr/types'

const STORAGE_KEY_EMP_ID = 'ihr.employee.activeId'
const DEFAULT_EMP_ID = 'e05' // Ahmed Hassan (Operations Manager, Expat with active Iqama & payslips)

interface EmployeeContextValue {
  currentEmployee: Employee | null
  setCurrentEmployeeId: (id: string) => void
  availableEmployees: Employee[]
}

const EmployeeContext = createContext<EmployeeContextValue | null>(null)

export function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const hrState = useHrSafe()
  const employees = hrState?.employees ?? []
  const [activeEmpId, setActiveEmpId] = useState<string>(DEFAULT_EMP_ID)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_EMP_ID)
      if (saved) setActiveEmpId(saved)
    } catch {
      // ignore
    }
  }, [])

  const setCurrentEmployeeId = useCallback((id: string) => {
    setActiveEmpId(id)
    try {
      window.localStorage.setItem(STORAGE_KEY_EMP_ID, id)
    } catch {
      // ignore
    }
  }, [])

  const currentEmployee = useMemo(() => {
    if (!employees || employees.length === 0) return null
    return employees.find((e) => e.id === activeEmpId) ?? employees[0]
  }, [employees, activeEmpId])

  const value = useMemo(
    () => ({
      currentEmployee,
      setCurrentEmployeeId,
      availableEmployees: employees,
    }),
    [currentEmployee, setCurrentEmployeeId, employees],
  )

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  )
}

export function useActiveEmployee() {
  const ctx = useContext(EmployeeContext)
  if (!ctx) throw new Error('useActiveEmployee must be used within EmployeeProvider')
  return ctx
}
