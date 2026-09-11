'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden bg-brand text-brand-foreground pb-20 pt-12 md:pb-28 md:pt-20">
      {/* Subtle background glow/grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 20%, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Text & CTAs */}
          <div className="text-center lg:col-span-7 lg:text-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-rose-200" />
              <span>{t('heroPill')}</span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              {t('heroHeadline')}
            </h1>

            <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg lg:max-w-xl">
              {t('heroSubhead')}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/console"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-base font-bold text-brand shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
              >
                <span>{t('heroCtaConsole')}</span>
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </Link>

              <Link
                href="/jobs"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
              >
                <span>{t('heroCtaJobs')}</span>
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>

            {/* Micro proof pill */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/75 lg:justify-start">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{t('heroTrustPill')}</span>
            </div>
          </div>

          {/* Interactive UI Mock Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl border border-white/20 bg-card/95 p-6 text-card-foreground shadow-2xl backdrop-blur-xl dark:bg-card">
              {/* Header inside mock card */}
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Wadi Al-Noor Trading Co.
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Riyadh, KSA · Wholesale & Distribution
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  {t('heroMockWpsStatus')}
                </span>
              </div>

              {/* Stats Grid inside Mock Card */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/70 bg-muted/40 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5 text-primary" />
                    <span>{t('heroMockMonthlyPayroll')}</span>
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-foreground">
                    272,300 <span className="text-xs font-semibold">SAR</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">{t('heroMockNextPayday')}</p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/40 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span>{t('heroMockEmployeesActive')}</span>
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-foreground">
                    {t('heroMockSaudization')}
                  </p>
                  <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {t('heroMockNitaqatStatus')}
                  </p>
                </div>
              </div>

              {/* Action item snapshot inside card */}
              <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-foreground">
                      GOSI & SIF Bank Export Ready
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-primary">
                    25 / 25 Verified
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full w-full rounded-full bg-primary" />
                </div>
              </div>

              {/* Bottom quick door */}
              <div className="mt-4 flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  Fictional company seed data
                </span>
                <Link
                  href="/console"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>{t('exploreConsole')}</span>
                  <ChevronRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
