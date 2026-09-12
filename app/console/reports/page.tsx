'use client'

import { useMemo, useState } from 'react'
import {
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Filter,
  PieChart,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react'
import { useHr } from '@/lib/hr/store'
import { departments } from '@/lib/hr/seed'
import { calculatePayrollLine } from '@/lib/hr/payroll'
import { formatDate, formatNumber, formatPercent, formatSAR } from '@/lib/hr/format'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function ReportsPage() {
  const { t, tx, lang } = useI18n()
  const { employees, payrollRuns, payrollSettings, timeOffRequests } = useHr()

  const [selectedDept, setSelectedDept] = useState<string>('all')

  // Reconciled Metrics
  const totalEmployees = employees.length
  const saudiEmployees = useMemo(
    () => employees.filter((e) => e.nationality === 'SA').length,
    [employees],
  )
  const currentSaudizationRate = totalEmployees > 0 ? saudiEmployees / totalEmployees : 0

  // Total monthly employer cost calculated from current active employees
  const totalMonthlyEmployerCost = useMemo(() => {
    return employees.reduce((sum, emp) => {
      const line = calculatePayrollLine(emp, [], [], payrollSettings)
      return sum + line.employerCost
    }, 0)
  }, [employees, payrollSettings])

  // Leave utilization: Total approved days taken this year
  const totalLeaveDaysApproved = useMemo(() => {
    return timeOffRequests
      .filter((r) => r.status === 'approved')
      .reduce((sum, r) => sum + r.daysCount, 0)
  }, [timeOffRequests])

  // Department cost breakdown
  const departmentCosts = useMemo(() => {
    const map = new Map<string, { name: string; totalCost: number; count: number }>()

    departments.forEach((d) => {
      map.set(d.id, { name: tx(d.name), totalCost: 0, count: 0 })
    })

    employees.forEach((emp) => {
      const entry = map.get(emp.department)
      if (entry) {
        const line = calculatePayrollLine(emp, [], [], payrollSettings)
        entry.totalCost += line.employerCost
        entry.count += 1
      }
    })

    return Array.from(map.entries()).map(([id, val]) => ({
      id,
      ...val,
      pctOfTotal: totalMonthlyEmployerCost > 0 ? (val.totalCost / totalMonthlyEmployerCost) * 100 : 0,
    }))
  }, [employees, payrollSettings, totalMonthlyEmployerCost, tx])

  // Headcount timeline data (6 months)
  const headcountTimeline = [
    { month: lang === 'ar' ? 'أبريل' : 'Apr', count: 20 },
    { month: lang === 'ar' ? 'مايو' : 'May', count: 21 },
    { month: lang === 'ar' ? 'يونيو' : 'Jun', count: 22 },
    { month: lang === 'ar' ? 'يوليو' : 'Jul', count: 23 },
    { month: lang === 'ar' ? 'أغسطس' : 'Aug', count: 24 },
    { month: lang === 'ar' ? 'سبتمبر' : 'Sep', count: totalEmployees },
  ]

  // Saudization progression timeline
  const saudizationTimeline = [
    { month: lang === 'ar' ? 'أبريل' : 'Apr', rate: 0.50 },
    { month: lang === 'ar' ? 'مايو' : 'May', rate: 0.52 },
    { month: lang === 'ar' ? 'يونيو' : 'Jun', rate: 0.55 },
    { month: lang === 'ar' ? 'يوليو' : 'Jul', rate: 0.57 },
    { month: lang === 'ar' ? 'أغسطس' : 'Aug', rate: 0.58 },
    { month: lang === 'ar' ? 'سبتمبر' : 'Sep', rate: currentSaudizationRate },
  ]

  // Color-accessible palette for department visualization
  const DEPT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
    exec: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', bar: 'bg-indigo-500' },
    sales: { bg: 'bg-success/10', text: 'text-success', bar: 'bg-success' },
    finance: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', bar: 'bg-blue-500' },
    ops: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
    it: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-500' },
    hr: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', bar: 'bg-rose-500' },
    cs: { bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', bar: 'bg-teal-500' },
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('reportsTitle')}
            </h1>
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {t('illustrativeNotice')}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('reportsSubtitle')}
          </p>
        </div>
      </div>

      {/* KPI Overview Tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Workforce */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t('totalActiveStaff')}</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {formatNumber(totalEmployees, lang)}
            </span>
            <span className="text-xs font-semibold text-success flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" />
              +25% YTD
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {saudiEmployees} {lang === 'ar' ? 'سعودي' : 'Saudi'} · {totalEmployees - saudiEmployees} {lang === 'ar' ? 'مقيم' : 'Resident'}
          </p>
        </div>

        {/* Monthly Employer Cost */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t('totalMonthlyPayrollCost')}</span>
            <Wallet className="h-4 w-4 text-success" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {formatSAR(Math.round(totalMonthlyEmployerCost), lang)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {lang === 'ar' ? 'شامل اشتراكات التأمينات والبدلات' : 'Includes GOSI & statutory allowances'}
          </p>
        </div>

        {/* Saudization Rate & Band */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t('currentSaudizationPct')}</span>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {formatPercent(currentSaudizationRate, lang)}
            </span>
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success border border-success/20">
              {lang === 'ar' ? 'بلاتيني' : 'Platinum'}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {lang === 'ar' ? 'الحد الأدنى للبلاتيني: ٣٨٪' : 'Platinum Threshold: 38%'}
          </p>
        </div>

        {/* Leave Utilization */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t('leaveUtilizationRate')}</span>
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {formatNumber(totalLeaveDaysApproved, lang)}
            </span>
            <span className="text-xs text-muted-foreground">{t('days')}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {lang === 'ar' ? 'إجمالي الأيام المعتمدة خلال العام' : 'Approved leave days YTD'}
          </p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Headcount Trajectory Chart */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                {t('headcountGrowth')}
              </h2>
              <p className="text-xs text-muted-foreground">
                {lang === 'ar' ? 'مسار التوسع والتوظيف منذ أبريل ٢٠٢٦' : 'Workforce scale trajectory over last 6 months'}
              </p>
            </div>
            <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              +{totalEmployees - 20} {lang === 'ar' ? 'موظفين جدد' : 'net new hires'}
            </span>
          </div>

          {/* SVG Headcount Curve */}
          <div className="relative pt-6 pb-2">
            <div className="h-48 w-full flex items-end justify-between gap-2 px-2">
              {headcountTimeline.map((item, idx) => {
                const heightPercent = Math.round((item.count / 30) * 100)
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-xs font-bold text-foreground transition group-hover:text-primary">
                      {item.count}
                    </span>
                    <div className="w-full max-w-[40px] bg-muted rounded-t-lg overflow-hidden h-36 flex items-end">
                      <div
                        className="w-full bg-primary/80 hover:bg-primary transition-all duration-500 rounded-t-lg"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {item.month}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Saudization Trend Chart */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                {t('saudizationTrend')}
              </h2>
              <p className="text-xs text-muted-foreground">
                {lang === 'ar' ? 'متابعة نسبة السعودة مقارنة بمتطلب النطاق البلاتيني' : 'Saudization curve comfortably within Platinum band'}
              </p>
            </div>
            <span className="rounded-lg bg-success/10 px-2.5 py-1 text-xs font-bold text-success border border-success/20">
              {formatPercent(currentSaudizationRate, lang)}
            </span>
          </div>

          {/* SVG Line / Bar visualization */}
          <div className="relative pt-6 pb-2">
            <div className="h-48 w-full flex items-end justify-between gap-2 px-2">
              {saudizationTimeline.map((item, idx) => {
                const heightPercent = Math.round(item.rate * 100)
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-xs font-bold text-success">
                      {Math.round(item.rate * 100)}%
                    </span>
                    <div className="w-full max-w-[40px] bg-muted rounded-t-lg overflow-hidden h-36 flex items-end">
                      <div
                        className="w-full bg-success hover:bg-success/90 transition-all duration-500 rounded-t-lg"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {item.month}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-success" />
                <span>{lang === 'ar' ? 'نسبة المنشأة الفعلية' : 'Company Actual'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-0.5 w-4 bg-muted-foreground" />
                <span>{lang === 'ar' ? 'الحد الأدنى للبلاتيني (٣٨٪)' : 'Platinum Floor (38%)'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Payroll Cost Breakdown Table & Bars */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {t('departmentPayrollCost')}
            </h2>
            <p className="text-xs text-muted-foreground">
              {lang === 'ar' ? 'توزيع تكاليف الأجور واشتراكات التأمينات حسب كل إدارة' : 'Distribution of monthly wages and GOSI employer contributions by department'}
            </p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {departments.length} {lang === 'ar' ? 'أقسام عمل' : 'business units'}
          </span>
        </div>

        {/* Stacked Department Percentage Bar */}
        <div className="w-full bg-muted rounded-xl h-4 overflow-hidden flex shadow-inner">
          {departmentCosts.map((dept) => {
            const colorCfg = DEPT_COLORS[dept.id] ?? { bar: 'bg-primary' }
            return (
              <div
                key={dept.id}
                title={`${dept.name}: ${dept.pctOfTotal.toFixed(1)}%`}
                className={cn('h-full transition-all duration-500', colorCfg.bar)}
                style={{ width: `${dept.pctOfTotal}%` }}
              />
            )
          })}
        </div>

        {/* Department List Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          {departmentCosts.map((dept) => {
            const colorCfg = DEPT_COLORS[dept.id] ?? {
              bg: 'bg-muted',
              text: 'text-foreground',
              bar: 'bg-primary',
            }

            return (
              <div
                key={dept.id}
                className="rounded-xl border border-border bg-muted/20 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className={cn('text-xs font-bold rounded-md px-2 py-0.5', colorCfg.bg, colorCfg.text)}>
                    {dept.name}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {dept.pctOfTotal.toFixed(1)}%
                  </span>
                </div>

                <div className="text-base font-bold text-foreground">
                  {formatSAR(Math.round(dept.totalCost), lang)}
                </div>

                <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>{dept.count} {lang === 'ar' ? 'موظفين' : 'staff'}</span>
                  <span>
                    {dept.count > 0 ? formatSAR(Math.round(dept.totalCost / dept.count), lang) : 0} / {lang === 'ar' ? 'موظف' : 'emp'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
