'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  CalendarDays,
  ClipboardCheck,
  ShieldCheck,
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
  iqamaAlerts,
  saudization,
} from '@/lib/hr/metrics'
import { calculateMonthlyPayroll } from '@/lib/hr/payroll'
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
  const currentProjections = calculateMonthlyPayroll(employees, payrollSettings)
  const latestRun = payrollRuns[0]
  const displayPayroll = latestRun ? latestRun.totals.totalNet : currentProjections.totals.totalNet
  const saudi = saudization(employees)
  const alerts = iqamaAlerts(employees)
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
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {adminFirstName
              ? `${t(greeting)}${lang === 'ar' ? '، ' : ', '}${adminFirstName}`
              : t(greeting)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {fill(t('dashboardSubtitle'), { company: tx(company.name) })}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-3 py-2 text-end">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t('hijriToday')}
          </p>
          <p className="text-sm font-semibold">{formatHijri(startOfToday(), lang)}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          href="/console/people"
          icon={<Users className="h-4 w-4" />}
          label={t('kpiHeadcount')}
          value={formatNumber(employees.length, lang)}
          hint={fill(t('kpiHeadcountHint'), {
            onboarding: formatNumber(onboarding.length, lang),
            leave: formatNumber(countByStatus(employees, 'on_leave'), lang),
          })}
        />
        <Kpi
          href="/console/payroll"
          icon={<Wallet className="h-4 w-4" />}
          label={t('kpiPayroll')}
          value={formatSAR(displayPayroll, lang)}
          hint={fill(t('kpiPayrollHint'), { date: formatDate(payday, lang) })}
        />
        <Kpi
          icon={<ShieldCheck className="h-4 w-4" />}
          label={t('kpiSaudization')}
          value={formatPercent(saudi.rate, lang)}
          hint={fill(t('kpiSaudizationHint'), {
            saudi: formatNumber(saudi.saudi, lang),
            nonSaudi: formatNumber(saudi.nonSaudi, lang),
          })}
        />
        <Kpi
          href="/console/people"
          icon={<CalendarDays className="h-4 w-4" />}
          label={t('kpiDocs')}
          value={formatNumber(alerts.length, lang)}
          hint={t('kpiDocsHint')}
          tone={alerts.some((a) => a.daysLeft < 0) ? 'danger' : 'warning'}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-3xl border border-border bg-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t('todos')}
          </h2>
          <ul className="mt-3 space-y-2">
            <Todo
              href="/console/payroll/run"
              icon={<Wallet className="h-4 w-4" />}
              tone="neutral"
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
            {alerts.slice(0, 3).map(({ employee, daysLeft }) => (
              <Todo
                key={employee.id}
                href={`/console/people/${employee.id}`}
                icon={<AlertTriangle className="h-4 w-4" />}
                tone={daysLeft < 0 ? 'danger' : 'warning'}
                title={fill(
                  t(
                    daysLeft < 0
                      ? 'todoIqamaExpired'
                      : daysLeft === 0
                        ? 'todoIqamaToday'
                        : 'todoIqamaExpiring',
                  ),
                  { name: tx(employee.name), days: formatDays(daysLeft, lang) },
                )}
                hint={tx(employee.title)}
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

        <section className="rounded-3xl border border-border bg-card p-4 sm:p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t('byDepartment')}
          </h2>
          <ul className="mt-3 space-y-2.5">
            {byDepartment.map(({ department, count }) => {
              const meta = departments.find((d) => d.id === department)
              return (
                <li key={department}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{meta ? tx(meta.name) : department}</span>
                    <span className="text-muted-foreground">
                      {formatNumber(count, lang)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(count / busiest) * 100}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
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
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint: string
  tone?: 'neutral' | 'warning' | 'danger'
  href?: string
}) {
  const inner = (
    <>
      <div className="flex items-center gap-2 text-muted-foreground">
        <span
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            tone === 'danger' && 'bg-destructive/10 text-destructive',
            tone === 'warning' && 'bg-warning/12 text-warning',
            tone === 'neutral' && 'bg-primary/10 text-primary',
          )}
        >
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="group block rounded-3xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
      >
        {inner}
      </Link>
    )
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-4">
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
}: {
  icon: React.ReactNode
  title: string
  hint: string
  tone: 'neutral' | 'warning' | 'danger'
  href?: string
}) {
  const content = (
    <>
      <span
        className={cn(
          'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
          tone === 'danger' && 'bg-destructive/10 text-destructive',
          tone === 'warning' && 'bg-warning/12 text-warning',
          tone === 'neutral' && 'bg-primary/10 text-primary',
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium transition-colors group-hover:text-primary">
          {title}
        </span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </>
  )

  if (href) {
    return (
      <li>
        <Link
          href={href}
          className="group flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-muted/40"
        >
          {content}
        </Link>
      </li>
    )
  }

  return (
    <li className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 px-3 py-2.5">
      {content}
    </li>
  )
}
