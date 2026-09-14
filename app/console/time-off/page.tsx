'use client'

import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Filter,
  Moon,
  Plus,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
  Users,
  X,
} from 'lucide-react'
import {
  useApproveTimeOffRequest,
  useCreateTimeOffRequest,
  useHr,
  useRejectTimeOffRequest,
  useToggleRamadanHours,
} from '@/lib/hr/store'
import type { LeaveType, TimeOffRequest } from '@/lib/hr/types'
import {
  SAUDI_PUBLIC_HOLIDAYS_2026,
  STATUTORY_LEAVE_TYPES,
  calculateBusinessDays,
  calculateEmployeeBalances,
  getAnnualLeaveEntitlement,
} from '@/lib/hr/time-off'
import { formatDate, formatDays, formatNumber } from '@/lib/hr/format'
import { toISODate, startOfToday, daysFromToday } from '@/lib/hr/dates'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function TimeOffPage() {
  const { t, tx, lang } = useI18n()
  const { employees, timeOffRequests, ramadanHoursEnabled } = useHr()
  const approveRequest = useApproveTimeOffRequest()
  const rejectRequest = useRejectTimeOffRequest()
  const createRequest = useCreateTimeOffRequest()
  const toggleRamadan = useToggleRamadanHours()

  const [activeTab, setActiveTab] = useState<'queue' | 'balances' | 'calendar'>('queue')
  const [selectedDept, setSelectedDept] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state for new leave request
  const [formEmployeeId, setFormEmployeeId] = useState(employees[0]?.id ?? 'e01')
  const [formLeaveType, setFormLeaveType] = useState<LeaveType>('annual')
  const [formStartDate, setFormStartDate] = useState(daysFromToday(3))
  const [formEndDate, setFormEndDate] = useState(daysFromToday(7))
  const [formReason, setFormReason] = useState('')

  const calculatedDays = useMemo(
    () => calculateBusinessDays(formStartDate, formEndDate),
    [formStartDate, formEndDate],
  )

  const pendingRequests = useMemo(
    () => timeOffRequests.filter((r) => r.status === 'pending'),
    [timeOffRequests],
  )

  const approvedRequests = useMemo(
    () => timeOffRequests.filter((r) => r.status === 'approved'),
    [timeOffRequests],
  )

  const employeesOnLeaveCount = useMemo(() => {
    return employees.filter((e) => e.status === 'on_leave').length
  }, [employees])

  const seniorTenureCount = useMemo(() => {
    return employees.filter((e) => getAnnualLeaveEntitlement(e.hireDate).isSeniorTenure).length
  }, [employees])

  const filteredEmployees = useMemo(() => {
    if (selectedDept === 'all') return employees
    return employees.filter((e) => e.department === selectedDept)
  }, [employees, selectedDept])

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formEmployeeId || !formStartDate || !formEndDate || calculatedDays <= 0) return

    createRequest({
      employeeId: formEmployeeId,
      type: formLeaveType,
      startDate: formStartDate,
      endDate: formEndDate,
      daysCount: calculatedDays,
      reason: formReason.trim() || undefined,
    })

    setFormReason('')
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('timeOffTitle')}
            </h1>
            <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success border border-success/20">
              {t('illustrativeNotice')}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('timeOffSubtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          <span>{t('requestTimeOff')}</span>
        </button>
      </div>

      {/* Ramadan Reduced Hours Setting Card (Article 98) */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition hover:border-primary/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition',
                ramadanHoursEnabled
                  ? 'bg-warning/15 text-warning'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">
                  {t('ramadanModeTitle')}
                </h2>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border',
                    ramadanHoursEnabled
                      ? 'bg-warning/10 text-warning border-warning/30'
                      : 'bg-muted text-muted-foreground border-border',
                  )}
                >
                  {ramadanHoursEnabled
                    ? t('ramadanActiveBadge')
                    : t('ramadanStandardBadge')}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t('ramadanModeDesc')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleRamadan}
            className={cn(
              'inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition shrink-0',
              ramadanHoursEnabled
                ? 'bg-warning text-white hover:bg-warning shadow-xs'
                : 'border border-border bg-background text-foreground hover:bg-muted',
            )}
          >
            {ramadanHoursEnabled ? (
              <span className="flex items-center gap-1.5">
                <Sun className="h-4 w-4" />
                {lang === 'ar' ? 'الرجوع للدوام الاعتيادي' : 'Revert to 8h Standard'}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Moon className="h-4 w-4" />
                {lang === 'ar' ? 'تفعيل دوام رمضان (٦ ساعات)' : 'Activate Ramadan 6h'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t('pendingQueue')}</span>
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {formatNumber(pendingRequests.length, lang)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {lang === 'ar' ? 'طلبات تتطلب قرار الإدارة' : 'Awaiting HR action'}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{lang === 'ar' ? 'في إجازة حالياً' : 'Currently on leave'}</span>
            <User className="h-4 w-4 text-chart-4" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {formatNumber(employeesOnLeaveCount, lang)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {lang === 'ar' ? 'حالة معتمدة نشطة' : 'Active approved leaves'}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{lang === 'ar' ? 'فئة ٣٠ يوماً (م ١٠٩)' : 'Art. 109 (30d Tier)'}</span>
            <ShieldCheck className="h-4 w-4 text-success" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {formatNumber(seniorTenureCount, lang)}
            <span className="text-xs font-normal text-muted-foreground mx-1">
              / {formatNumber(employees.length, lang)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {lang === 'ar' ? 'خدمة أكثر من ٥ سنوات' : 'Tenure ≥ 5 years'}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{lang === 'ar' ? 'العطلات القادمة' : 'Public Holidays'}</span>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {formatNumber(SAUDI_PUBLIC_HOLIDAYS_2026.length, lang)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground truncate">
            {tx(SAUDI_PUBLIC_HOLIDAYS_2026[0].name)}
          </p>
        </div>
      </div>

      {/* TABS CONTROLLER */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={cn(
            'flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-semibold transition',
            activeTab === 'queue'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <span>{t('pendingApprovalsQueue')}</span>
          {pendingRequests.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-bold">
              {formatNumber(pendingRequests.length, lang)}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('balances')}
          className={cn(
            'flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-semibold transition',
            activeTab === 'balances'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <span>{t('employeeBalancesRoster')}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={cn(
            'flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-semibold transition',
            activeTab === 'calendar'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <span>{t('officialHolidaysTab')}</span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVAL QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <CheckCircle2 className="h-10 w-10 text-success mb-3" />
              <h3 className="text-base font-semibold text-foreground">
                {lang === 'ar' ? 'سجل الطلبات فارغ' : 'All caught up!'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                {lang === 'ar'
                  ? 'لا توجد طلبات إجازة معلقة بانتظار الاعتماد حالياً.'
                  : 'There are no pending leave requests awaiting manager approval.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {pendingRequests.map((req) => {
                const emp = employees.find((e) => e.id === req.employeeId)
                const leaveMeta = STATUTORY_LEAVE_TYPES[req.type]
                const { isSeniorTenure } = emp
                  ? getAnnualLeaveEntitlement(emp.hireDate)
                  : { isSeniorTenure: false }

                return (
                  <div
                    key={req.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs transition hover:border-border/80"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                        {emp ? emp.name.en.slice(0, 2).toUpperCase() : '??'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {emp ? tx(emp.name) : req.employeeId}
                          </span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">
                            {emp ? tx(emp.title) : ''}
                          </span>
                          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {tx(leaveMeta.name)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {formatDate(req.startDate, lang)} — {formatDate(req.endDate, lang)}
                          </span>
                          <span>
                            ({formatDays(req.daysCount, lang)})
                          </span>
                          {req.type === 'annual' && (
                            <span
                              className={cn(
                                'rounded px-1.5 py-0.5 font-medium',
                                isSeniorTenure
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-chart-4/10 text-chart-4',
                              )}
                            >
                              {isSeniorTenure
                                ? t('tenureOver5Years')
                                : t('tenureUnder5Years')}
                            </span>
                          )}
                        </div>

                        {req.reason && (
                          <p className="text-xs text-muted-foreground italic pt-0.5">
                            &ldquo;{req.reason}&rdquo;
                          </p>
                        )}

                        <div className="pt-1 text-[11px] text-muted-foreground/80 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-muted-foreground" />
                          <span>{tx(leaveMeta.legalRef)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => rejectRequest(req.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 px-3.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>{t('rejectRequest')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => approveRequest(req.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>{t('approveRequest')}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Approved history */}
          {approvedRequests.length > 0 && (
            <div className="mt-8 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                {lang === 'ar' ? 'سجل الإجازات المعتمدة حديثاً' : 'Recently Approved Leaves'}
              </h3>
              <div className="divide-y divide-border rounded-2xl border border-border bg-card">
                {approvedRequests.slice(0, 5).map((req) => {
                  const emp = employees.find((e) => e.id === req.employeeId)
                  return (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3.5 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                        <span className="font-medium text-foreground">
                          {emp ? tx(emp.name) : req.employeeId}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {tx(STATUTORY_LEAVE_TYPES[req.type].name)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground text-xs">
                        <span>
                          {formatDate(req.startDate, lang)} - {formatDate(req.endDate, lang)}
                        </span>
                        <span className="font-semibold text-foreground">
                          {formatDays(req.daysCount, lang)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EMPLOYEE LEAVE BALANCES */}
      {activeTab === 'balances' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 text-xs sm:text-sm text-muted-foreground flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <span>{t('annualLeaveArticle109Note')}</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="py-3 px-4 text-start font-medium">{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th className="py-3 px-4 text-start font-medium">{lang === 'ar' ? 'فئة الخدمة (المادة ١٠٩)' : 'Tenure Tier (Art. 109)'}</th>
                  <th className="py-3 px-4 text-start font-medium">{t('statutoryAllowance')}</th>
                  <th className="py-3 px-4 text-start font-medium">{t('usedBalance')}</th>
                  <th className="py-3 px-4 text-start font-medium">{t('availableBalance')}</th>
                  <th className="py-3 px-4 text-start font-medium">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((emp) => {
                  const { entitlementDays, isSeniorTenure, tenureYears } = getAnnualLeaveEntitlement(emp.hireDate)
                  const balances = calculateEmployeeBalances(emp, timeOffRequests)
                  const annualBal = balances.find((b) => b.type === 'annual')!

                  return (
                    <tr key={emp.id} className="hover:bg-muted/30 transition">
                      <td className="py-3 px-4">
                        <div className="font-medium text-foreground">{tx(emp.name)}</div>
                        <div className="text-xs text-muted-foreground">{tx(emp.title)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                            isSeniorTenure
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'bg-chart-4/10 text-chart-4 border border-chart-4/20',
                          )}
                        >
                          {isSeniorTenure ? (
                            lang === 'ar' ? `٥+ سنوات (${tenureYears} سنة)` : `≥ 5 yrs (${tenureYears}y)`
                          ) : (
                            lang === 'ar' ? `< ٥ سنوات (${tenureYears} سنة)` : `< 5 yrs (${tenureYears}y)`
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {formatDays(entitlementDays, lang)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {formatDays(annualBal.usedDays, lang)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-success">
                          {formatDays(annualBal.availableDays, lang)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                            emp.status === 'on_leave'
                              ? 'bg-warning/10 text-warning'
                              : emp.status === 'active'
                              ? 'bg-success/10 text-success'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          {emp.status === 'on_leave'
                            ? lang === 'ar' ? 'في إجازة' : 'On Leave'
                            : emp.status === 'active'
                            ? lang === 'ar' ? 'نشط' : 'Active'
                            : lang === 'ar' ? 'تأهيل' : 'Onboarding'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PUBLIC HOLIDAYS & TEAM CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {t('publicHolidays2026')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('hijriApproximateNote')}
                </p>
              </div>
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {lang === 'ar' ? 'عام ٢٠٢٦م / ١٤٤٧هـ' : '2026 / 1447H'}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {SAUDI_PUBLIC_HOLIDAYS_2026.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-start justify-between rounded-xl border border-border bg-muted/20 p-4"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      {tx(holiday.name)}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(holiday.gregorianDate, lang)}
                    </p>
                    {holiday.hijriNote && (
                      <p className="text-xs font-medium text-success">
                        {tx(holiday.hijriNote)}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex rounded-lg bg-card px-2.5 py-1 text-xs font-bold text-foreground border border-border">
                    {formatDays(holiday.durationDays, lang)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <h3 className="text-base font-semibold text-foreground mb-4">
              {lang === 'ar' ? 'الإجازات المجدولة القادمة لفريق العمل' : 'Upcoming Scheduled Team Leaves'}
            </h3>
            <div className="space-y-3">
              {approvedRequests.map((req) => {
                const emp = employees.find((e) => e.id === req.employeeId)
                return (
                  <div
                    key={req.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/10 p-3.5 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {emp ? emp.name.en.slice(0, 2).toUpperCase() : '??'}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{emp ? tx(emp.name) : req.employeeId}</div>
                        <div className="text-xs text-muted-foreground">{tx(STATUTORY_LEAVE_TYPES[req.type].name)}</div>
                      </div>
                    </div>
                    <div className="text-end text-xs text-muted-foreground">
                      <div className="font-semibold text-foreground">
                        {formatDate(req.startDate, lang)} — {formatDate(req.endDate, lang)}
                      </div>
                      <div>{formatDays(req.daysCount, lang)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* REQUEST LEAVE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {t('requestTimeOff')}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  {lang === 'ar' ? 'الموظف' : 'Employee'}
                </label>
                <select
                  value={formEmployeeId}
                  onChange={(e) => setFormEmployeeId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {tx(emp.name)} — {tx(emp.title)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  {t('leaveType')}
                </label>
                <select
                  value={formLeaveType}
                  onChange={(e) => setFormLeaveType(e.target.value as LeaveType)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {(Object.keys(STATUTORY_LEAVE_TYPES) as LeaveType[]).map((lt) => (
                    <option key={lt} value={lt}>
                      {tx(STATUTORY_LEAVE_TYPES[lt].name)} ({tx(STATUTORY_LEAVE_TYPES[lt].paidStatus)})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {tx(STATUTORY_LEAVE_TYPES[formLeaveType].legalRef)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {t('startDate')}
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {t('endDate')}
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs flex items-center justify-between">
                <span className="text-muted-foreground">{t('workingDaysCount')}:</span>
                <span className="font-bold text-foreground text-sm">
                  {formatDays(calculatedDays, lang)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  {t('leaveReason')}
                </label>
                <textarea
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder={lang === 'ar' ? 'ملاحظات أو تفاصيل إضافية…' : 'Optional reason or vacation plans…'}
                  rows={2}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={calculatedDays <= 0}
                  className="rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {t('submitLeaveRequest')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
