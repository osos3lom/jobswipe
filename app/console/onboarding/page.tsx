'use client'

import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Filter,
  Laptop,
  PenTool,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import {
  useCompleteOnboarding,
  useHr,
  useToggleOnboardingTask,
} from '@/lib/hr/store'
import type { Employee, OnboardingCategory, OnboardingTask } from '@/lib/hr/types'
import { departments } from '@/lib/hr/seed'
import { formatDate, formatNumber, formatSAR } from '@/lib/hr/format'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function OnboardingPage() {
  const { t, tx, lang } = useI18n()
  const { employees, onboardingTasks, company } = useHr()
  const toggleTask = useToggleOnboardingTask()
  const completeOnboarding = useCompleteOnboarding()

  // New hires undergoing onboarding
  const onboardingEmployees = useMemo(
    () => employees.filter((e) => e.status === 'onboarding'),
    [employees],
  )

  const [selectedEmpId, setSelectedEmpId] = useState<string>(
    onboardingEmployees[0]?.id ?? 'e11',
  )
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)
  const [signedState, setSignedState] = useState<Record<string, boolean>>({})
  const [successBanner, setSuccessBanner] = useState<string | null>(null)

  const currentEmployee: Employee | undefined = useMemo(() => {
    return (
      employees.find((e) => e.id === selectedEmpId) ??
      onboardingEmployees[0] ??
      employees[0]
    )
  }, [employees, selectedEmpId, onboardingEmployees])

  const empTasks = useMemo(() => {
    if (!currentEmployee) return []
    return onboardingTasks.filter((t) => t.employeeId === currentEmployee.id)
  }, [onboardingTasks, currentEmployee])

  const completedCount = useMemo(
    () => empTasks.filter((t) => t.completed).length,
    [empTasks],
  )
  const totalCount = empTasks.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100

  const filteredTasks = useMemo(() => {
    if (selectedCategory === 'all') return empTasks
    return empTasks.filter((t) => t.category === selectedCategory)
  }, [empTasks, selectedCategory])

  const handleComplete = () => {
    if (!currentEmployee) return
    completeOnboarding(currentEmployee.id)
    setSuccessBanner(t('onboardingCompletedSuccess'))
    setTimeout(() => setSuccessBanner(null), 6000)
  }

  const handleSignOffer = () => {
    if (!currentEmployee) return
    setSignedState((prev) => ({ ...prev, [currentEmployee.id]: true }))
  }

  const isSigned = currentEmployee ? signedState[currentEmployee.id] : false

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('onboardingTitle')}
            </h1>
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {t('illustrativeNotice')}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('onboardingSubtitle')}
          </p>
        </div>

        {currentEmployee && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOfferModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs sm:text-sm font-semibold text-foreground shadow-xs hover:bg-muted transition"
            >
              <FileText className="h-4 w-4 text-primary" />
              <span>{t('viewOfferLetter')}</span>
            </button>

            {currentEmployee.status === 'onboarding' && (
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
              >
                <UserCheck className="h-4 w-4" />
                <span>{t('markCompleted')}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success/10 p-4 text-success animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 text-sm font-medium">
            <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="text-success hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Onboarding Employees Selector Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {onboardingEmployees.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">
            <UserCheck className="h-8 w-8 mx-auto text-success mb-2" />
            <p className="font-semibold text-foreground">
              {lang === 'ar' ? 'جميع الموظفين أتموا المباشرة' : 'All employees are fully onboarded!'}
            </p>
            <p className="text-xs mt-1">
              {lang === 'ar'
                ? 'عند توظيف مرشح جديد من صفحة التوظيف، سيظهر ملف تأهيله تلقائياً هنا.'
                : 'When you hire a candidate from the Hiring module, their onboarding checklist will appear here.'}
            </p>
          </div>
        ) : (
          onboardingEmployees.map((emp) => {
            const isSelected = currentEmployee?.id === emp.id
            const empT = onboardingTasks.filter((t) => t.employeeId === emp.id)
            const cCount = empT.filter((t) => t.completed).length
            const pct = empT.length > 0 ? Math.round((cCount / empT.length) * 100) : 0

            return (
              <button
                key={emp.id}
                type="button"
                onClick={() => setSelectedEmpId(emp.id)}
                className={cn(
                  'flex flex-col text-start rounded-2xl border p-4 shadow-xs transition',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-card hover:border-border/80',
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-foreground">{tx(emp.name)}</div>
                  <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {pct}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{tx(emp.title)}</div>

                <div className="mt-3 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {lang === 'ar'
                      ? `${cCount} من ${empT.length} مهام مكتملة`
                      : `${cCount} of ${empT.length} tasks done`}
                  </span>
                  <span>{formatDate(emp.hireDate, lang)}</span>
                </div>
              </button>
            )
          })
        )}
      </div>

      {currentEmployee && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Checklist Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Checklist Category Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: t('allDepartments') },
                { id: 'docs', label: t('checklistDocs') },
                { id: 'hr', label: t('checklistHr') },
                { id: 'it', label: t('checklistIt') },
                { id: 'team', label: t('checklistTeam') },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'rounded-xl px-3 py-1.5 text-xs font-semibold transition',
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Task Items List */}
            <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-xs">
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  {lang === 'ar' ? 'لا توجد مهام في هذا التصنيف' : 'No tasks in this category'}
                </div>
              ) : (
                filteredTasks.map((task) => {
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        'flex items-start gap-3.5 p-4 transition hover:bg-muted/20',
                        task.completed && 'bg-muted/10',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition',
                          task.completed
                            ? 'border-success bg-success text-white'
                            : 'border-border bg-background hover:border-primary',
                        )}
                      >
                        {task.completed && <Check className="h-3.5 w-3.5" />}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              'text-sm font-semibold text-foreground',
                              task.completed && 'line-through text-muted-foreground',
                            )}
                          >
                            {tx(task.title)}
                          </p>
                          <span
                            className={cn(
                              'rounded-md px-2 py-0.5 text-[11px] font-medium border uppercase tracking-wide',
                              task.category === 'docs' && 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
                              task.category === 'hr' && 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
                              task.category === 'it' && 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
                              task.category === 'team' && 'bg-success/10 text-success border-success/20',
                            )}
                          >
                            {task.category}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {tx(task.description)}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-muted-foreground">
                          <span>
                            {t('taskOwner')}: <span className="font-medium text-foreground">{task.owner}</span>
                          </span>
                          <span>
                            {t('taskDueDate')}: <span className="font-medium text-foreground">{formatDate(task.dueDate, lang)}</span>
                          </span>
                          {task.completedAt && (
                            <span className="text-success font-medium">
                              ✓ {lang === 'ar' ? 'أُنجزت في' : 'Completed'} {formatDate(task.completedAt, lang)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-4">
            {/* Overall Progress Widget */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  {lang === 'ar' ? 'جاهزية المباشرة' : 'Onboarding Readiness'}
                </h3>
                <span className="text-base font-bold text-primary">
                  {progressPercent}%
                </span>
              </div>

              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl bg-muted/40 p-2.5">
                  <div className="font-bold text-foreground text-base">
                    {completedCount}
                  </div>
                  <div className="text-muted-foreground">{t('completed')}</div>
                </div>
                <div className="rounded-xl bg-muted/40 p-2.5">
                  <div className="font-bold text-foreground text-base">
                    {totalCount - completedCount}
                  </div>
                  <div className="text-muted-foreground">
                    {lang === 'ar' ? 'متبقية' : 'Remaining'}
                  </div>
                </div>
              </div>
            </div>

            {/* Document Collection Verification */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-primary" />
                <span>{lang === 'ar' ? 'الوثائق الرسمية المطلوبة' : 'Required Documents'}</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-muted/30 p-2.5">
                  <span className="font-medium text-foreground">
                    {lang === 'ar' ? 'الهوية الوطنية / الإقامة' : 'National ID / Iqama'}
                  </span>
                  <span className="text-success font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {lang === 'ar' ? 'تم التحقق' : 'Verified'}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted/30 p-2.5">
                  <span className="font-medium text-foreground">
                    {lang === 'ar' ? 'شهادة الآيبان البنكي' : 'Bank IBAN Certificate'}
                  </span>
                  <span className="text-success font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {lang === 'ar' ? 'معتمد' : 'Approved'}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted/30 p-2.5">
                  <span className="font-medium text-foreground">
                    {lang === 'ar' ? 'عقد منصة قوى الموحد' : 'Qiwa Digital Contract'}
                  </span>
                  <span className="text-warning font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {currentEmployee.contractStatus === 'authenticated'
                      ? (lang === 'ar' ? 'موثق' : 'Authenticated')
                      : (lang === 'ar' ? 'قيد التوثيق' : 'Pending')}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted/30 p-2.5">
                  <span className="font-medium text-foreground">
                    {lang === 'ar' ? 'وثيقة التأمين الصحي (CCHI)' : 'CCHI Health Insurance'}
                  </span>
                  <span className="text-success font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {lang === 'ar' ? 'سارية (الفئة B)' : 'Active (Class B)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BILINGUAL OFFER LETTER MODAL */}
      {isOfferModalOpen && currentEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {t('offerLetterTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('offerLetterDisclaimer')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Letter Content Preview */}
            <div className="rounded-xl border border-border bg-background p-6 space-y-5 text-xs sm:text-sm leading-relaxed text-foreground">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div>
                  <div className="font-bold text-base text-primary">
                    {tx(company.name)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tx(company.city === 'riyadh' ? { en: 'Riyadh, Kingdom of Saudi Arabia', ar: 'الرياض، المملكة العربية السعودية' } : { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' })}
                  </div>
                </div>
                <div className="text-end text-xs text-muted-foreground">
                  <div>{formatDate(currentEmployee.hireDate, lang)}</div>
                  <div className="font-mono text-[11px]">REF: OFR-2026-{currentEmployee.id.toUpperCase()}</div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  {lang === 'ar' ? 'السيد / السيدة:' : 'To:'} {tx(currentEmployee.name)}
                </p>
                <p className="text-muted-foreground">
                  {lang === 'ar'
                    ? 'يسرنا تقديم عرض العمل التالي للانضمام إلى فريق عملنا:'
                    : 'We are pleased to extend an offer of employment under the following terms:'}
                </p>
              </div>

              {/* Offer Key Terms Grid */}
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 text-xs">
                <div>
                  <span className="text-muted-foreground block">{lang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}:</span>
                  <span className="font-bold text-foreground">{tx(currentEmployee.title)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">{lang === 'ar' ? 'القسم' : 'Department'}:</span>
                  <span className="font-bold text-foreground">
                    {tx(departments.find((d) => d.id === currentEmployee.department)?.name)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">{lang === 'ar' ? 'الراتب الأساسي' : 'Basic Salary'}:</span>
                  <span className="font-bold text-foreground">{formatSAR(currentEmployee.salary.basic, lang)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">{lang === 'ar' ? 'بدل السكن' : 'Housing Allowance'}:</span>
                  <span className="font-bold text-foreground">{formatSAR(currentEmployee.salary.housing, lang)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">{lang === 'ar' ? 'بدل النقل' : 'Transport Allowance'}:</span>
                  <span className="font-bold text-foreground">{formatSAR(currentEmployee.salary.transport, lang)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">{lang === 'ar' ? 'إجمالي الأجر الشهري' : 'Total Monthly Gross'}:</span>
                  <span className="font-bold text-success">
                    {formatSAR(
                      currentEmployee.salary.basic +
                        currentEmployee.salary.housing +
                        currentEmployee.salary.transport,
                      lang,
                    )}
                  </span>
                </div>
              </div>

              {/* Saudi Labor Law terms note */}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 text-[11px] text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">
                  {lang === 'ar' ? 'الاشتراطات النظامية (نظام العمل السعودي):' : 'Statutory Terms (Saudi Labor Law):'}
                </p>
                <p>
                  • {lang === 'ar' ? 'فترة التجربة: ٩٠ يوماً قابلة للتمديد كتابةً إلى ١٨٠ يوماً (المادة ٥٣).' : 'Probation period: 90 days, extendable by mutual written agreement up to 180 days (Art. 53).'}
                </p>
                <p>
                  • {lang === 'ar' ? 'الإجازة السنوية: ٢١ يوماً مدفوعة الأجر سنوياً تزداد إلى ٣٠ يوماً بعد ٥ سنوات (المادة ١٠٩).' : 'Annual leave: 21 prepaid days annually, increasing to 30 days after 5 years service (Art. 109).'}
                </p>
                <p>
                  • {lang === 'ar' ? 'التأمين الطبي: تغطية شاملة وفق لائحة مجلس الضمان الصحي (CCHI).' : 'Medical Insurance: Full coverage under Council of Health Insurance (CCHI) regulations.'}
                </p>
              </div>

              {/* Digital Signature section */}
              <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    {lang === 'ar' ? 'توقيع المرشح الرقمي' : 'Candidate Digital Signature'}
                  </div>
                  {isSigned ? (
                    <div className="flex items-center gap-1.5 text-xs text-success font-bold mt-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        {lang === 'ar'
                          ? `تم التوقيع إلكترونياً بواسطة ${tx(currentEmployee.name)}`
                          : `Digitally signed by ${tx(currentEmployee.name)}`}
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {lang === 'ar'
                        ? 'في انتظار اعتماد وتوقيع المرشح'
                        : 'Awaiting digital signing'}
                    </p>
                  )}
                </div>

                {!isSigned && (
                  <button
                    type="button"
                    onClick={handleSignOffer}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
                  >
                    <PenTool className="h-3.5 w-3.5" />
                    <span>{t('signOfferLetter')}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
