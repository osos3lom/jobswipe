'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Calendar,
  Check,
  Clock,
  Download,
  FileSpreadsheet,
  Layers,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function FeatureSection() {
  const { t, lang } = useI18n()
  const isAr = lang === 'ar'

  return (
    <section id="features" className="divide-y divide-border">
      {/* Section Introduction */}
      <div className="bg-background py-16 text-center sm:py-20 transition-colors">
        <div className="mx-auto max-w-6xl px-5">
          <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            {t('featuresBadge')}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-foreground text-balance">
            {t('featuresHeading')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t('featuresSubheading')}
          </p>
        </div>
      </div>

      {/* 1. PAYROLL MODULE (Light section) */}
      <div className="bg-background py-16 sm:py-24 transition-colors">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <Wallet className="h-3.5 w-3.5" />
                <span>iHR Payroll</span>
              </span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
                {t('modPayrollTitle')}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {t('modPayrollTagline')}
              </p>
              <ul className="mt-6 space-y-3">
                {[t('modPayrollF1'), t('modPayrollF2'), t('modPayrollF3')].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/console"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span>{t('modPayrollAction')}</span>
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                </Link>
              </div>
            </div>

            {/* Mock UI Card: Payroll */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      {isAr ? 'دورة الرواتب: مايو ٢٠٢٦' : 'Payroll Cycle: May 2026'}
                    </span>
                    <h4 className="text-base font-extrabold text-foreground">
                      {isAr ? 'ملف حماية الأجور الشهري (WPS)' : 'Monthly Wage Protection File'}
                    </h4>
                  </div>
                  <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">
                    {isAr ? 'معتمد في WPS · ١٠٠٪' : 'WPS Verified · 100%'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-muted/50 p-3">
                    <p className="text-[11px] text-muted-foreground">
                      {isAr ? 'إجمالي الأجور' : 'Gross Wages'}
                    </p>
                    <p className="text-base font-bold text-foreground">
                      {isAr ? '٢٧٢,٣٠٠ ر.س' : '272,300 SAR'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-muted/50 p-3">
                    <p className="text-[11px] text-muted-foreground">
                      {isAr ? 'حصة التأمينات' : 'GOSI Split'}
                    </p>
                    <p className="text-base font-bold text-foreground">
                      {isAr ? '٢٣,٢٠٠ ر.س' : '23,200 SAR'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-muted/50 p-3 col-span-2 sm:col-span-1">
                    <p className="text-[11px] text-muted-foreground">
                      {isAr ? 'عدد الموظفين' : 'Headcount'}
                    </p>
                    <p className="text-base font-bold text-foreground">
                      {isAr ? '٢٥ موظف' : '25 Employees'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 rounded-2xl border border-border bg-background p-3 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Wadi_AlNoor_Payroll_2026_05.sif</span>
                    <span className="text-success">{isAr ? 'جاهز' : 'Ready'}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                    <span>{isAr ? 'البنك: ملف الراجحي الموحد (SIF)' : 'Bank: Al Rajhi Corporate SIF'}</span>
                    <span>{isAr ? '٢٥ سجلاً مطابقاً' : '25 records matched'}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-1 text-xs">
                  <span className="text-muted-foreground">
                    {isAr ? 'مطابق آلياً مع لوائح التأمينات الاجتماعية' : 'Auto-synced with Saudi GOSI rules'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-primary">
                    <Download className="h-3.5 w-3.5" />
                    <span>{isAr ? 'تصدير ملف SIF' : 'SIF Bank Export'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PEOPLE MODULE (Blush / Secondary section) */}
      <div className="bg-secondary/40 py-16 sm:py-24 transition-colors">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            {/* Mock UI Card: People */}
            <div className="order-2 lg:order-1 lg:col-span-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-base font-bold text-foreground">
                      {isAr ? 'دليل موظفي المنشأة (٢٥)' : 'Company Directory (25)'}
                    </span>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    {isAr ? '١٥ سعودي · ١٠ مقيمين' : '15 Saudi · 10 Expat'}
                  </span>
                </div>

                {/* Sample Employee List */}
                <div className="mt-4 divide-y divide-border/60">
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                        {isAr ? 'ن' : 'N'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {isAr ? 'نورة الحربي' : 'Noura Al-Harbi'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isAr ? 'مديرة الموارد البشرية · الموارد البشرية' : 'HR Director · Human Resources'}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
                      {isAr ? 'نشط' : 'Active'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                        {isAr ? 'ع' : 'A'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {isAr ? 'عبدالرحمن القحطاني' : 'Abdulrahman Al-Qahtani'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isAr ? 'الرئيس التنفيذي · الإدارة التنفيذية' : 'Chief Executive Officer · Executive'}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
                      {isAr ? 'نشط' : 'Active'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                        {isAr ? 'ر' : 'R'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {isAr ? 'راجيش كومار' : 'Rajesh Kumar'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isAr ? 'مدير تقنية المعلومات · مقيم' : 'IT Manager · Expat'}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-bold text-warning">
                      {isAr ? 'الإقامة: ٢٥ يوم' : 'Iqama: 25d'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-muted/50 p-3 text-xs text-muted-foreground flex items-center justify-between">
                  <span>{isAr ? 'عقود قوى الرقمية موثقة ومؤرشفة' : 'Digital Qiwa contracts archived'}</span>
                  <span className="font-semibold text-foreground">
                    {isAr ? '١٠٠٪ امتثال نظامي' : '100% Compliant'}
                  </span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <Users className="h-3.5 w-3.5" />
                <span>iHR People</span>
              </span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
                {t('modPeopleTitle')}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {t('modPeopleTagline')}
              </p>
              <ul className="mt-6 space-y-3">
                {[t('modPeopleF1'), t('modPeopleF2'), t('modPeopleF3')].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/console"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span>{t('modPeopleAction')}</span>
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. HIRING MODULE (Light section) */}
      <div className="bg-background py-16 sm:py-24 transition-colors">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>iHR Jobs & Recruiter</span>
              </span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
                {t('modHiringTitle')}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {t('modHiringTagline')}
              </p>
              <ul className="mt-6 space-y-3">
                {[t('modHiringF1'), t('modHiringF2'), t('modHiringF3')].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span>{t('modHiringAction')}</span>
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                </Link>
              </div>
            </div>

            {/* Mock UI Card: Hiring */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-sm font-bold text-foreground">
                    {isAr ? 'مسار استقطاب الكفاءات · مسؤول العمليات' : 'AI Talent Pipeline · Operations Lead'}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    {isAr ? 'مزامنة حية مع الوظائف' : 'Live Sync with /jobs'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-2xl border border-border bg-muted/40 p-2.5">
                    <p className="text-[11px] text-muted-foreground">
                      {isAr ? 'الطلبات المقدمة' : 'Applications'}
                    </p>
                    <p className="mt-0.5 text-base font-extrabold text-foreground">48</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/40 p-2.5">
                    <p className="text-[11px] text-muted-foreground">
                      {isAr ? 'التطابق الذكي' : 'AI Matches'}
                    </p>
                    <p className="mt-0.5 text-base font-extrabold text-primary">12</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/40 p-2.5">
                    <p className="text-[11px] text-muted-foreground">
                      {isAr ? 'المقابلات' : 'Interviews'}
                    </p>
                    <p className="mt-0.5 text-base font-extrabold text-success">4</p>
                  </div>
                </div>

                {/* Candidate Highlight Card */}
                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-flex rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-bold text-success">
                        {isAr ? '٩٤٪ توافق مع المتطلبات' : '94% SMART Goal Match'}
                      </span>
                      <h5 className="mt-1 text-sm font-bold text-foreground">
                        {isAr ? 'منسق لوجستي أول' : 'Senior Logistics Coordinator'}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {isAr ? 'الرياض · ٥ سنوات خبرة · مواطن سعودي' : 'Riyadh · 5 years experience · Saudi national'}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary">
                      {isAr ? 'تم القبول المبدئي' : 'Swiped Right'}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="rounded-md bg-card px-2 py-0.5 border border-border">
                      {isAr ? 'حماية الأجور وسلاسل الإمداد' : 'WPS & Supply Chain'}
                    </span>
                    <span className="rounded-md bg-card px-2 py-0.5 border border-border">
                      {isAr ? 'ثنائي اللغة' : 'Bilingual'}
                    </span>
                    <span className="rounded-md bg-card px-2 py-0.5 border border-border">
                      {isAr ? 'أنظمة ERP' : 'ERP'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TIME OFF MODULE (Blush / Secondary section) */}
      <div className="bg-secondary/40 py-16 sm:py-24 transition-colors">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            {/* Mock UI Card: Time Off */}
            <div className="order-2 lg:order-1 lg:col-span-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-base font-bold text-foreground">
                      {isAr ? 'أرصدة الإجازات وفق نظام العمل السعودي' : 'Saudi Labor Law Leave Balances'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {isAr ? 'احتساب تلقائي' : 'Auto-accrued'}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-border bg-background p-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{isAr ? 'الإجازة السنوية (المادة ١٠٩)' : 'Annual Leave (Article 109)'}</span>
                      <span className="text-primary">
                        {isAr ? '٢١ يوماً أساسية / ٣٠ يوماً (٥+ سنوات)' : '21 Days Base / 30 Days (5+ yrs)'}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[70%] rounded-full bg-primary" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{isAr ? 'إجازة الحج (المادة ١١٤)' : 'Hajj Leave (Article 114)'}</span>
                      <span className="text-success">{isAr ? '١٠-١٥ يوماً مدفوعة' : '10-15 Days Paid'}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {isAr ? 'مرة واحدة لمن أمضى سنتين متصلتين في الخدمة' : 'Once during continuous 2 years of service'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {isAr ? 'يوسف العنزي (خدمة العملاء)' : 'Yousef Al-Anazi (Customer Service)'}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {isAr ? 'إجازة سنوية · ٥ أيام مطلوبة' : 'Annual leave · 5 days requested'}
                      </p>
                    </div>
                    <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-bold text-success">
                      {isAr ? 'معتمدة' : 'Approved'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <Calendar className="h-3.5 w-3.5" />
                <span>iHR Time Off</span>
              </span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
                {t('modTimeOffTitle')}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {t('modTimeOffTagline')}
              </p>
              <ul className="mt-6 space-y-3">
                {[t('modTimeOffF1'), t('modTimeOffF2'), t('modTimeOffF3')].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/console"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span>{t('modTimeOffAction')}</span>
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. COMPLIANCE HUB (Light section) */}
      <div className="bg-background py-16 sm:py-24 transition-colors">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <BadgeCheck className="h-3.5 w-3.5" />
                <span>iHR Compliance Hub</span>
              </span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
                {t('modComplianceTitle')}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {t('modComplianceTagline')}
              </p>
              <ul className="mt-6 space-y-3">
                {[t('modComplianceF1'), t('modComplianceF2'), t('modComplianceF3')].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/console"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span>{t('modComplianceAction')}</span>
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                </Link>
              </div>
            </div>

            {/* Mock UI Card: Compliance */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      {isAr ? 'تنبيهات استباقية' : 'Proactive Alerts'}
                    </span>
                    <h4 className="text-base font-extrabold text-foreground">
                      {isAr ? 'صلاحية الوثائق ونطاقات السعودة' : 'Document Expiry & Saudization'}
                    </h4>
                  </div>
                  <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">
                    {isAr ? 'أخضر مرتفع (٦٠٪)' : 'High Green (60%)'}
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                      <span className="font-bold text-foreground">
                        {isAr ? 'انتهت الإقامة منذ ٥ أيام — فيكرام ناير' : 'Iqama expired 5 days ago — Vikram Nair'}
                      </span>
                    </div>
                    <span className="font-bold text-destructive">
                      {isAr ? 'فوري' : 'Immediate'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-warning/30 bg-warning/5 p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-warning shrink-0" />
                      <span className="font-bold text-foreground">
                        {isAr ? 'تنتهي الإقامة خلال ١٢ يوماً — ماريا سانتوس' : 'Iqama expires in 12 days — Maria Santos'}
                      </span>
                    </div>
                    <span className="font-semibold text-warning">
                      {isAr ? 'عاجل' : 'Urgent'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-warning/30 bg-warning/5 p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-warning shrink-0" />
                      <span className="font-bold text-foreground">
                        {isAr ? 'تنتهي الإقامة خلال ٢٥ يوماً — راجيش كومار' : 'Iqama expires in 25 days — Rajesh Kumar'}
                      </span>
                    </div>
                    <span className="font-semibold text-warning">
                      {isAr ? 'مراجعة' : 'Review'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-muted/50 p-3 text-xs text-muted-foreground flex items-center justify-between">
                  <span>{isAr ? 'الحد الأدنى المستهدف لنطاقات: ٤٥٪' : 'Target Nitaqat threshold: 45%'}</span>
                  <span className="font-bold text-success">
                    {isAr ? '+١٥٪ أعلى من هامش الأمان' : '+15% Above Safe Margin'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
