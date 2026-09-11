'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  FileText,
  Mail,
  MapPin,
  ShieldCheck,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react'
import { departments } from '@/lib/hr/seed'
import { useHr } from '@/lib/hr/store'
import type { Employee, EmployeeStatus, WorkCity } from '@/lib/hr/types'
import { daysUntil } from '@/lib/hr/dates'
import { formatDate, formatDays, formatHijri, formatPercent, formatSAR } from '@/lib/hr/format'
import { calculatePayrollLine } from '@/lib/hr/payroll'
import { fill, useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function PersonProfileView({ id }: { id: string }) {
  const { t, tx, lang } = useI18n()
  const { employees, payrollSettings, payrollRuns } = useHr()

  const employee = employees.find((e) => e.id === id)

  if (!employee) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center">
        <h2 className="text-xl font-bold">{t('noPeopleFound')}</h2>
        <Link
          href="/console/people"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
          {t('backToPeople')}
        </Link>
      </div>
    )
  }

  const manager = employees.find((e) => e.id === employee.managerId)
  const directReports = employees.filter((e) => e.managerId === employee.id)
  const dept = departments.find((d) => d.id === employee.department)

  const payrollLine = calculatePayrollLine(employee, [], [], payrollSettings)

  // Find latest payslip link
  const latestRun = payrollRuns.find((r) => r.lines.some((l) => l.employeeId === employee.id))

  // Tenure calculation
  const hireDateObj = new Date(employee.hireDate)
  const now = new Date()
  const diffMonths =
    (now.getFullYear() - hireDateObj.getFullYear()) * 12 + (now.getMonth() - hireDateObj.getMonth())
  const tenureYears = Math.floor(diffMonths / 12)
  const tenureRemainingMonths = diffMonths % 12
  const tenureString =
    lang === 'ar'
      ? `${tenureYears > 0 ? `${tenureYears} سنة ` : ''}${tenureRemainingMonths} شهر`
      : `${tenureYears > 0 ? `${tenureYears} yr ` : ''}${tenureRemainingMonths} mo`

  const getCityLabel = (city: WorkCity) => {
    switch (city) {
      case 'riyadh':
        return t('cityRiyadh')
      case 'jeddah':
        return t('cityJeddah')
      case 'dammam':
        return t('cityDammam')
    }
  }

  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t('statusActive')}
          </span>
        )
      case 'on_leave':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {t('statusOnLeave')}
          </span>
        )
      case 'onboarding':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {t('statusOnboarding')}
          </span>
        )
    }
  }

  const [firstWord] = tx(employee.name).split(' ')
  const initials = firstWord ? firstWord[0] : 'U'

  // Iqama alert
  const iqamaDaysLeft = employee.iqamaExpiry ? daysUntil(employee.iqamaExpiry) : null

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/console/people"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
          {t('backToPeople')}
        </Link>
      </div>

      {/* Summary Profile Header */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-2xl font-bold text-primary">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  {tx(employee.name)}
                </h1>
                {getStatusBadge(employee.status)}
              </div>
              <p className="mt-1 text-base font-medium text-muted-foreground">
                {lang === 'ar' ? employee.name.en : employee.name.ar} · {tx(employee.title)}
              </p>

              <div className="mt-3.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Building2 className="h-3.5 w-3.5" />
                  {dept ? tx(dept.name) : employee.department}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-medium">
                  <MapPin className="h-3.5 w-3.5" />
                  {getCityLabel(employee.city)}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-medium">
                  <Mail className="h-3.5 w-3.5" />
                  {employee.email}
                </span>
                <span>·</span>
                <span className="rounded-md bg-muted px-2 py-0.5 font-semibold text-foreground">
                  {employee.nationality === 'SA' ? t('filterSaudi') : t('filterNonSaudi')}
                </span>
              </div>
            </div>
          </div>

          {latestRun && (
            <Link
              href={`/console/payroll/${latestRun.id}/${employee.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
            >
              <FileText className="h-4 w-4" />
              {t('viewLatestPayslip')}
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Main Column */}
        <div className="space-y-6">
          {/* Saudi Salary Split Breakdown */}
          <section className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Wallet className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">{t('salaryBreakdown')}</h2>
                  <p className="text-xs text-muted-foreground">{t('salaryBreakdownSaudiNote')}</p>
                </div>
              </div>
            </div>

            {/* Standard 3-part split grid */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/80 bg-background/60 p-4">
                <p className="text-xs font-semibold text-muted-foreground">{t('basicSalary')}</p>
                <p className="mt-2 text-lg font-black tracking-tight text-foreground">
                  {formatSAR(employee.salary.basic, lang)}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {formatPercent(employee.salary.basic / payrollLine.gross, lang)} {t('colGross')}
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-background/60 p-4">
                <p className="text-xs font-semibold text-muted-foreground">{t('housingAllowance')}</p>
                <p className="mt-2 text-lg font-black tracking-tight text-foreground">
                  {formatSAR(employee.salary.housing, lang)}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {formatPercent(employee.salary.housing / payrollLine.gross, lang)} {t('colGross')}
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-background/60 p-4">
                <p className="text-xs font-semibold text-muted-foreground">{t('transportAllowance')}</p>
                <p className="mt-2 text-lg font-black tracking-tight text-foreground">
                  {formatSAR(employee.salary.transport, lang)}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {formatPercent(employee.salary.transport / payrollLine.gross, lang)} {t('colGross')}
                </p>
              </div>
            </div>

            {/* Gross, GOSI, Net Calculation summary */}
            <div className="mt-5 space-y-2.5 rounded-2xl border border-border/60 bg-muted/25 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">{t('totalGrossSalary')}</span>
                <span className="font-bold text-foreground">{formatSAR(payrollLine.gross, lang)}</span>
              </div>

              <div className="flex items-center justify-between text-destructive">
                <span className="font-medium">
                  {t('gosiEmployeeShare')}{' '}
                  <span className="text-xs opacity-75">
                    ({employee.nationality === 'SA' ? '9.75%' : '0%'})
                  </span>
                </span>
                <span className="font-bold">- {formatSAR(payrollLine.gosiEmployee, lang)}</span>
              </div>

              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>
                  {t('gosiEmployerShare')}{' '}
                  <span className="opacity-75">
                    ({employee.nationality === 'SA' ? '11.75%' : '2%'})
                  </span>
                </span>
                <span>+ {formatSAR(payrollLine.gosiEmployer, lang)}</span>
              </div>

              <div className="border-t border-border/80 pt-2.5 flex items-center justify-between text-base">
                <span className="font-bold text-foreground">{t('estimatedNetSalary')}</span>
                <span className="font-black text-primary text-xl">
                  {formatSAR(payrollLine.net, lang)}
                </span>
              </div>
            </div>
          </section>

          {/* Documents & Official Status */}
          <section className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileCheck className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-foreground">{t('documentsTitle')}</h2>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {/* National ID / Iqama Card */}
              <div className="rounded-2xl border border-border/80 bg-background/60 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {employee.nationality === 'SA' ? t('nationalIdCard') : t('iqamaCard')}
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold text-foreground">
                      {employee.nationality === 'SA'
                        ? `10${employee.id.replace('e', '')}849201`
                        : `24${employee.id.replace('e', '')}710293`}
                    </p>
                  </div>
                  {iqamaDaysLeft !== null ? (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold',
                        iqamaDaysLeft < 0
                          ? 'bg-destructive/10 text-destructive'
                          : iqamaDaysLeft <= 60
                            ? 'bg-warning/15 text-warning'
                            : 'bg-emerald-500/10 text-emerald-600',
                      )}
                    >
                      {iqamaDaysLeft < 0
                        ? t('expired')
                        : iqamaDaysLeft <= 60
                          ? t('expiringSoon')
                          : t('validDoc')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                      {t('validDoc')}
                    </span>
                  )}
                </div>

                {employee.iqamaExpiry && iqamaDaysLeft !== null && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {iqamaDaysLeft < 0
                      ? fill(t('todoIqamaExpired'), {
                          name: tx(employee.name),
                          days: formatDays(iqamaDaysLeft, lang),
                        })
                      : fill(t('todoIqamaExpiring'), {
                          name: tx(employee.name),
                          days: formatDays(iqamaDaysLeft, lang),
                        })}
                  </p>
                )}
              </div>

              {/* GOSI & Medical insurance status */}
              <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t('verifiedGosi')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t('validDoc')}
                  </span>
                </div>
                <div className="border-t border-border/40 pt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t('activeInsurance')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {t('validDoc')}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Column: Tenure & Hierarchy */}
        <div className="space-y-6">
          {/* Employment & Tenure card */}
          <section className="rounded-3xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <h2 className="text-xs font-semibold uppercase tracking-wider">{t('tenure')}</h2>
            </div>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">
              {tenureString}
            </p>
            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground border-t border-border/60 pt-3">
              <div className="flex justify-between">
                <span>{t('colHireDate')}</span>
                <span className="font-semibold text-foreground">
                  {formatDate(hireDateObj, lang)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('hijriPeriod')}</span>
                <span className="font-semibold text-foreground">
                  {formatHijri(hireDateObj, lang)}
                </span>
              </div>
            </div>
          </section>

          {/* Manager card */}
          <section className="rounded-3xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserCheck className="h-4 w-4" />
              <h2 className="text-xs font-semibold uppercase tracking-wider">{t('manager')}</h2>
            </div>

            {manager ? (
              <Link
                href={`/console/people/${manager.id}`}
                className="mt-3.5 flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-3 transition-colors hover:border-primary/40 hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {tx(manager.name)[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{tx(manager.name)}</p>
                    <p className="text-xs text-muted-foreground">{tx(manager.title)}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground rtl:-scale-x-100" />
              </Link>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">{t('noManager')}</p>
            )}
          </section>

          {/* Direct Reports */}
          <section className="rounded-3xl border border-border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <h2 className="text-xs font-semibold uppercase tracking-wider">
                  {t('directReports')}
                </h2>
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-foreground">
                {directReports.length}
              </span>
            </div>

            {directReports.length > 0 ? (
              <ul className="mt-3.5 space-y-2">
                {directReports.map((report) => (
                  <li key={report.id}>
                    <Link
                      href={`/console/people/${report.id}`}
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-2.5 transition-colors hover:border-primary/40 hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {tx(report.name)[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{tx(report.name)}</p>
                          <p className="text-[11px] text-muted-foreground">{tx(report.title)}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground rtl:-scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">{t('noDirectReports')}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
