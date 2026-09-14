'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  FileCheck2,
  FileText,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from 'lucide-react'
import { useActiveEmployee } from '@/lib/employee/employee-context'
import { useHr } from '@/lib/hr/store'
import { calculatePayrollLine } from '@/lib/hr/payroll'
import { calculateEmployeeBalances } from '@/lib/hr/time-off'
import { daysUntil, nextPayday, toISODate } from '@/lib/hr/dates'
import { formatDate, formatDays, formatNumber, formatSAR } from '@/lib/hr/format'
import { fill, useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function EmployeeHomePage() {
  const { t, tx, lang } = useI18n()
  const { currentEmployee } = useActiveEmployee()
  const { company, payrollSettings, timeOffRequests } = useHr()

  if (!currentEmployee) return null

  // Payday & salary calculation
  const payday = nextPayday(company.payDay)
  const daysToPayday = daysUntil(toISODate(payday))
  const payrollLine = calculatePayrollLine(currentEmployee, [], [], payrollSettings)

  // Leave balances
  const balances = calculateEmployeeBalances(currentEmployee, timeOffRequests)
  const annualLeave = balances.find((b) => b.type === 'annual')!

  // Document expiry calculation
  const iqamaDaysLeft = currentEmployee.iqamaExpiry
    ? daysUntil(currentEmployee.iqamaExpiry)
    : null

  return (
    <div className="space-y-4">
      {/* Profile Welcome Banner */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base">
          {currentEmployee.name.en.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-bold text-foreground truncate">
            {tx(currentEmployee.name)}
          </h1>
          <p className="text-xs text-muted-foreground truncate">
            {tx(currentEmployee.title)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
              {currentEmployee.nationality}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              ID: {currentEmployee.id.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Payday Countdown Card */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            {t('estimatedNetSalary')}
          </span>
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-bold text-primary">
            {fill(t('nextPayDayIn'), { days: daysToPayday })}
          </span>
        </div>

        <div className="text-2xl font-black text-foreground">
          {formatSAR(payrollLine.net, lang)}
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs text-muted-foreground">
          <span>{fill(t('payDateEstimated'), { date: formatDate(payday, lang) })}</span>
          <Link
            href="/me/payslips"
            className="font-semibold text-primary hover:underline flex items-center gap-0.5"
          >
            <span>{t('viewPayslip')}</span>
            <ChevronRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>

      {/* Leave & Documents Summary Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Annual Leave Card */}
        <Link
          href="/me/leave"
          className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-xs transition hover:border-primary/40"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">{t('myLeaveBalance')}</span>
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>

          <div className="my-2">
            <span className="text-2xl font-bold text-foreground">
              {annualLeave.availableDays}
            </span>
            <span className="text-xs text-muted-foreground mx-1">
              / {annualLeave.totalDays} {t('days')}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-primary flex items-center gap-0.5">
            <span>{t('submitLeaveRequest')}</span>
            <ChevronRight className="h-3 w-3 rtl:-scale-x-100" />
          </span>
        </Link>

        {/* Document Status Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">{t('documentExpiryAlert')}</span>
            <ShieldCheck className="h-4 w-4 text-success" />
          </div>

          <div className="my-1.5 space-y-1">
            {iqamaDaysLeft !== null ? (
              <div className="text-xs">
                <span className="text-muted-foreground block text-[11px]">
                  {lang === 'ar' ? 'صلاحية الإقامة:' : 'Iqama validity:'}
                </span>
                <span
                  className={cn(
                    'font-bold',
                    iqamaDaysLeft <= 30
                      ? 'text-destructive'
                      : iqamaDaysLeft <= 60
                      ? 'text-warning'
                      : 'text-foreground',
                  )}
                >
                  {formatDays(iqamaDaysLeft, lang)}
                </span>
              </div>
            ) : (
              <div className="text-xs font-bold text-success">
                {lang === 'ar' ? 'مواطن سعودي' : 'Saudi Citizen'}
              </div>
            )}

            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-success" />
              <span>{t('contractValidUntil')}</span>
            </div>
          </div>

          <span className="text-[11px] text-muted-foreground truncate">
            {currentEmployee.iban.slice(0, 12)}…
          </span>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="space-y-2 pt-1">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
          {t('quickActions')}
        </h3>

        <div className="grid gap-2">
          <Link
            href="/me/payslips"
            className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-xs transition hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">{t('payslipsTitle')}</div>
                <div className="text-[11px] text-muted-foreground">
                  {lang === 'ar' ? 'استعراض المسيرات الشهرية المعتمدة' : 'View past reconciled monthly payslips'}
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground rtl:-scale-x-100" />
          </Link>

          <Link
            href="/me/leave"
            className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-xs transition hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">{t('myLeaveTitle')}</div>
                <div className="text-[11px] text-muted-foreground">
                  {lang === 'ar' ? 'طلب إجازة ومتابعة حالة الاعتماد' : 'Submit leave & track approval status'}
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground rtl:-scale-x-100" />
          </Link>

          <Link
            href="/me/letters"
            className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-xs transition hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">{t('lettersTitle')}</div>
                <div className="text-[11px] text-muted-foreground">
                  {lang === 'ar' ? 'إصدار شهادات تعريف بالراتب فورياً' : 'Generate official verified salary certificates'}
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground rtl:-scale-x-100" />
          </Link>

          <Link
            href="/me/assistant"
            className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-xs transition hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">{t('assistantTitle')}</div>
                <div className="text-[11px] text-muted-foreground">
                  {lang === 'ar' ? 'استفسر عن الراتب وسياسات العمل' : 'Ask questions about leave, payday & GOSI'}
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </div>
  )
}
