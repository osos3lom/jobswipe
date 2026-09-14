'use client'

import { motion } from 'framer-motion'
import {
  Banknote,
  CheckCircle2,
  Clock,
  Moon,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export function AppleBentoGrid() {
  const { t, lang } = useI18n()
  const isAr = lang === 'ar'

  return (
    <section id="systems" className="relative overflow-hidden py-20 sm:py-28 bg-muted/20 border-t border-border/50 transition-colors">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" />
            <span>{t('appleBentoSectionBadge')}</span>
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            {t('appleBentoHeading')}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg text-balance">
            {t('appleBentoSubheading')}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          {/* TILE 1: GOSI on Autopilot (Large 8-col) */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-8 rounded-3xl border border-border/70 bg-card p-7 sm:p-9 shadow-sm relative overflow-hidden flex flex-col justify-between group"
          >
            <div className="absolute top-0 end-0 p-6 opacity-5 dark:opacity-10 pointer-events-none">
              <ShieldCheck className="h-44 w-44 text-foreground" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isAr ? 'أنظمة التأمينات الاجتماعية' : 'Saudi GOSI Engine'}
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
                {t('appleBentoGosiTitle')}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t('appleBentoGosiDesc')}
              </p>
            </div>

            {/* Visual GOSI Formula Breakdown */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>{isAr ? 'المعاشات (سعودي)' : 'Annuity (Saudi)'}</span>
                  <span className="text-primary font-bold">18%</span>
                </div>
                <p className="mt-2 text-base font-bold text-foreground">
                  9% <span className="text-xs font-normal text-muted-foreground">{isAr ? 'منشأة' : 'Employer'}</span> + 9% <span className="text-xs font-normal text-muted-foreground">{isAr ? 'موظف' : 'Employee'}</span>
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full w-full bg-primary rounded-full" />
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>{isAr ? 'ساند (التعطل)' : 'SANED'}</span>
                  <span className="text-accent font-bold">1.5%</span>
                </div>
                <p className="mt-2 text-base font-bold text-foreground">
                  0.75% + 0.75%
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full w-3/4 bg-accent rounded-full" />
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>{isAr ? 'أخطار مهنية' : 'Hazard Rate'}</span>
                  <span className="text-success font-bold">2.0%</span>
                </div>
                <p className="mt-2 text-base font-bold text-foreground">
                  {isAr ? 'على صاحب العمل فقط' : 'Employer Funded'}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full w-1/2 bg-success rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* TILE 2: Live Nitaqat Radar (4-col) */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-4 rounded-3xl border border-border/70 bg-card p-7 sm:p-9 shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-success/15 text-success">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isAr ? 'برنامج نطاقات' : 'Nitaqat Radar'}
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-foreground">
                {t('appleBentoNitaqatTitle')}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t('appleBentoNitaqatDesc')}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-success/30 bg-success/5 p-5 text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-0.5 text-xs font-bold text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isAr ? 'النطاق الأخضر المرتفع' : 'High Green Tier'}</span>
              </div>
              <p className="mt-3 text-3xl font-black text-foreground">60.0%</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isAr ? 'المستهدف القطاعي: ٢٨٪' : 'Industry Quota: 28%'}
              </p>
            </div>
          </motion.div>

          {/* TILE 3: WPS SIF in Seconds (4-col) */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-4 rounded-3xl border border-border/70 bg-card p-7 sm:p-9 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Banknote className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-foreground">
                {t('appleBentoWpsTitle')}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t('appleBentoWpsDesc')}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border/60 bg-muted/40 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">WPS_SIF_MAY2026.csv</span>
                <span className="font-semibold text-success">100% SIF</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isAr ? 'مشفر ومتوافق مع مصرف الراجحي، الأهلي، والإنماء' : 'Pre-formatted for Al Rajhi, SNB, Alinma & Mudad'}
              </p>
            </div>
          </motion.div>

          {/* TILE 4: Zero-Penalty Iqama Shield (4-col) */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-4 rounded-3xl border border-border/70 bg-card p-7 sm:p-9 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-foreground">
                {t('appleBentoIqamaTitle')}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t('appleBentoIqamaDesc')}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-2">
              <div className="flex-1 rounded-xl border border-border/60 bg-muted/30 p-2.5 text-center">
                <span className="text-xs font-bold text-muted-foreground">90d</span>
                <p className="text-[11px] text-muted-foreground">{isAr ? 'تنبيه' : 'Early'}</p>
              </div>
              <div className="flex-1 rounded-xl border border-amber-500/30 bg-amber-500/5 p-2.5 text-center">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">60d</span>
                <p className="text-[11px] text-muted-foreground">{isAr ? 'تذكير' : 'Renew'}</p>
              </div>
              <div className="flex-1 rounded-xl border border-destructive/30 bg-destructive/5 p-2.5 text-center">
                <span className="text-xs font-bold text-destructive">30d</span>
                <p className="text-[11px] text-destructive">{isAr ? 'حرج' : 'Urgent'}</p>
              </div>
            </div>
          </motion.div>

          {/* TILE 5: Dual Calendar Harmony (4-col) */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-4 rounded-3xl border border-border/70 bg-card p-7 sm:p-9 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Moon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-foreground">
                {t('appleBentoHijriTitle')}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t('appleBentoHijriDesc')}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border/60 bg-muted/40 p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">{isAr ? 'تقويم أم القرى' : 'Umm al-Qura'}</span>
                <p className="text-sm font-bold text-foreground">{isAr ? '٢٧ ذو القعدة ١٤٤٧' : '27 Dhu al-Qadah 1447'}</p>
              </div>
              <div className="text-end">
                <span className="text-xs text-muted-foreground">{isAr ? 'الميلادي' : 'Gregorian'}</span>
                <p className="text-sm font-bold text-foreground">May 2026</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
