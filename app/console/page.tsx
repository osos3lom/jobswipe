'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  Clock,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { fill, useI18n } from '@/lib/i18n'
import { useHr } from '@/lib/hr/store'
import { departments } from '@/lib/hr/seed'
import { daysUntil, nextPayday, startOfToday, toISODate } from '@/lib/hr/dates'
import {
  countByStatus,
  headcountByDepartment,
  saudization,
} from '@/lib/hr/metrics'
import { calculateMonthlyPayroll } from '@/lib/hr/payroll'
import { getDocumentAlerts } from '@/lib/hr/compliance'
import {
  formatDate,
  formatDays,
  formatHijri,
  formatNumber,
  formatPercent,
  formatSAR,
} from '@/lib/hr/format'
import { cn } from '@/lib/utils'

export default function ConsoleDashboard() {
  const { t, tx, lang } = useI18n()
  const { company, employees, payrollRuns, payrollSettings } = useHr()

  const admin = employees.find((e) => e.id === company.adminId)
  const upcomingPayroll = calculateMonthlyPayroll(employees, payrollSettings)
  const displayPayroll = upcomingPayroll.totals.totalGross
  const saudi = saudization(employees)
  const alerts = getDocumentAlerts(employees, '60')
  const payday = nextPayday(company.payDay)
  const daysToPayday = daysUntil(toISODate(payday))
  const onboarding = employees.filter((e) => e.status === 'onboarding')
  const byDepartment = headcountByDepartment(employees)
  const busiest = byDepartment[0]?.count ?? 1

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'greetingMorning' : hour < 17 ? 'greetingAfternoon' : 'greetingEvening'
  const adminFirstName = admin ? tx(admin.name).split(' ')[0] : ''

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* 1. Apple Welcome Banner */}
      <div
        className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm backdrop-blur-xl transition-all"
        data-tour="dashboard-overview"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-[11px] font-semibold text-primary">
              <Sparkles className="h-3 w-3" />
              <span>{tx(company.name)}</span>
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {adminFirstName
                ? `${t(greeting)}${lang === 'ar' ? '، ' : ', '}${adminFirstName}`
                : t(greeting)}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {fill(t('dashboardSubtitle'), { company: tx(company.name) })}
            </p>
          </div>

          {/* Dual Umm al-Qura Date Capsule */}
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/40 px-4 py-2.5 text-start sm:text-end">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-foreground">
                {formatHijri(startOfToday(), lang)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {formatDate(startOfToday(), lang)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Apple Bento 4-KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          href="/console/people"
          icon={<Users className="h-4 w-4" />}
          label={t('kpiHeadcount')}
          value={formatNumber(employees.length, lang)}
          hint={fill(t('kpiHeadcountHint'), {
            onboarding: formatNumber(onboarding.length, lang),
            leave: formatNumber(countByStatus(employees, 'on_leave'), lang),
          })}
          badge={`${onboarding.length} ${t('navOnboarding')}`}
        />
        <Kpi
          href="/console/payroll"
          icon={<Wallet className="h-4 w-4" />}
          label={t('kpiPayroll')}
          value={formatSAR(displayPayroll, lang)}
          hint={fill(t('kpiPayrollHint'), { date: formatDate(payday, lang) })}
          badge={`WPS Mudad`}
        />
        <Kpi
          href="/console/compliance"
          icon={<ShieldCheck className="h-4 w-4" />}
          label={t('kpiSaudization')}
          value={formatPercent(saudi.rate, lang)}
          hint={fill(t('kpiSaudizationHint'), {
            saudi: formatNumber(saudi.saudi, lang),
            nonSaudi: formatNumber(saudi.nonSaudi, lang),
          })}
          tone="success"
          badge={saudi.rate >= 0.6 ? 'Platinum' : 'High Green'}
        />
        <Kpi
          href="/console/compliance"
          icon={<CalendarDays className="h-4 w-4" />}
          label={t('kpiDocs')}
          value={formatNumber(alerts.length, lang)}
          hint={t('kpiDocsHint')}
          tone={alerts.some((a) => a.daysLeft < 0) ? 'danger' : 'warning'}
          badge={alerts.some((a) => a.daysLeft < 0) ? 'Urgent' : 'Radar'}
        />
      </div>

      {/* 3. Focus Center & Department Allocation Bento */}
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Focus Center (Action Items) */}
        <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div>
              <h2 className="text-base font-bold text-foreground">
                {t('todos')}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === 'ar' ? 'المهام التشغيلية والاستحقاقات النظامية القادمة' : 'Immediate operational & compliance milestones'}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              {1 + alerts.slice(0, 3).length + onboarding.length}
            </span>
          </div>

          <ul className="mt-4 space-y-2.5">
            <Todo
              href="/console/payroll/run"
              dataTour="payroll-cta"
              icon={<Wallet className="h-4 w-4" />}
              tone="primary"
              title={fill(t('todoPayroll'), {
                month: new Intl.DateTimeFormat(
                  lang === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-GB',
                  { month: 'long' },
                ).format(payday),
              })}
              hint={fill(t('todoPayrollHint'), {
                days: formatDays(daysToPayday, lang),
                count: formatNumber(employees.length, lang),
              })}
            />
            {alerts.slice(0, 3).map((alert) => (
              <Todo
                key={alert.id}
                href={`/console/people/${alert.employee.id}`}
                icon={<AlertTriangle className="h-4 w-4" />}
                tone={alert.severity === 'destructive' ? 'danger' : alert.severity}
                title={fill(
                  t(
                    alert.daysLeft < 0
                      ? 'todoIqamaExpired'
                      : alert.daysLeft === 0
                        ? 'todoIqamaToday'
                        : 'todoIqamaExpiring',
                  ),
                  { name: tx(alert.employee.name), days: formatDays(alert.daysLeft, lang) },
                )}
                hint={`${tx(alert.title)} · ${tx(alert.employee.title)}`}
              />
            ))}
            {onboarding.map((employee) => (
              <Todo
                key={employee.id}
                href={`/console/people/${employee.id}`}
                icon={<ClipboardCheck className="h-4 w-4" />}
                tone="neutral"
                title={fill(t('todoOnboarding'), { name: tx(employee.name) })}
                hint={fill(t('todoOnboardingHint'), {
                  days: formatDays(daysUntil(employee.hireDate), lang),
                })}
              />
            ))}
          </ul>
        </section>

        {/* Department Allocation Bento */}
        <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <h2 className="text-base font-bold text-foreground">
                {t('byDepartment')}
              </h2>
              <span className="text-xs text-muted-foreground">
                {formatNumber(employees.length, lang)} {t('kpiHeadcount')}
              </span>
            </div>

            <ul className="mt-4 space-y-3">
              {byDepartment.map(({ department, count }) => {
                const meta = departments.find((d) => d.id === department)
                const percent = Math.round((count / employees.length) * 100)
                return (
                  <li key={department}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{meta ? tx(meta.name) : department}</span>
                      <span className="text-muted-foreground font-medium">
                        {formatNumber(count, lang)} ({percent}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${(count / busiest) * 100}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50">
            <Link
              href="/console/people"
              className="flex items-center justify-between text-xs font-semibold text-primary hover:underline"
            >
              <span>{t('navPeople')}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

function Kpi({
  icon,
  label,
  value,
  hint,
  tone = 'neutral',
  badge,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint: string
  tone?: 'neutral' | 'warning' | 'danger' | 'success'
  badge?: string
  href?: string
}) {
  const inner = (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:scale-105',
              tone === 'danger' && 'bg-destructive/10 text-destructive',
              tone === 'warning' && 'bg-warning/15 text-warning',
              tone === 'success' && 'bg-success/15 text-success',
              tone === 'neutral' && 'bg-primary/10 text-primary',
            )}
          >
            {icon}
          </span>
          {badge && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold',
                tone === 'danger' && 'bg-destructive/10 text-destructive',
                tone === 'warning' && 'bg-warning/15 text-warning',
                tone === 'success' && 'bg-success/15 text-success',
                tone === 'neutral' && 'bg-muted text-foreground/80',
              )}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="mt-3 text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground/90 border-t border-border/40 pt-2">{hint}</p>
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="group block rounded-3xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.99]"
      >
        {inner}
      </Link>
    )
  }

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
      {inner}
    </div>
  )
}

function Todo({
  icon,
  title,
  hint,
  tone,
  href,
  dataTour,
}: {
  icon: React.ReactNode
  title: string
  hint: string
  tone: 'neutral' | 'warning' | 'danger' | 'primary'
  href?: string
  dataTour?: string
}) {
  const content = (
    <>
      <span
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          tone === 'danger' && 'bg-destructive/10 text-destructive',
          tone === 'warning' && 'bg-warning/15 text-warning',
          tone === 'primary' && 'bg-primary/10 text-primary',
          tone === 'neutral' && 'bg-muted text-muted-foreground',
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {title}
        </span>
        <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:-scale-x-100 shrink-0 self-center" />
    </>
  )

  if (href) {
    return (
      <li data-tour={dataTour}>
        <Link
          href={href}
          className="group flex items-center gap-3.5 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 transition-all hover:border-primary/30 hover:bg-muted/60 active:scale-[0.99]"
        >
          {content}
        </Link>
      </li>
    )
  }

  return (
    <li data-tour={dataTour} className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
      {content}
    </li>
  )
}

