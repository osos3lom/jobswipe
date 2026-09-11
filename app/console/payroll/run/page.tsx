'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  FileCheck,
  FileText,
  MinusCircle,
  Plus,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { departments } from '@/lib/hr/seed'
import { useHr, useSavePayrollRun } from '@/lib/hr/store'
import type { Employee, PayrollAdjustment, PayrollLine, PayrollRun } from '@/lib/hr/types'
import { nextPayday, startOfToday, toISODate } from '@/lib/hr/dates'
import { formatDate, formatHijri, formatNumber, formatPercent, formatSAR } from '@/lib/hr/format'
import { calculatePayrollLine, calculateRunTotals } from '@/lib/hr/payroll'
import { fill, useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function PayrollRunWizardPage() {
  const { t, tx, lang } = useI18n()
  const router = useRouter()
  const { company, employees, payrollSettings } = useHr()
  const saveRun = useSavePayrollRun()

  const payday = nextPayday(company.payDay)
  const periodMonth = `${payday.getFullYear()}-${String(payday.getMonth() + 1).padStart(2, '0')}`
  const payDateStr = toISODate(payday)
  const monthName = new Intl.DateTimeFormat(
    lang === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-GB',
    { month: 'long', year: 'numeric' },
  ).format(payday)

  // Step 1: 1, 2, 3
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submittedRun, setSubmittedRun] = useState<PayrollRun | null>(null)

  // Included employees: default active and onboarding
  const [includedIds, setIncludedIds] = useState<Set<string>>(() => {
    return new Set(employees.filter((e) => e.status !== 'on_leave').map((e) => e.id))
  })

  // Adjustments map: employeeId -> { additions, deductions }
  const [adjustments, setAdjustments] = useState<
    Map<string, { additions: PayrollAdjustment[]; deductions: PayrollAdjustment[] }>
  >(new Map())

  // Modal state for adding an adjustment
  const [modalEmployee, setModalEmployee] = useState<Employee | null>(null)
  const [adjType, setAdjType] = useState<'addition' | 'deduction'>('addition')
  const [adjCategory, setAdjCategory] = useState<string>('bonus')
  const [adjAmount, setAdjAmount] = useState<string>('')
  const [adjReason, setAdjReason] = useState<string>('')

  // Calculate lines for currently included employees
  const lines: PayrollLine[] = useMemo(() => {
    return employees
      .filter((e) => includedIds.has(e.id))
      .map((e) => {
        const empAdj = adjustments.get(e.id) || { additions: [], deductions: [] }
        return calculatePayrollLine(e, empAdj.additions, empAdj.deductions, payrollSettings)
      })
  }, [employees, includedIds, adjustments, payrollSettings])

  const totals = useMemo(() => calculateRunTotals(lines), [lines])

  const toggleEmployee = (id: string) => {
    const next = new Set(includedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setIncludedIds(next)
  }

  const handleOpenAddModal = (emp: Employee, type: 'addition' | 'deduction') => {
    setModalEmployee(emp)
    setAdjType(type)
    setAdjCategory(type === 'addition' ? 'bonus' : 'unpaid_leave')
    setAdjAmount('')
    setAdjReason('')
  }

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalEmployee) return
    const amt = parseFloat(adjAmount)
    if (isNaN(amt) || amt <= 0) return

    const categoryLabel =
      adjCategory === 'bonus'
        ? t('typeBonus')
        : adjCategory === 'overtime'
          ? t('typeOvertime')
          : adjCategory === 'unpaid_leave'
            ? t('typeUnpaidLeave')
            : adjCategory === 'advance'
              ? t('typeAdvance')
              : t('typeViolation')

    const newAdjustment: PayrollAdjustment = {
      id: `adj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: adjCategory as any,
      amount: amt,
      label: {
        en: adjReason ? `${categoryLabel} - ${adjReason}` : categoryLabel,
        ar: adjReason ? `${categoryLabel} - ${adjReason}` : categoryLabel,
      },
    }

    const prev = adjustments.get(modalEmployee.id) || { additions: [], deductions: [] }
    const next = {
      additions: adjType === 'addition' ? [...prev.additions, newAdjustment] : prev.additions,
      deductions: adjType === 'deduction' ? [...prev.deductions, newAdjustment] : prev.deductions,
    }

    const nextMap = new Map(adjustments)
    nextMap.set(modalEmployee.id, next)
    setAdjustments(nextMap)
    setModalEmployee(null)
  }

  const handleRemoveAdjustment = (empId: string, adjId: string, type: 'addition' | 'deduction') => {
    const prev = adjustments.get(empId)
    if (!prev) return
    const next = {
      additions: type === 'addition' ? prev.additions.filter((a) => a.id !== adjId) : prev.additions,
      deductions: type === 'deduction' ? prev.deductions.filter((d) => d.id !== adjId) : prev.deductions,
    }
    const nextMap = new Map(adjustments)
    nextMap.set(empId, next)
    setAdjustments(nextMap)
  }

  const handleSubmitRun = () => {
    const newRun: PayrollRun = {
      id: `run-${periodMonth}`,
      periodMonth,
      payDate: payDateStr,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      lines,
      totals,
    }
    saveRun(newRun)
    setSubmittedRun(newRun)
  }

  // Celebratory Submitted State
  if (submittedRun) {
    const firstEmpId = submittedRun.lines[0]?.employeeId || 'e01'
    return (
      <div className="mx-auto max-w-3xl space-y-8 py-8 text-center animate-in fade-in zoom-in-95">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
            <Sparkles className="h-3.5 w-3.5" />
            {t('payrollSuccessTitle')}
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {fill(t('wizardTitle'), { month: monthName })}
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            {t('payrollSuccessDesc')}
          </p>
        </div>

        {/* Totals cards */}
        <div className="grid gap-3 rounded-3xl border border-border bg-card p-6 text-start sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">{t('totalTransferred')}</p>
            <p className="mt-1 text-2xl font-black text-primary">
              {formatSAR(submittedRun.totals.totalNet, lang)}
            </p>
            <p className="text-[11px] text-muted-foreground">{formatNumber(submittedRun.totals.employeeCount, lang)} {t('employeesCount').toLowerCase()}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">{t('totalGrossPayroll')}</p>
            <p className="mt-1 text-2xl font-black text-foreground">
              {formatSAR(submittedRun.totals.totalGross, lang)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">{t('totalCompanyCost')}</p>
            <p className="mt-1 text-2xl font-black text-foreground">
              {formatSAR(submittedRun.totals.totalEmployerCost, lang)}
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/console/payroll/${submittedRun.id}/${firstEmpId}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-105"
          >
            <FileText className="h-4 w-4" />
            <span>{t('viewAllPayslipsBtn')}</span>
          </Link>
          <Link
            href="/console/payroll"
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <span>{t('returnToPayrollHub')}</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-24 lg:pb-8">
      {/* Header & Stepper */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link
            href="/console/payroll"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
            {t('returnToPayrollHub')}
          </Link>
          <span className="text-xs font-semibold text-muted-foreground">
            {formatDate(payday, lang)} · {formatHijri(payday, lang)}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {fill(t('wizardTitle'), { month: monthName })}
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full',
                step === 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground',
              )}
            >
              1
            </span>
            <span className="hidden sm:inline">{t('step1Title')}</span>
            <span className="mx-1 text-border">─</span>
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full',
                step === 2
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground',
              )}
            >
              2
            </span>
            <span className="hidden sm:inline">{t('step2Title')}</span>
            <span className="mx-1 text-border">─</span>
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full',
                step === 3
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground',
              )}
            >
              3
            </span>
            <span className="hidden sm:inline">{t('step3Title')}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
        {/* Step Content */}
        <div className="space-y-6">
          {/* STEP 1: REVIEW TEAM */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
                <h2 className="text-base font-bold text-foreground">{t('step1Title')}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{t('step1Desc')}</p>
              </div>

              <div className="space-y-3">
                {employees.map((emp) => {
                  const included = includedIds.has(emp.id)
                  const empAdj = adjustments.get(emp.id) || { additions: [], deductions: [] }
                  const dept = departments.find((d) => d.id === emp.department)
                  const [firstWord] = tx(emp.name).split(' ')
                  const initials = firstWord ? firstWord[0] : 'U'

                  return (
                    <div
                      key={emp.id}
                      className={cn(
                        'rounded-3xl border p-4 transition-all',
                        included
                          ? 'border-border bg-card shadow-xs'
                          : 'border-border/50 bg-card/40 opacity-60',
                      )}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Checkbox and Person info */}
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={included}
                            onChange={() => toggleEmployee(emp.id)}
                            aria-label={tx(emp.name)}
                            className="h-5 w-5 rounded-lg border-border text-primary focus:ring-primary"
                          />
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-bold text-primary">
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-foreground">{tx(emp.name)}</h3>
                              <span className="text-[11px] text-muted-foreground">
                                ({emp.nationality === 'SA' ? t('filterSaudi') : t('filterNonSaudi')})
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {tx(emp.title)} · {dept ? tx(dept.name) : emp.department}
                            </p>
                          </div>
                        </div>

                        {/* Salary & Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-2 sm:border-0 sm:pt-0">
                          <div className="text-start sm:text-end">
                            <span className="text-xs font-semibold text-muted-foreground">
                              {t('basicSalary')}
                            </span>
                            <p className="text-sm font-black text-foreground">
                              {formatSAR(emp.salary.basic + emp.salary.housing + emp.salary.transport, lang)}
                            </p>
                          </div>

                          {included && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenAddModal(emp, 'addition')}
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                              >
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span>{t('addAddition')}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenAddModal(emp, 'deduction')}
                                className="inline-flex items-center gap-1 rounded-xl bg-destructive/10 px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
                              >
                                <MinusCircle className="h-3.5 w-3.5" />
                                <span>{t('addDeduction')}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Display active adjustments */}
                      {(empAdj.additions.length > 0 || empAdj.deductions.length > 0) && (
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-border/60 pt-3 text-xs">
                          {empAdj.additions.map((a) => (
                            <span
                              key={a.id}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-600 dark:text-emerald-400"
                            >
                              <span>+ {formatSAR(a.amount, lang)} ({tx(a.label)})</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveAdjustment(emp.id, a.id, 'addition')}
                                className="hover:text-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                          {empAdj.deductions.map((d) => (
                            <span
                              key={d.id}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-destructive/10 px-2.5 py-1 font-semibold text-destructive"
                            >
                              <span>- {formatSAR(d.amount, lang)} ({tx(d.label)})</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveAdjustment(emp.id, d.id, 'deduction')}
                                className="hover:text-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 2: REVIEW MONEY */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
                <h2 className="text-base font-bold text-foreground">{t('step2Title')}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{t('step2Desc')}</p>
              </div>

              {/* Table of money & GOSI split */}
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/30 font-semibold uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-3.5 text-start">{t('colPerson')}</th>
                        <th className="px-4 py-3.5 text-start">{t('colGross')}</th>
                        <th className="px-4 py-3.5 text-start">{t('colGosiEmployee')}</th>
                        <th className="px-4 py-3.5 text-start">{t('colDeductions')}</th>
                        <th className="px-4 py-3.5 text-start font-black text-primary">{t('colNetPay')}</th>
                        <th className="px-4 py-3.5 text-start">{t('colGosiEmployer')}</th>
                        <th className="px-4 py-3.5 text-start">{t('colEmployerCost')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {lines.map((line) => {
                        const emp = employees.find((e) => e.id === line.employeeId)
                        if (!emp) return null
                        const isSaudi = emp.nationality === 'SA'
                        const otherDeductions = line.deductions.reduce((s, d) => s + d.amount, 0)

                        return (
                          <tr key={line.employeeId} className="hover:bg-muted/30">
                            <td className="px-4 py-3.5">
                              <p className="font-bold text-foreground">{tx(emp.name)}</p>
                              <span
                                className={cn(
                                  'inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold',
                                  isSaudi
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-muted text-muted-foreground',
                                )}
                              >
                                {isSaudi ? t('saudiEmployeeTag') : t('expatEmployeeTag')}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-foreground">
                              {formatSAR(line.gross, lang)}
                            </td>
                            <td className="px-4 py-3.5 text-destructive font-semibold">
                              {line.gosiEmployee > 0 ? `- ${formatSAR(line.gosiEmployee, lang)}` : '—'}
                            </td>
                            <td className="px-4 py-3.5 text-destructive font-semibold">
                              {otherDeductions > 0 ? `- ${formatSAR(otherDeductions, lang)}` : '—'}
                            </td>
                            <td className="px-4 py-3.5 font-black text-primary text-sm">
                              {formatSAR(line.net, lang)}
                            </td>
                            <td className="px-4 py-3.5 text-muted-foreground font-semibold">
                              + {formatSAR(line.gosiEmployer, lang)}
                            </td>
                            <td className="px-4 py-3.5 font-bold text-foreground">
                              {formatSAR(line.employerCost, lang)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUBMIT CONFIRMATION */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
                <h2 className="text-xl font-bold text-foreground">{t('step3Title')}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{t('step3Desc')}</p>

                <div className="mt-6 rounded-2xl border border-border/80 bg-background/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{t('wpsReadyTitle')}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{t('wpsReadyDesc')}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('periodHeader')}</span>
                    <span className="font-bold">{monthName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('payDateLabel')}</span>
                    <span className="font-bold">{formatDate(payday, lang)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('employeesCount')}</span>
                    <span className="font-bold">{formatNumber(totals.employeeCount, lang)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('totalGrossPayroll')}</span>
                    <span className="font-bold">{formatSAR(totals.totalGross, lang)}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>{t('totalGosiAmount')}</span>
                    <span className="font-bold">
                      - {formatSAR(totals.totalEmployeeGosi, lang)}
                    </span>
                  </div>
                  <div className="border-t border-border/80 pt-3 flex justify-between text-base">
                    <span className="font-bold text-foreground">{t('totalTransferred')}</span>
                    <span className="font-black text-primary text-xl">
                      {formatSAR(totals.totalNet, lang)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmitRun}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-black text-primary-foreground shadow-md transition-transform hover:scale-[1.02] sm:w-auto"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{t('submitPayRunButton')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Running Totals Pinned Sidebar (Desktop) / Bottom Bar (Mobile) */}
        <div>
          <div className="sticky top-20 rounded-3xl border border-border bg-card p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('runningSummary')}
            </h3>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">{t('totalTransferred')}</p>
                <p className="text-2xl font-black text-primary">
                  {formatSAR(totals.totalNet, lang)}
                </p>
              </div>

              <div className="space-y-2 border-t border-border/60 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('employeesCount')}</span>
                  <span className="font-semibold text-foreground">
                    {formatNumber(totals.employeeCount, lang)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('totalGrossPayroll')}</span>
                  <span className="font-semibold text-foreground">
                    {formatSAR(totals.totalGross, lang)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('colGosiEmployee')}</span>
                  <span className="font-semibold text-destructive">
                    - {formatSAR(totals.totalEmployeeGosi, lang)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('colGosiEmployer')}</span>
                  <span className="font-semibold text-muted-foreground">
                    + {formatSAR(totals.totalEmployerGosi, lang)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-2 font-bold">
                  <span className="text-foreground">{t('totalCompanyCost')}</span>
                  <span className="text-foreground">
                    {formatSAR(totals.totalEmployerCost, lang)}
                  </span>
                </div>
              </div>

              {/* Wizard Nav buttons */}
              <div className="mt-6 flex flex-col gap-2 border-t border-border/60 pt-4">
                {step === 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={totals.employeeCount === 0}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    <span>{t('step2Title')}</span>
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                  </button>
                )}

                {step === 2 && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-2xl border border-border px-3 py-3 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      {t('back')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-2 flex items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                    >
                      <span>{t('step3Title')}</span>
                      <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-2xl border border-border px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    {t('back')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding addition/deduction */}
      {modalEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">
                {adjType === 'addition' ? t('addAddition') : t('addDeduction')}
              </h3>
              <button
                type="button"
                onClick={() => setModalEmployee(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{tx(modalEmployee.name)}</p>

            <form onSubmit={handleSaveAdjustment} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-foreground">{t('filterDepartment')}</label>
                <select
                  value={adjCategory}
                  onChange={(e) => setAdjCategory(e.target.value)}
                  className="mt-1 h-10 w-full rounded-2xl border border-border bg-background px-3 text-xs font-medium"
                >
                  {adjType === 'addition' ? (
                    <>
                      <option value="bonus">{t('typeBonus')}</option>
                      <option value="overtime">{t('typeOvertime')}</option>
                      <option value="allowance">{t('typeAllowance')}</option>
                    </>
                  ) : (
                    <>
                      <option value="unpaid_leave">{t('typeUnpaidLeave')}</option>
                      <option value="advance">{t('typeAdvance')}</option>
                      <option value="violation">{t('typeViolation')}</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">{t('adjustmentAmount')}</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="50"
                  placeholder="e.g. 1000"
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(e.target.value)}
                  className="mt-1 h-10 w-full rounded-2xl border border-border bg-background px-3 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">{t('adjustmentReason')}</label>
                <input
                  type="text"
                  placeholder="e.g. Q3 bonus or 10 hours"
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="mt-1 h-10 w-full rounded-2xl border border-border bg-background px-3 text-sm"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalEmployee(null)}
                  className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                >
                  {t('saveAdjustment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
