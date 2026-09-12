'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, UserCheck, X } from 'lucide-react'
import { useI18n, fill } from '@/lib/i18n'
import { formatSAR } from '@/lib/hr/format'
import { departments } from '@/lib/hr/seed'
import type { Applicant, DepartmentId, Employee } from '@/lib/hr/types'

interface Props {
  applicant: Applicant | null
  open: boolean
  onClose: () => void
  onConfirmHire: (applicantId: string, department?: DepartmentId) => Employee | null
}

export function HireDialog({ applicant, open, onClose, onConfirmHire }: Props) {
  const { t, tx, lang } = useI18n()
  const [selectedDept, setSelectedDept] = useState<DepartmentId>('it')
  const [hiredEmployee, setHiredEmployee] = useState<Employee | null>(null)

  if (!open || !applicant) return null

  const defaultDept: DepartmentId =
    applicant.jobId === 'j1' || applicant.jobId === 'j8' ? 'it' :
    applicant.jobId === 'j2' ? 'it' :
    applicant.jobId === 'j3' ? 'finance' :
    applicant.jobId === 'j6' ? 'sales' : 'ops'

  const handleConfirm = () => {
    const emp = onConfirmHire(applicant.id, selectedDept || defaultDept)
    setHiredEmployee(emp)
  }

  const handleClose = () => {
    setHiredEmployee(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={handleClose}
          className="absolute end-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-muted focus:outline-2"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {!hiredEmployee ? (
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UserCheck className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-xl font-extrabold text-foreground">
              {t('hireDialogTitle')}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {fill(t('hireDialogDesc'), { name: tx(applicant.name) })}
            </p>

            <div className="mt-5 space-y-4 rounded-2xl border border-border bg-muted/40 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Candidate:</span>
                <span className="font-bold text-foreground">{tx(applicant.name)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('startingSalary')}</span>
                <span className="font-bold text-foreground">
                  {formatSAR(applicant.expectedSalary, lang)}
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  {t('departmentAssignment')}
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value as DepartmentId)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {tx(d.name)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/95"
              >
                {t('confirmHire')}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="mt-4 text-xl font-extrabold text-foreground">
              {fill(t('hireSuccessAlert'), { name: tx(applicant.name) })}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              New employee record <span className="font-mono font-bold text-foreground">{hiredEmployee.id}</span> was added to Wadi Al-Noor Trading Co. with status <span className="font-bold text-warning">Onboarding</span>.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Continue in Pipeline
              </button>
              <Link
                href="/console"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/95"
              >
                {t('viewInDashboard')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
