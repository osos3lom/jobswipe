'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Heart,
  LayoutDashboard,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
  Users,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function InteractiveProductShowcase() {
  const { t, lang } = useI18n()
  const isAr = lang === 'ar'

  const [activeRole, setActiveRole] = useState<'console' | 'employee' | 'candidate'>('console')

  return (
    <section id="showcase" className="relative overflow-hidden py-20 sm:py-28 bg-background transition-colors">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" />
            <span>{t('appleShowcaseBadge')}</span>
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            {t('appleShowcaseHeading')}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg text-balance">
            {t('appleShowcaseSubheading')}
          </p>

          {/* Apple Segmented Role Switcher */}
          <div className="mt-9 inline-flex max-w-full overflow-x-auto no-scrollbar p-1 sm:p-1.5 rounded-full bg-muted/60 border border-border/60">
            <button
              type="button"
              onClick={() => setActiveRole('console')}
              className={cn(
                'inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0',
                activeRole === 'console'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutDashboard className="h-4 w-4 text-primary" />
              <span>{t('appleShowcaseEmployerTab')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('employee')}
              className={cn(
                'inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0',
                activeRole === 'employee'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <User className="h-4 w-4 text-primary" />
              <span>{t('appleShowcaseEmployeeTab')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('candidate')}
              className={cn(
                'inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0',
                activeRole === 'candidate'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Smartphone className="h-4 w-4 text-primary" />
              <span>{t('appleShowcaseCandidateTab')}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Showcase Stage */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            {/* 1. EMPLOYER CONSOLE VIEW */}
            {activeRole === 'console' && (
              <motion.div
                key="console"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm"
              >
                <div className="lg:col-span-5 text-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {isAr ? 'منظومة إدارة المنشآت' : 'Employer Operating System'}
                  </span>
                  <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-foreground">
                    {t('appleShowcaseEmployerHeadline')}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {t('appleShowcaseConsoleDesc')}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-xl border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground">
                      {isAr ? 'مسيرات الرواتب WPS' : 'WPS Payroll'}
                    </span>
                    <span className="rounded-xl border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground">
                      {isAr ? 'مؤشر نطاقات الفوري' : 'Nitaqat Simulator'}
                    </span>
                    <span className="rounded-xl border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground">
                      {isAr ? 'توثيق قوى' : 'Qiwa Contracts'}
                    </span>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/console"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <span>{t('exploreConsole')}</span>
                      <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 text-start">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div>
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {isAr ? 'لوحة القيادة · وادي النور' : 'Dashboard · Wadi Al-Noor'}
                        </span>
                        <h4 className="text-base font-bold text-foreground">
                          {isAr ? 'نظرة عامة على القوى العاملة' : 'Workforce Pulse'}
                        </h4>
                      </div>
                      <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-bold text-success">
                        {isAr ? 'امتثال تام' : '100% Compliant'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="rounded-xl border border-border/70 bg-card p-3">
                        <span className="text-[11px] text-muted-foreground">{isAr ? 'إجمالي الموظفين' : 'Headcount'}</span>
                        <p className="text-lg font-bold text-foreground mt-0.5">25</p>
                      </div>
                      <div className="rounded-xl border border-border/70 bg-card p-3">
                        <span className="text-[11px] text-muted-foreground">{isAr ? 'كتلة الأجور' : 'Payroll Run'}</span>
                        <p className="text-lg font-bold text-foreground mt-0.5">272.3k <span className="text-xs font-normal">SAR</span></p>
                      </div>
                      <div className="rounded-xl border border-border/70 bg-card p-3 col-span-2 sm:col-span-1">
                        <span className="text-[11px] text-muted-foreground">{isAr ? 'نسبة التوطين' : 'Saudization'}</span>
                        <p className="text-lg font-bold text-success mt-0.5">60.0% <span className="text-xs">Platinum</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. EMPLOYEE SELF-SERVICE VIEW */}
            {activeRole === 'employee' && (
              <motion.div
                key="employee"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm"
              >
                <div className="lg:col-span-5 text-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    {isAr ? 'بوابة الموظف الذاتية' : 'Employee Self-Service'}
                  </span>
                  <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-foreground">
                    {t('appleShowcaseEmployeeHeadline')}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {t('appleShowcaseEmployeeDesc')}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-xl border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground">
                      {isAr ? 'كشوف رواتب فورية' : 'Instant Payslips'}
                    </span>
                    <span className="rounded-xl border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground">
                      {isAr ? 'رصيد الإجازات المادة ١٠٩' : 'Article 109 Leave'}
                    </span>
                    <span className="rounded-xl border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground">
                      {isAr ? 'خطابات تعريف بنكية' : 'Digital Salary Letters'}
                    </span>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/me"
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs sm:text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <span>{isAr ? 'تجربة بوابة الموظف' : 'Enter Employee Portal'}</span>
                      <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 text-start">
                    {/* Simulated Payslip Card */}
                    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <div>
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            {isAr ? 'كشف الراتب الإلكتروني' : 'Digital Payslip'}
                          </span>
                          <h4 className="text-sm font-bold text-foreground">
                            {isAr ? 'مايو ٢٠٢٦ · تم التحويل' : 'May 2026 · Deposited'}
                          </h4>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                          <Download className="h-3.5 w-3.5" />
                          <span>PDF</span>
                        </span>
                      </div>

                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-xs text-muted-foreground">{isAr ? 'صافي الراتب المستحق' : 'Net Disbursed'}</span>
                        <span className="text-xl font-bold text-foreground">18,200 <span className="text-xs font-normal">SAR</span></span>
                      </div>
                    </div>

                    {/* Leave Balance Row */}
                    <div className="mt-3 rounded-xl border border-border/70 bg-card p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="h-4 w-4 text-accent" />
                        <div>
                          <p className="text-xs font-bold text-foreground">{isAr ? 'الإجازة السنوية النظامية' : 'Annual Vacation Balance'}</p>
                          <p className="text-[11px] text-muted-foreground">{isAr ? 'مستحق وفق نظام العمل السعودي' : 'Statutory Saudi Article 109'}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-foreground">{isAr ? '٢١ يوماً' : '21 Days'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. CANDIDATE SWIPE APP VIEW */}
            {activeRole === 'candidate' && (
              <motion.div
                key="candidate"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm"
              >
                <div className="lg:col-span-5 text-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {isAr ? 'تطبيق التوظيف الذكي' : 'AI Recruitment Engine'}
                  </span>
                  <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-foreground">
                    {t('appleShowcaseCandidateHeadline')}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {t('appleShowcaseCandidateDesc')}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-xl border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground">
                      {isAr ? 'سحب سريع للوظائف' : 'Swipe Matching'}
                    </span>
                    <span className="rounded-xl border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground">
                      {isAr ? 'مدرب مهني ذكي' : 'AI Career Coach'}
                    </span>
                    <span className="rounded-xl border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground">
                      {isAr ? 'مطابقة الكفاءات' : 'Smart Fit Score'}
                    </span>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/jobs"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <span>{t('seeJobApp')}</span>
                      <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-7 flex justify-center">
                  {/* Phone frame simulation */}
                  <div className="w-full max-w-xs rounded-3xl border-2 border-border/80 bg-background p-4 shadow-xl text-start">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-foreground">iHR Jobs</span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                        94% Match
                      </span>
                    </div>

                    <div className="mt-3">
                      <span className="text-[11px] text-muted-foreground">Riyadh · Full Time</span>
                      <h4 className="text-base font-bold text-foreground">Lead Product Designer</h4>
                      <p className="text-xs text-primary font-semibold mt-0.5">24,000 - 32,000 SAR / mo</p>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {isAr ? 'تصميم تجارب رقمية لجيل جديد من التقنيات المالية بالمملكة.' : 'Designing next-gen financial interfaces in the Kingdom.'}
                    </p>

                    <div className="mt-4 flex items-center justify-center gap-3 pt-2 border-t border-border/60">
                      <span className="text-xs text-muted-foreground">{isAr ? 'اسحب للتقديم الفوري' : 'Swipe right to apply'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
