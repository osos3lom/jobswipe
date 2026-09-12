'use client'

import { useMemo, useState } from 'react'
import {
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Filter,
  Plus,
  Save,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react'
import { useHr, useSavePerformanceReview } from '@/lib/hr/store'
import type { PerformanceReview, SmartGoal } from '@/lib/hr/types'
import { formatDate, formatNumber } from '@/lib/hr/format'
import { startOfToday, toISODate } from '@/lib/hr/dates'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function PerformancePage() {
  const { t, tx, lang } = useI18n()
  const { employees, performanceReviews } = useHr()
  const saveReview = useSavePerformanceReview()

  const [selectedDept, setSelectedDept] = useState<string>('all')
  const [activeModalReview, setActiveModalReview] = useState<{
    review: PerformanceReview
    isNew: boolean
  } | null>(null)

  // Filter employees
  const filteredEmployees = useMemo(() => {
    if (selectedDept === 'all') return employees
    return employees.filter((e) => e.department === selectedDept)
  }, [employees, selectedDept])

  const reviewsMap = useMemo(() => {
    const map = new Map<string, PerformanceReview>()
    performanceReviews.forEach((r) => map.set(r.employeeId, r))
    return map
  }, [performanceReviews])

  const completedReviewsCount = useMemo(() => {
    return employees.filter((e) => reviewsMap.has(e.id)).length
  }, [employees, reviewsMap])

  const averageRating = useMemo(() => {
    if (performanceReviews.length === 0) return 0
    const sum = performanceReviews.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / performanceReviews.length) * 10) / 10
  }, [performanceReviews])

  const handleOpenReviewModal = (empId: string) => {
    const existing = reviewsMap.get(empId)
    if (existing) {
      setActiveModalReview({
        review: { ...existing, goals: [...existing.goals] },
        isNew: false,
      })
    } else {
      const newReview: PerformanceReview = {
        id: `perf-${Date.now()}`,
        employeeId: empId,
        cycle: 'Q3 2026 Mid-Year Review',
        rating: 4.0,
        feedback: '',
        reviewerId: 'e02',
        updatedAt: toISODate(startOfToday()),
        goals: [
          {
            id: `g-${Date.now()}-1`,
            title: { en: 'Core department OKR achievement', ar: 'تحقيق المستهدفات الأساسية للقسم' },
            targetMetric: '100% completion',
            progress: 75,
            status: 'on_track',
          },
        ],
      }
      setActiveModalReview({ review: newReview, isNew: true })
    }
  }

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeModalReview) return
    saveReview(activeModalReview.review)
    setActiveModalReview(null)
  }

  const handleAddGoal = () => {
    if (!activeModalReview) return
    const newGoal: SmartGoal = {
      id: `g-${Date.now()}`,
      title: { en: 'New quarterly objective', ar: 'هدف ربع سنوي جديد' },
      targetMetric: 'Target milestone',
      progress: 50,
      status: 'on_track',
    }
    setActiveModalReview({
      ...activeModalReview,
      review: {
        ...activeModalReview.review,
        goals: [...activeModalReview.review.goals, newGoal],
      },
    })
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('performanceTitle')}
            </h1>
            <span className="inline-flex items-center rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-600 dark:text-violet-400 border border-violet-500/20">
              {t('illustrativeNotice')}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('performanceSubtitle')}
          </p>
        </div>
      </div>

      {/* Cycle Banner Card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">
                {t('currentReviewCycle')}
              </h2>
              <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success border border-success/20">
                {t('active')}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {lang === 'ar'
                ? 'فترة التقييم للأداء نصف السنوي وتحديث الأهداف الذكية (OKRs) لجميع الموظفين.'
                : 'Mid-year performance assessment and quarterly SMART goals tracking.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-s border-border pt-3 sm:pt-0 sm:ps-5">
          <div className="text-center sm:text-start">
            <div className="text-xs text-muted-foreground">{lang === 'ar' ? 'نسبة الإنجاز' : 'Completed'}</div>
            <div className="text-lg font-bold text-foreground">
              {completedReviewsCount} / {employees.length}
            </div>
          </div>
          <div className="text-center sm:text-start">
            <div className="text-xs text-muted-foreground">{lang === 'ar' ? 'متوسط التقييم' : 'Avg Rating'}</div>
            <div className="flex items-center gap-1 text-lg font-bold text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <span>{averageRating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Reviews Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((emp) => {
          const review = reviewsMap.get(emp.id)
          const goals = review?.goals ?? []

          return (
            <div
              key={emp.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition hover:border-border/80 space-y-4"
            >
              <div className="space-y-3">
                {/* Employee Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{tx(emp.name)}</h3>
                    <p className="text-xs text-muted-foreground">{tx(emp.title)}</p>
                  </div>
                  {review ? (
                    <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{review.rating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="rounded-lg bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                      {lang === 'ar' ? 'قيد التقييم' : 'Pending'}
                    </span>
                  )}
                </div>

                {/* Goals Progress */}
                {goals.length > 0 ? (
                  <div className="space-y-2 pt-1 border-t border-border/60">
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {t('smartGoalsTitle')} ({goals.length})
                    </div>
                    {goals.slice(0, 2).map((goal) => (
                      <div key={goal.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground truncate max-w-[180px]">
                            {tx(goal.title)}
                          </span>
                          <span className="text-muted-foreground font-semibold">
                            {goal.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              goal.progress >= 90
                                ? 'bg-success'
                                : goal.progress >= 60
                                ? 'bg-blue-500'
                                : 'bg-amber-500',
                            )}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pt-2 text-xs text-muted-foreground italic">
                    {lang === 'ar' ? 'لم تُحدد أهداف بعد لهذا الموظف.' : 'No quarterly goals established yet.'}
                  </div>
                )}

                {/* Feedback snippet */}
                {review?.feedback && (
                  <p className="text-xs text-muted-foreground line-clamp-2 italic pt-1">
                    &ldquo;{review.feedback}&rdquo;
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => handleOpenReviewModal(emp.id)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/20 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                >
                  <Edit3 className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {review
                      ? (lang === 'ar' ? 'تعديل التقييم والأهداف' : 'Edit Review & Goals')
                      : (lang === 'ar' ? 'بدء تقييم الأداء' : 'Start Review')}
                  </span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* EDIT / CREATE REVIEW MODAL */}
      {activeModalReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {lang === 'ar' ? 'تقييم الأداء نصف السنوي' : 'Performance Review'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {tx(employees.find((e) => e.id === activeModalReview.review.employeeId)?.name)} · {activeModalReview.review.cycle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalReview(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Rating 1 to 5 */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {t('overallRating')}
                  </label>
                  <span className="text-sm font-bold text-amber-500">
                    {activeModalReview.review.rating.toFixed(1)} / 5.0
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={activeModalReview.review.rating}
                  onChange={(e) =>
                    setActiveModalReview({
                      ...activeModalReview,
                      review: {
                        ...activeModalReview.review,
                        rating: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                  <span>1.0 (Needs Improvement)</span>
                  <span>3.0 (Meets)</span>
                  <span>5.0 (Outstanding)</span>
                </div>
              </div>

              {/* Feedback Comments */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  {t('managerFeedback')}
                </label>
                <textarea
                  rows={3}
                  value={activeModalReview.review.feedback}
                  onChange={(e) =>
                    setActiveModalReview({
                      ...activeModalReview,
                      review: {
                        ...activeModalReview.review,
                        feedback: e.target.value,
                      },
                    })
                  }
                  placeholder={lang === 'ar' ? 'أدخل ملاحظات التقييم والإنجازات وتوصيات التطوير…' : 'Enter performance commentary and development goals…'}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Goals List in Modal */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    {t('smartGoalsTitle')}
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddGoal}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{t('addGoal')}</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {activeModalReview.review.goals.map((goal, idx) => (
                    <div
                      key={goal.id}
                      className="rounded-xl border border-border bg-muted/20 p-3 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground">
                          {tx(goal.title)}
                        </span>
                        <span className="font-bold text-primary">{goal.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={goal.progress}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          const updated = [...activeModalReview.review.goals]
                          updated[idx] = { ...goal, progress: val }
                          setActiveModalReview({
                            ...activeModalReview,
                            review: {
                              ...activeModalReview.review,
                              goals: updated,
                            },
                          })
                        }}
                        className="w-full accent-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setActiveModalReview(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
                >
                  {t('submitReview')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
