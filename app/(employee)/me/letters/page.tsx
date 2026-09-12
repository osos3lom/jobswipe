'use client'

import { useState } from 'react'
import {
  Award,
  Building2,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useActiveEmployee } from '@/lib/employee/employee-context'
import { useHr } from '@/lib/hr/store'
import { departments } from '@/lib/hr/seed'
import { LetterType, generateRefNumber, getLetterTitle } from '@/lib/hr/letters'
import { formatDate, formatNumber, formatSAR } from '@/lib/hr/format'
import { startOfToday, toISODate } from '@/lib/hr/dates'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function EmployeeLettersPage() {
  const { t, tx, lang } = useI18n()
  const { currentEmployee } = useActiveEmployee()
  const { company } = useHr()

  const [letterType, setLetterType] = useState<LetterType>('salary')
  const [addressedTo, setAddressedTo] = useState(
    lang === 'ar' ? 'إلى من يهمه الأمر' : 'To Whom It May Concern',
  )
  const [includeSalary, setIncludeSalary] = useState(true)
  const [isGenerated, setIsGenerated] = useState(false)

  if (!currentEmployee) return null

  const refNumber = generateRefNumber(currentEmployee.id, letterType)
  const today = toISODate(startOfToday())
  const deptName = departments.find((d) => d.id === currentEmployee.department)?.name

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {t('lettersTitle')}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('lettersSubtitle')}
        </p>
      </div>

      {/* Generator Form */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3.5 text-xs">
        <div>
          <label className="block font-semibold text-foreground mb-1">
            {lang === 'ar' ? 'نوع الخطاب المطلوب' : 'Certificate Type'}
          </label>
          <select
            value={letterType}
            onChange={(e) => {
              setLetterType(e.target.value as LetterType)
              setIsGenerated(false)
            }}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="salary">{t('letterTypeSalary')}</option>
            <option value="experience">{t('letterTypeExperience')}</option>
            <option value="embassy">{t('letterTypeEmbassy')}</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-foreground mb-1">
            {t('letterAddressedTo')}
          </label>
          <input
            type="text"
            value={addressedTo}
            onChange={(e) => setAddressedTo(e.target.value)}
            placeholder={t('letterAddressedPlaceholder')}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {letterType === 'salary' && (
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={includeSalary}
              onChange={(e) => setIncludeSalary(e.target.checked)}
              className="rounded accent-primary"
            />
            <span className="text-muted-foreground font-medium">
              {t('includeSalaryBreakdown')}
            </span>
          </label>
        )}

        <button
          type="button"
          onClick={() => setIsGenerated(true)}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
        >
          <FileCheck2 className="h-4 w-4" />
          <span>{t('generateLetter')}</span>
        </button>
      </div>

      {/* Certificate Preview Card */}
      {isGenerated && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {lang === 'ar' ? 'معاينة الوثيقة الرسمية' : 'Official Document Preview'}
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{t('printLetter')}</span>
            </button>
          </div>

          {/* Official Letter Paper */}
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm space-y-5 text-xs text-foreground leading-relaxed print:m-0 print:border-none print:shadow-none">
            {/* Letterhead */}
            <div className="flex items-center justify-between border-b-2 border-primary/40 pb-4">
              <div>
                <div className="text-base font-bold text-primary">
                  {tx(company.name)}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {lang === 'ar' ? 'المملكة العربية السعودية — السجل التجاري: 1010892415' : 'Kingdom of Saudi Arabia · CR: 1010892415'}
                </div>
              </div>
              <div className="text-end text-[11px] text-muted-foreground">
                <div className="font-mono">{refNumber}</div>
                <div>{formatDate(today, lang)}</div>
              </div>
            </div>

            {/* Letter Title */}
            <div className="text-center space-y-1 py-1">
              <h2 className="text-sm font-bold text-primary underline underline-offset-4">
                {tx(getLetterTitle(letterType))}
              </h2>
              <p className="text-xs font-semibold text-foreground pt-1">
                {addressedTo}
              </p>
            </div>

            {/* Letter Body */}
            <div className="space-y-3 text-muted-foreground">
              <p>
                {lang === 'ar'
                  ? `تشهد شركة ${tx(company.name)} بأن السيد / ${tx(currentEmployee.name)} (الجنسية: ${currentEmployee.nationality}، رقم الهوية / الإقامة: 2489012678) يعمل لدى المنشأة بمسمى وظيفي (${tx(currentEmployee.title)}) في إدارة (${tx(deptName)})، وذلك منذ تاريخ مباشرته للعمل في ${formatDate(currentEmployee.hireDate, lang)}، ولا يزال على رأس العمل حتى تاريخه.`
                  : `This is to certify that Mr./Ms. ${tx(currentEmployee.name)} (Nationality: ${currentEmployee.nationality}, ID/Iqama: 2489012678) is currently employed with ${tx(company.name)} as (${tx(currentEmployee.title)}) in the (${tx(deptName)}) department since ${formatDate(currentEmployee.hireDate, lang)}, and is actively employed to date.`}
              </p>

              {letterType === 'salary' && includeSalary && (
                <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-1 text-[11px] text-foreground">
                  <div className="font-bold border-b border-border/60 pb-1 text-primary">
                    {lang === 'ar' ? 'تفاصيل الأجر الشهري الإجمالي:' : 'Monthly Compensation Breakdown:'}
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'ar' ? 'الراتب الأساسي' : 'Basic Salary'}:</span>
                    <span className="font-semibold">{formatSAR(currentEmployee.salary.basic, lang)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'ar' ? 'بدل السكن' : 'Housing Allowance'}:</span>
                    <span className="font-semibold">{formatSAR(currentEmployee.salary.housing, lang)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'ar' ? 'بدل النقل' : 'Transport Allowance'}:</span>
                    <span className="font-semibold">{formatSAR(currentEmployee.salary.transport, lang)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/60 pt-1 font-bold text-primary">
                    <span>{lang === 'ar' ? 'إجمالي الراتب الشهري' : 'Total Monthly Salary'}:</span>
                    <span>
                      {formatSAR(
                        currentEmployee.salary.basic +
                          currentEmployee.salary.housing +
                          currentEmployee.salary.transport,
                        lang,
                      )}
                    </span>
                  </div>
                </div>
              )}

              <p>
                {lang === 'ar'
                  ? 'وقد أُعطيت له هذه الشهادة بناءً على طلبه لتقديمها إلى الجهة المختصة دون أدنى مسؤولية مالية أو نظامية على الشركة.'
                  : 'This certificate has been issued upon the employee’s request for submission to the concerned entity without any financial or legal liability on the part of the company.'}
              </p>
            </div>

            {/* Official Stamp & QR Code footer */}
            <div className="flex items-end justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted/30">
                  <QrCode className="h-8 w-8 text-primary/80" />
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  <span className="font-bold block text-foreground">
                    {lang === 'ar' ? 'توثيق إلكتروني معتمد' : 'Digital Verified Seal'}
                  </span>
                  <span>{refNumber}</span>
                </div>
              </div>

              <div className="text-end text-[11px]">
                <div className="font-bold text-foreground">
                  {lang === 'ar' ? 'إدارة الموارد البشرية' : 'Human Resources Dept.'}
                </div>
                <div className="text-xs text-primary font-semibold">
                  {tx(company.name)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
