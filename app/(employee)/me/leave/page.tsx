'use client'

import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useActiveEmployee } from '@/lib/employee/employee-context'
import { useCreateTimeOffRequest, useHr } from '@/lib/hr/store'
import type { LeaveType } from '@/lib/hr/types'
import {
  STATUTORY_LEAVE_TYPES,
  calculateBusinessDays,
  calculateEmployeeBalances,
  getAnnualLeaveEntitlement,
} from '@/lib/hr/time-off'
import { daysFromToday } from '@/lib/hr/dates'
import { formatDate, formatDays, formatNumber } from '@/lib/hr/format'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function EmployeeLeavePage() {
  const { t, tx, lang } = useI18n()
  const { currentEmployee } = useActiveEmployee()
  const { timeOffRequests } = useHr()
  const createRequest = useCreateTimeOffRequest()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formType, setFormType] = useState<LeaveType>('annual')
  const [formStart, setFormStart] = useState(daysFromToday(2))
  const [formEnd, setFormEnd] = useState(daysFromToday(6))
  const [formReason, setFormReason] = useState('')
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null)

  const calculatedDays = useMemo(
    () => calculateBusinessDays(formStart, formEnd),
    [formStart, formEnd],
  )

  const balances = useMemo(() => {
    if (!currentEmployee) return []
    return calculateEmployeeBalances(currentEmployee, timeOffRequests)
  }, [currentEmployee, timeOffRequests])

  const myRequests = useMemo(() => {
    if (!currentEmployee) return []
    return timeOffRequests.filter((r) => r.employeeId === currentEmployee.id)
  }, [timeOffRequests, currentEmployee])

  if (!currentEmployee) return null

  const { isSeniorTenure } = getAnnualLeaveEntitlement(currentEmployee.hireDate)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentEmployee || calculatedDays <= 0) return

    createRequest({
      employeeId: currentEmployee.id,
      type: formType,
      startDate: formStart,
      endDate: formEnd,
      daysCount: calculatedDays,
      reason: formReason.trim() || undefined,
    })

    setIsModalOpen(false)
    setFormReason('')
    setFeedbackNotice(t('requestSentNotice'))
    setTimeout(() => setFeedbackNotice(null), 5000)
  }

  return (
    <div className="space-y-4">
      {/* Title & Request Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {t('myLeaveTitle')}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t('myLeaveSubtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" />
          <span>{t('submitLeaveRequest')}</span>
        </button>
      </div>

      {/* Success alert */}
      {feedbackNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-3 text-xs font-medium text-success animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Annual Leave Highlight Banner */}
      {(() => {
        const annual = balances.find((b) => b.type === 'annual')!
        return (
          <div className="rounded-2xl border border-primary/20 bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {t('myLeaveBalance')}
              </span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                {isSeniorTenure ? t('tenureOver5Years') : t('tenureUnder5Years')}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-foreground">
                {annual.availableDays}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('availableBalance')} ({annual.usedDays} {t('usedBalance')})
              </span>
            </div>

            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (annual.usedDays / annual.totalDays) * 100)}%`,
                }}
              />
            </div>
          </div>
        )
      })()}

      {/* Other Statutory Balances Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
          {lang === 'ar' ? 'الأرصدة النظامية الأخرى' : 'Other Leave Allowances'}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {balances
            .filter((b) => b.type !== 'annual')
            .slice(0, 4)
            .map((bal) => (
              <div
                key={bal.type}
                className="rounded-xl border border-border bg-card p-3 text-xs space-y-1"
              >
                <div className="text-muted-foreground truncate font-medium">
                  {tx(STATUTORY_LEAVE_TYPES[bal.type].name)}
                </div>
                <div className="text-base font-bold text-foreground">
                  {bal.availableDays} {t('days')}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {tx(STATUTORY_LEAVE_TYPES[bal.type].paidStatus)}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* My Leave Requests History */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
          {t('myRequestsHistory')} ({myRequests.length})
        </h3>

        {myRequests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
            {lang === 'ar' ? 'لم تقدم أي طلبات إجازة سابقة' : 'No submitted leave requests.'}
          </div>
        ) : (
          <div className="space-y-2">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-xl border border-border bg-card p-3 shadow-xs space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    {tx(STATUTORY_LEAVE_TYPES[req.type].name)}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold border',
                      req.status === 'approved' && 'bg-success/10 text-success border-success/20',
                      req.status === 'pending' && 'bg-warning/10 text-warning border-warning/20',
                      req.status === 'rejected' && 'bg-destructive/10 text-destructive border-destructive/20',
                    )}
                  >
                    {t(req.status === 'approved' ? 'approved' : req.status === 'pending' ? 'pendingApproval' : 'rejected')}
                  </span>
                </div>

                <div className="text-muted-foreground text-[11px] flex justify-between">
                  <span>
                    {formatDate(req.startDate, lang)} — {formatDate(req.endDate, lang)}
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatDays(req.daysCount, lang)}
                  </span>
                </div>

                {req.reason && (
                  <p className="text-[11px] text-muted-foreground italic">
                    &ldquo;{req.reason}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REQUEST TIME OFF MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="text-base font-bold text-foreground">
                {t('submitLeaveRequest')}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  {t('leaveType')}
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as LeaveType)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  {(Object.keys(STATUTORY_LEAVE_TYPES) as LeaveType[]).map((lt) => (
                    <option key={lt} value={lt}>
                      {tx(STATUTORY_LEAVE_TYPES[lt].name)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    {t('startDate')}
                  </label>
                  <input
                    type="date"
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    {t('endDate')}
                  </label>
                  <input
                    type="date"
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="rounded-xl bg-muted/40 p-2.5 flex justify-between items-center text-[11px]">
                <span className="text-muted-foreground">{t('workingDaysCount')}:</span>
                <span className="font-bold text-foreground text-xs">
                  {formatDays(calculatedDays, lang)}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  {t('leaveReason')}
                </label>
                <textarea
                  rows={2}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder={lang === 'ar' ? 'سبب الإجازة أو ملاحظات إضافية…' : 'Reason / notes…'}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border px-3 py-1.5 font-semibold text-foreground hover:bg-muted"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={calculatedDays <= 0}
                  className="rounded-xl bg-primary px-3.5 py-1.5 font-bold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50"
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
