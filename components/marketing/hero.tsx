'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Heart,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function Hero() {
  const { t, lang } = useI18n()
  const isAr = lang === 'ar'

  // Interactive Live Stage State
  const [activeTab, setActiveTab] = useState<'payroll' | 'nitaqat' | 'swipe'>('payroll')

  // Payroll demo state
  const [payrollRunning, setPayrollRunning] = useState(false)
  const [payrollDone, setPayrollDone] = useState(false)

  const handleRunPayroll = () => {
    if (payrollRunning || payrollDone) return
    setPayrollRunning(true)
    setTimeout(() => {
      setPayrollRunning(false)
      setPayrollDone(true)
    }, 1400)
  }

  const handleResetPayroll = () => {
    setPayrollRunning(false)
    setPayrollDone(false)
  }

  // Nitaqat demo state
  const [saudiHires, setSaudiHires] = useState(3)
  const baseSaudis = 12
  const totalEmployees = 25 + saudiHires
  const saudizationPercent = Math.min(100, Math.round(((baseSaudis + saudiHires) / totalEmployees) * 100))
  const isPlatinum = saudizationPercent >= 60

  // Swipe demo state
  const mockCandidates = [
    {
      name: isAr ? 'سارة الغامدي' : 'Sarah Al-Ghamdi',
      role: isAr ? 'مهندسة برمجيات أولى' : 'Senior Cloud Engineer',
      match: '96%',
      exp: isAr ? '٦ سنوات خبرة' : '6 yrs exp',
      city: isAr ? 'الرياض' : 'Riyadh',
      skills: ['TypeScript', 'Next.js', 'AWS'],
    },
    {
      name: isAr ? 'عمر العتيبي' : 'Omar Al-Otaibi',
      role: isAr ? 'مدير موارد بشرية' : 'HR Operations Manager',
      match: '92%',
      exp: isAr ? '٨ سنوات خبرة' : '8 yrs exp',
      city: isAr ? 'جدة' : 'Jeddah',
      skills: ['GOSI', 'Qiwa', 'WPS Mudad'],
    },
    {
      name: isAr ? 'نورة السالم' : 'Noura Al-Salem',
      role: isAr ? 'أخصائية رواتب وامتثال' : 'Payroll & Compliance Lead',
      match: '95%',
      exp: isAr ? '٥ سنوات خبرة' : '5 yrs exp',
      city: isAr ? 'الخبر' : 'Khobar',
      skills: ['SIF Banking', 'Labor Law', 'ZATCA'],
    },
  ]

  return (
    <section id="overview" className="relative overflow-hidden bg-background pt-10 pb-20 sm:pt-16 sm:pb-28 transition-colors">
      {/* Apple-style ethereal radial lighting */}
      <div
        className="pointer-events-none absolute -top-36 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 opacity-25 dark:opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #b62b46 0%, #7a0c0c 40%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-5 text-center">
        {/* Apple Shimmer Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-4 py-1.5 text-xs font-medium text-foreground backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span>{t('appleHeroBadge')}</span>
        </motion.div>

        {/* Apple Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem] lg:leading-[1.1] text-balance"
        >
          <span>{t('appleHeroKicker')}</span>
          <br className="hidden sm:inline" />
          <span className="text-muted-foreground font-medium"> {t('appleHeroTitle')}</span>
        </motion.h1>

        {/* Minimalist Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl font-normal leading-relaxed text-balance"
        >
          {t('appleHeroSubtitle')}
        </motion.p>

        {/* Apple Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/console"
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/95 active:scale-95 sm:w-auto"
          >
            <span>{t('appleHeroCtaPrimary')}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:-scale-x-100" />
          </Link>

          <Link
            href="/jobs"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border/80 bg-background/60 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:bg-muted hover:scale-[1.02] active:scale-95 sm:w-auto"
          >
            <span>{t('appleHeroCtaSecondary')}</span>
          </Link>
        </motion.div>

        {/* Interactive Live Stage Frame */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 sm:mt-16"
        >
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border/80 bg-card/85 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-card/90">
            {/* Window Topbar: Traffic Lights + Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-border/70 bg-muted/30 px-3 sm:px-5 py-3 gap-3 max-w-full overflow-hidden">
              {/* Traffic light dots */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-destructive/80" />
                <span className="h-3 w-3 rounded-full bg-warning/80" />
                <span className="h-3 w-3 rounded-full bg-success/80" />
                <span className="ms-2 text-[11px] font-medium text-muted-foreground/80">
                  Wadi Al-Noor Trading · KSA
                </span>
              </div>

              {/* Segmented Tab Controls */}
              <div className="flex max-w-full overflow-x-auto no-scrollbar rounded-full bg-muted/60 p-1 border border-border/50">
                <button
                  type="button"
                  onClick={() => setActiveTab('payroll')}
                  className={cn(
                    'rounded-full px-2.5 sm:px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0',
                    activeTab === 'payroll'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t('appleStageTabPayroll')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('nitaqat')}
                  className={cn(
                    'rounded-full px-2.5 sm:px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0',
                    activeTab === 'nitaqat'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t('appleStageTabNitaqat')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('swipe')}
                  className={cn(
                    'rounded-full px-2.5 sm:px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0',
                    activeTab === 'swipe'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t('appleStageTabSwipe')}
                </button>
              </div>

              {/* Status indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-ping" />
                <span className="text-[11px] font-medium">{t('heroMockWpsStatus')}</span>
              </div>
            </div>

            {/* Interactive Canvas Body */}
            <div className="p-4 sm:p-8 min-h-[330px] flex flex-col justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {/* 1. PAYROLL LIVE DEMO */}
                {activeTab === 'payroll' && (
                  <motion.div
                    key="payroll"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-full max-w-2xl grid sm:grid-cols-3 gap-3 text-start">
                      <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {isAr ? 'دفعة الرواتب' : 'Monthly Batch'}
                        </span>
                        <p className="mt-1 text-xl font-bold text-foreground">
                          272,300 <span className="text-xs font-medium text-muted-foreground">SAR</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {isAr ? '٢٥ موظفًا' : '25 employees'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {isAr ? 'اشتراكات التأمينات' : 'GOSI Split'}
                        </span>
                        <p className="mt-1 text-xl font-bold text-foreground">
                          46,291 <span className="text-xs font-medium text-muted-foreground">SAR</span>
                        </p>
                        <p className="text-[11px] text-success font-medium mt-0.5">
                          {isAr ? 'آلي ١٠٠٪ (المعاشات + ساند)' : 'Auto: Annuity + SANED'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {isAr ? 'حماية الأجور (WPS)' : 'WPS SIF Status'}
                        </span>
                        <p className="mt-1 text-xl font-bold text-success flex items-center gap-1.5">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                          <span className="text-base">{isAr ? 'معتمد' : 'Verified'}</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {isAr ? 'متوافق مع مَدد' : 'Mudad Compatible'}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Action Band */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl rounded-2xl border border-border/60 bg-muted/30 p-4 gap-4">
                      <div className="text-start">
                        <p className="text-sm font-semibold text-foreground">
                          {payrollDone
                            ? t('appleStageWpsSuccess')
                            : payrollRunning
                            ? t('appleStageRunning')
                            : isAr
                            ? 'اضغط زر المعالجة لمحاكاة حساب الرواتب فورياً'
                            : 'Click process to simulate instant payroll calculation'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isAr
                            ? 'احتساب التأمينات وتوليد ملف صرف الرواتب البنكي خلال ثوانٍ'
                            : 'Calculates GOSI deductions and compiles bank SIF file instantly'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {payrollDone ? (
                          <button
                            type="button"
                            onClick={handleResetPayroll}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition-all hover:bg-muted cursor-pointer"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>{isAr ? 'إعادة التجربة' : 'Try Again'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleRunPayroll}
                            disabled={payrollRunning}
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-75 cursor-pointer"
                          >
                            {payrollRunning ? (
                              <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                <span>{t('appleStageRunning')}</span>
                              </>
                            ) : (
                              <>
                                <Zap className="h-3.5 w-3.5" />
                                <span>{t('appleStageRunPayroll')}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. LIVE NITAQAT DEMO */}
                {activeTab === 'nitaqat' && (
                  <motion.div
                    key="nitaqat"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center w-full max-w-2xl"
                  >
                    <div className="w-full grid sm:grid-cols-2 gap-4 text-start">
                      <div className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {t('appleStageNitaqatCurrent')}
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-foreground">
                            {saudizationPercent}%
                          </span>
                          <span className="text-xs font-semibold text-success">
                            {baseSaudis + saudiHires} / {totalEmployees} {isAr ? 'سعودي' : 'Saudis'}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className={cn(
                              'h-full rounded-full transition-all duration-300',
                              isPlatinum ? 'bg-primary' : 'bg-success'
                            )}
                            animate={{ width: `${saudizationPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground">
                            {t('appleStageNitaqatTier')}
                          </span>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors',
                                isPlatinum
                                  ? 'bg-primary/15 text-primary border border-primary/20'
                                  : 'bg-success/15 text-success border border-success/20'
                              )}
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>{isPlatinum ? t('appleStagePlatinum') : t('appleStageHighGreen')}</span>
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {isPlatinum
                            ? isAr
                              ? 'مؤهل لكافة تأشيرات الاستقدام الفورية بلا قيود'
                              : 'Full immediate work visa allocation with zero quotas'
                            : isAr
                            ? 'نطاق آمن ومطابق لكافة اشتراطات وزارة الموارد البشرية'
                            : 'Compliant with all Ministry of Human Resources requirements'}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Slider Bar */}
                    <div className="mt-5 w-full rounded-2xl border border-border/60 bg-muted/30 p-4 text-start">
                      <div className="flex items-center justify-between">
                        <label htmlFor="saudi-hires-slider" className="text-xs font-semibold text-foreground">
                          {t('appleStageNitaqatSliderLabel')}: <span className="text-primary font-bold">+{saudiHires}</span>
                        </label>
                        <div className="flex gap-2">
                          {[1, 3, 5].map((count) => (
                            <button
                              key={count}
                              type="button"
                              onClick={() => setSaudiHires(count)}
                              className={cn(
                                'rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-all cursor-pointer',
                                saudiHires === count
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-background border-border text-foreground hover:bg-muted'
                              )}
                            >
                              +{count}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        id="saudi-hires-slider"
                        type="range"
                        min="0"
                        max="8"
                        value={saudiHires}
                        onChange={(e) => setSaudiHires(Number(e.target.value))}
                        className="mt-3 w-full accent-primary cursor-pointer"
                      />
                    </div>
                  </motion.div>
                )}

                {/* 3. CANDIDATE AI SWIPE DEMO */}
                {activeTab === 'swipe' && (
                  <motion.div
                    key="swipe"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center w-full"
                  >
                    <CandidateSwipeDeck candidates={mockCandidates} t={t} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

interface MockCandidate {
  name: string
  role: string
  match: string
  exp: string
  city: string
  skills: string[]
}

function CandidateSwipeDeck({
  candidates,
  t,
}: {
  candidates: MockCandidate[]
  t: (k: any) => string
}) {
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState<'liked' | 'passed' | null>(null)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-180, 180], [-14, 14])
  const likeOpacity = useTransform(x, [20, 75], [0, 1])
  const passOpacity = useTransform(x, [-20, -75], [0, 1])

  const current = candidates[index % candidates.length]
  const next = candidates[(index + 1) % candidates.length]

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const power = info.offset.x + info.velocity.x * 0.25
    if (power > 65) {
      setLeaving('liked')
    } else if (power < -65) {
      setLeaving('passed')
    }
  }

  const triggerSwipe = (dir: 'liked' | 'passed') => {
    if (leaving) return
    setLeaving(dir)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none">
      {/* Visual Stacked Deck Area */}
      <div className="relative w-full h-[260px] flex items-center justify-center">
        {/* Shadow Background Card for depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl border border-border/60 bg-card/60 p-5 text-start shadow-sm pointer-events-none scale-[0.93] translate-y-2.5 opacity-40 transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                {next.city} · {next.exp}
              </span>
              <h4 className="mt-0.5 text-base font-bold text-foreground">
                {next.name}
              </h4>
              <p className="text-xs text-primary font-semibold mt-0.5">
                {next.role}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              {next.match} {t('appleStageSwipeScore')}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {next.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Foreground Draggable Card */}
        <motion.div
          key={current.name}
          style={{ x, rotate }}
          drag={leaving ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragSnapToOrigin={!leaving}
          dragElastic={0.8}
          onDragEnd={handleDragEnd}
          animate={
            leaving === 'liked'
              ? { x: 450, opacity: 0, rotate: 18 }
              : leaving === 'passed'
              ? { x: -450, opacity: 0, rotate: -18 }
              : { x: 0, opacity: 1 }
          }
          transition={{ duration: 0.28, ease: 'easeOut' }}
          onAnimationComplete={() => {
            if (leaving) {
              setIndex((prev) => prev + 1)
              setLeaving(null)
              x.set(0)
            }
          }}
          className="absolute inset-0 rounded-2xl border border-border/90 bg-background p-5 text-start shadow-md cursor-grab active:cursor-grabbing touch-pan-y z-10 flex flex-col justify-between"
        >
          {/* Dynamic Green CONNECT Stamp */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-4 start-4 rotate-[-12deg] rounded-xl border-2 border-success bg-success/15 px-3 py-1 text-xs font-black tracking-wider text-success backdrop-blur-md pointer-events-none z-20"
          >
            ✓ {t('appleStageSwipeLike')}
          </motion.div>

          {/* Dynamic Red PASS Stamp */}
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-4 end-4 rotate-[12deg] rounded-xl border-2 border-destructive bg-destructive/15 px-3 py-1 text-xs font-black tracking-wider text-destructive backdrop-blur-md pointer-events-none z-20"
          >
            ✕ {t('appleStageSwipePass')}
          </motion.div>

          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  {current.city} · {current.exp}
                </span>
                <h4 className="mt-0.5 text-base font-bold text-foreground">
                  {current.name}
                </h4>
                <p className="text-xs text-primary font-semibold mt-0.5">
                  {current.role}
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                {current.match} {t('appleStageSwipeScore')}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {current.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Manual Clickable Swipe Buttons */}
          <div className="mt-4 flex items-center justify-center gap-5 pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                triggerSwipe('passed')
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-90 cursor-pointer shadow-sm"
              aria-label="Pass"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                triggerSwipe('liked')
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-90 cursor-pointer"
              aria-label="Like"
            >
              <Heart className="h-5 w-5 fill-current" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Swipe gesture guidance */}
      <p className="mt-4 text-[11px] font-medium text-muted-foreground text-center">
        {t('appleStageSwipeAction')}
      </p>

      {/* Direct link to candidate swipe route */}
      <Link
        href="/jobs"
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-95 shadow-sm"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>{t('appleStageSwipeRouteLink')}</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform rtl:-scale-x-100" />
      </Link>
    </div>
  )
}
