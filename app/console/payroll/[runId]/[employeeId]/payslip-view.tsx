'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Printer,
  QrCode,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react'
import { departments } from '@/lib/hr/seed'
import { useHr } from '@/lib/hr/store'
import { formatDate, formatHijri, formatPercent, formatSAR } from '@/lib/hr/format'
import { fill, useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function PayslipView({
  runId,
  employeeId,
}: {
  runId: string
  employeeId: string
}) {
  const { t, tx, lang } = useI18n()
  const router = useRouter()
  const { company, employees, payrollRuns } = useHr()

  const run = payrollRuns.find((r) => r.id === runId)
  const employee = employees.find((e) => e.id === employeeId)
  const line = run?.lines.find((l) => l.employeeId === employeeId)

  if (!employee || !run || !line) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <h2 className="text-xl font-bold">{t('noPeopleFound')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Payslip record not found for employee {employeeId} in run {runId}.
        </p>
        <Link
          href="/console/payroll"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
          {t('returnToPayrollHub')}
        </Link>
      </div>
    )
  }

  const dept = departments.find((d) => d.id === employee.department)
  const payDateObj = new Date(run.payDate)
  const isSaudi = employee.nationality === 'SA'
  const otherDeductions = line.deductions.reduce((s, d) => s + (Number(d.amount) || 0), 0)
  const totalDeductions = line.gosiEmployee + otherDeductions

  // Employee list in this run for quick navigation
  const runEmployeeIds = run.lines.map((l) => l.employeeId)
  const currentIdx = runEmployeeIds.indexOf(employeeId)
  const prevEmpId = currentIdx > 0 ? runEmployeeIds[currentIdx - 1] : null
  const nextEmpId = currentIdx < runEmployeeIds.length - 1 ? runEmployeeIds[currentIdx + 1] : null

  const handlePrint = () => {
    window.print()
  }

  const ibanLast4 = `4${employee.id.replace('e', '')}98`

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/console/payroll"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
          <span>{t('returnToPayrollHub')}</span>
        </Link>

        {/* Next / Previous employee in this run */}
        <div className="flex items-center gap-2">
          {prevEmpId && (
            <Link
              href={`/console/payroll/${runId}/${prevEmpId}`}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <ChevronLeft className="h-3.5 w-3.5 rtl:-scale-x-100" />
              <span>{t('back')}</span>
            </Link>
          )}

          <select
            value={employeeId}
            onChange={(e) => router.push(`/console/payroll/${runId}/${e.target.value}`)}
            aria-label={t('colPerson')}
            className="h-8 rounded-xl border border-border bg-card px-2.5 text-xs font-medium text-foreground focus:outline-hidden"
          >
            {run.lines.map((l) => {
              const emp = employees.find((e) => e.id === l.employeeId)
              if (!emp) return null
              return (
                <option key={emp.id} value={emp.id}>
                  {tx(emp.name)} ({formatSAR(l.net, lang)})
                </option>
              )
            })}
          </select>

          {nextEmpId && (
            <Link
              href={`/console/payroll/${runId}/${nextEmpId}`}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <span>{t('next')}</span>
              <ChevronRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
            </Link>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{t('printPayslip')}</span>
          </button>
        </div>
      </div>

      {/* Printable Bilingual Payslip Document */}
      <div
        id="payslip-document"
        className="rounded-3xl border border-border bg-card p-6 shadow-md transition-colors sm:p-10 print:border-none print:bg-white print:p-0 print:text-black print:shadow-none"
      >
        {/* Company & Document Header */}
        <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-start sm:justify-between print:border-black/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black tracking-widest text-primary print:text-black">
                iHR PLATFORM
              </span>
              <span className="text-muted-foreground print:text-black/40">·</span>
              <span className="text-xs font-semibold text-muted-foreground print:text-black/60">
                {t('payslipSubtitle')}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl print:text-black">
              {tx(company.name)}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground print:text-black/60">
              {lang === 'ar' ? company.name.en : company.name.ar} · {t('crNumber')}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3 text-start sm:text-end print:border-black/20 print:bg-transparent">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground print:text-black/60">
              {t('payslipTitle')} / PAYSLIP
            </p>
            <p className="mt-1 text-lg font-black text-foreground print:text-black">
              {run.periodMonth}
            </p>
            <p className="text-xs font-medium text-muted-foreground print:text-black/60">
              {formatHijri(payDateObj, lang)}
            </p>
          </div>
        </div>

        {/* Employee & Pay Details Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-border/70 bg-muted/15 p-4 text-xs sm:grid-cols-4 print:border-black/20 print:bg-transparent">
          <div>
            <span className="font-semibold text-muted-foreground print:text-black/60">
              {t('colPerson')} / Name
            </span>
            <p className="mt-1 font-bold text-foreground print:text-black">{tx(employee.name)}</p>
            <p className="text-[11px] text-muted-foreground print:text-black/60">
              {lang === 'ar' ? employee.name.en : employee.name.ar}
            </p>
          </div>

          <div>
            <span className="font-semibold text-muted-foreground print:text-black/60">
              {t('colTitle')} / Designation
            </span>
            <p className="mt-1 font-bold text-foreground print:text-black">{tx(employee.title)}</p>
            <p className="text-[11px] text-muted-foreground print:text-black/60">
              {dept ? tx(dept.name) : employee.department}
            </p>
          </div>

          <div>
            <span className="font-semibold text-muted-foreground print:text-black/60">
              {isSaudi ? t('nationalIdCard') : t('iqamaCard')}
            </span>
            <p className="mt-1 font-mono font-bold text-foreground print:text-black">
              {isSaudi
                ? `10${employee.id.replace('e', '')}849201`
                : `24${employee.id.replace('e', '')}710293`}
            </p>
            <p className="text-[11px] text-muted-foreground print:text-black/60">
              ID: {employee.id.toUpperCase()}
            </p>
          </div>

          <div>
            <span className="font-semibold text-muted-foreground print:text-black/60">
              {t('payDateLabel')} / Payment Date
            </span>
            <p className="mt-1 font-bold text-foreground print:text-black">
              {formatDate(payDateObj, lang)}
            </p>
            <p className="text-[11px] text-muted-foreground print:text-black/60">
              {fill(t('bankTransferIban'), { last4: ibanLast4 })}
            </p>
          </div>
        </div>

        {/* Itemized Earnings and Deductions tables */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Earnings Column */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 print:border-black/20 print:bg-transparent">
            <div className="border-b border-border/70 pb-2.5 print:border-black/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-black/60">
                {t('earnings')} / Earnings
              </h3>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-foreground print:text-black">{t('basicSalary')}</span>
                <span className="font-bold text-foreground print:text-black">
                  {formatSAR(line.basic, lang)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground print:text-black">{t('housingAllowance')}</span>
                <span className="font-bold text-foreground print:text-black">
                  {formatSAR(line.housing, lang)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground print:text-black">{t('transportAllowance')}</span>
                <span className="font-bold text-foreground print:text-black">
                  {formatSAR(line.transport, lang)}
                </span>
              </div>

              {line.additions.map((adj) => (
                <div key={adj.id} className="flex justify-between text-emerald-600 print:text-black">
                  <span>+ {tx(adj.label)}</span>
                  <span className="font-bold">{formatSAR(adj.amount, lang)}</span>
                </div>
              ))}

              <div className="border-t border-border/70 pt-2.5 flex justify-between text-sm font-black text-foreground print:border-black/20 print:text-black">
                <span>{t('totalGrossSalary')}</span>
                <span>{formatSAR(line.gross, lang)}</span>
              </div>
            </div>
          </div>

          {/* Deductions Column */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 print:border-black/20 print:bg-transparent">
            <div className="border-b border-border/70 pb-2.5 print:border-black/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-black/60">
                {t('deductions')} / Deductions
              </h3>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex justify-between text-destructive print:text-black">
                <div>
                  <span>{t('gosiEmployeeShare')}</span>
                  <p className="text-[10px] text-muted-foreground print:text-black/60">
                    {isSaudi ? '9.75% of basic + housing' : '0%'}
                  </p>
                </div>
                <span className="font-bold">
                  {line.gosiEmployee > 0 ? `- ${formatSAR(line.gosiEmployee, lang)}` : '0'}
                </span>
              </div>

              {line.deductions.map((adj) => (
                <div key={adj.id} className="flex justify-between text-destructive print:text-black">
                  <span>- {tx(adj.label)}</span>
                  <span className="font-bold">{formatSAR(adj.amount, lang)}</span>
                </div>
              ))}

              {line.deductions.length === 0 && line.gosiEmployee === 0 && (
                <p className="py-3 text-center text-xs text-muted-foreground print:text-black/60">
                  {t('noAdjustments')}
                </p>
              )}

              <div className="border-t border-border/70 pt-2.5 flex justify-between text-sm font-black text-foreground print:border-black/20 print:text-black">
                <span>{t('deductions')}</span>
                <span className="text-destructive print:text-black">
                  - {formatSAR(totalDeductions, lang)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay Highlight Banner */}
        <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-primary/10 p-5 sm:flex-row sm:items-center sm:justify-between print:border print:border-black/20 print:bg-transparent">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary print:text-black">
              {t('netPay')} / Net Payable
            </span>
            <p className="mt-0.5 text-xs text-muted-foreground print:text-black/60">
              {fill(t('bankTransferIban'), { last4: ibanLast4 })}
            </p>
          </div>
          <div className="text-start sm:text-end">
            <span className="text-2xl font-black text-primary sm:text-3xl print:text-black">
              {formatSAR(line.net, lang)}
            </span>
          </div>
        </div>

        {/* Employer Cost Disclosure Note */}
        <div className="mt-4 rounded-xl border border-dashed border-border/80 px-4 py-2 text-[11px] text-muted-foreground print:border-black/20 print:text-black/60">
          <div className="flex justify-between">
            <span>
              {t('gosiEmployerShare')} ({isSaudi ? '11.75%' : '2%'}):
            </span>
            <span className="font-semibold text-foreground print:text-black">
              {formatSAR(line.gosiEmployer, lang)}
            </span>
          </div>
        </div>

        {/* Certification & Security footer */}
        <div className="mt-8 flex flex-col gap-4 border-t border-border/70 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between print:border-black/20 print:text-black/60">
          <div className="flex items-center gap-2.5 text-muted-foreground print:text-black/60">
            <ShieldCheck className="h-5 w-5 text-emerald-600 print:text-black" />
            <p className="max-w-md text-[11px] leading-relaxed">
              {t('electronicDocNotice')}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end text-end font-mono text-[10px] text-muted-foreground print:text-black/60">
            <span>REF: {run.id.toUpperCase()}-{employee.id.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
