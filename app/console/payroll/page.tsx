'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Coins,
  FileText,
  Percent,
  Play,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'
import { useHr, useUpdatePayrollSettings } from '@/lib/hr/store'
import { daysUntil, nextPayday, startOfToday, toISODate } from '@/lib/hr/dates'
import { formatDate, formatDays, formatHijri, formatNumber, formatPercent, formatSAR } from '@/lib/hr/format'
import { calculateMonthlyPayroll } from '@/lib/hr/payroll'
import { fill, useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function PayrollPage() {
  const { t, tx, lang } = useI18n()
  const { company, employees, payrollRuns, payrollSettings } = useHr()
  const updateSettings = useUpdatePayrollSettings()

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [editSaudiEmp, setEditSaudiEmp] = useState(payrollSettings.gosiSaudiEmployee * 100)
  const [editSaudiEmplyr, setEditSaudiEmplyr] = useState(payrollSettings.gosiSaudiEmployer * 100)
  const [editExpatEmplyr, setEditExpatEmplyr] = useState(payrollSettings.gosiExpatEmployer * 100)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const payday = nextPayday(company.payDay)
  const daysToPayday = daysUntil(toISODate(payday))
  const monthName = new Intl.DateTimeFormat(
    lang === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-GB',
    { month: 'long', year: 'numeric' },
  ).format(payday)

  const currentPeriodProjections = calculateMonthlyPayroll(employees, payrollSettings)

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      gosiSaudiEmployee: editSaudiEmp / 100,
      gosiSaudiEmployer: editSaudiEmplyr / 100,
      gosiExpatEmployer: editExpatEmplyr / 100,
    })
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      setSettingsOpen(false)
    }, 1200)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {t('payrollTitle')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('payrollSubtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>{t('editGosiRates')}</span>
          </button>
          <Link
            href="/console/payroll/run"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{t('runPayrollCta')}</span>
          </Link>
        </div>
      </div>

      {/* Current Pay Cycle Hero Card */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold tracking-tight text-foreground">{monthName}</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {t('currentPeriod')}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t('payDateLabel')}: {formatDate(payday, lang)} · {formatHijri(payday, lang)} ({formatDays(daysToPayday, lang)})
              </p>
            </div>
          </div>

          <Link
            href="/console/payroll/run"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            <span>{t('runPayrollCta')}</span>
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground">{t('totalTransferred')}</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-primary">
              {formatSAR(currentPeriodProjections.totals.totalNet, lang)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {fill(t('employeesCount'), {})}: {formatNumber(currentPeriodProjections.totals.employeeCount, lang)}
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-background/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground">{t('totalGrossPayroll')}</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-foreground">
              {formatSAR(currentPeriodProjections.totals.totalGross, lang)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {t('salaryBreakdownSaudiNote').split(':')[0]}
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-background/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground">{t('totalGosiAmount')}</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-foreground">
              {formatSAR(
                currentPeriodProjections.totals.totalEmployeeGosi +
                  currentPeriodProjections.totals.totalEmployerGosi,
                lang,
              )}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {t('colGosiEmployee')}: {formatSAR(currentPeriodProjections.totals.totalEmployeeGosi, lang)}
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-background/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground">{t('totalCompanyCost')}</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-foreground">
              {formatSAR(currentPeriodProjections.totals.totalEmployerCost, lang)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {t('colGross')} + {t('colGosiEmployer')}
            </p>
          </div>
        </div>
      </div>

      {/* GOSI Settings Illustrative Card */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{t('gosiSettingsTitle')}</h3>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  {t('gosiBadgeIllustrative')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{t('gosiSettingsSubtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="self-start rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted sm:self-auto"
          >
            {t('editGosiRates')}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-border/70 bg-background/50 p-3.5">
            <p className="text-[11px] font-medium text-muted-foreground">
              {t('gosiSaudiEmployeeRate')}
            </p>
            <p className="mt-1.5 text-lg font-black text-foreground">
              {formatPercent(payrollSettings.gosiSaudiEmployee, lang)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/50 p-3.5">
            <p className="text-[11px] font-medium text-muted-foreground">
              {t('gosiSaudiEmployerRate')}
            </p>
            <p className="mt-1.5 text-lg font-black text-foreground">
              {formatPercent(payrollSettings.gosiSaudiEmployer, lang)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/50 p-3.5">
            <p className="text-[11px] font-medium text-muted-foreground">
              {t('gosiExpatEmployeeRate')}
            </p>
            <p className="mt-1.5 text-lg font-black text-foreground">
              {formatPercent(payrollSettings.gosiExpatEmployee, lang)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/50 p-3.5">
            <p className="text-[11px] font-medium text-muted-foreground">
              {t('gosiExpatEmployerRate')}
            </p>
            <p className="mt-1.5 text-lg font-black text-foreground">
              {formatPercent(payrollSettings.gosiExpatEmployer, lang)}
            </p>
          </div>
        </div>
      </div>

      {/* Historical Runs List */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">{t('historicalRuns')}</h3>
              <p className="text-xs text-muted-foreground">{fill(t('showingCount'), { count: payrollRuns.length, total: payrollRuns.length })}</p>
            </div>
          </div>
        </div>

        {payrollRuns.length === 0 ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">{t('noPastRuns')}</p>
        ) : (
          <div className="mt-5 divide-y divide-border/60">
            {payrollRuns.map((run) => {
              const runDate = new Date(run.payDate)
              const runMonth = new Intl.DateTimeFormat(
                lang === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-GB',
                { month: 'long', year: 'numeric' },
              ).format(runDate)

              const firstEmployeeId = run.lines[0]?.employeeId || employees[0]?.id || 'e01'

              return (
                <div
                  key={run.id}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-muted font-mono text-xs font-bold">
                      {run.periodMonth.split('-')[1]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground">{runMonth}</h4>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          {t('statusSubmitted')}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(runDate, lang)} · {formatNumber(run.totals.employeeCount, lang)} {t('employeesCount').toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="text-end">
                      <p className="text-sm font-black text-foreground">
                        {formatSAR(run.totals.totalNet, lang)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {t('totalGrossPayroll')}: {formatSAR(run.totals.totalGross, lang)}
                      </p>
                    </div>

                    <Link
                      href={`/console/payroll/${run.id}/${firstEmployeeId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
                    >
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{t('viewPayslips')}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground rtl:-scale-x-100" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Edit GOSI Settings Modal / Drawer */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">{t('gosiSettingsTitle')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {t('gosiSettingsSubtitle')}
            </p>

            <form onSubmit={handleSaveSettings} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  {t('gosiSaudiEmployeeRate')} (%)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="30"
                  value={editSaudiEmp}
                  onChange={(e) => setEditSaudiEmp(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-10 w-full rounded-2xl border border-border bg-background px-3 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  {t('gosiSaudiEmployerRate')} (%)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="30"
                  value={editSaudiEmplyr}
                  onChange={(e) => setEditSaudiEmplyr(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-10 w-full rounded-2xl border border-border bg-background px-3 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  {t('gosiExpatEmployerRate')} (%)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="30"
                  value={editExpatEmplyr}
                  onChange={(e) => setEditExpatEmplyr(parseFloat(e.target.value) || 0)}
                  className="mt-1 h-10 w-full rounded-2xl border border-border bg-background px-3 text-sm font-semibold"
                />
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-2.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  {t('ratesSavedSuccess')}
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                >
                  {t('saveRates')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
