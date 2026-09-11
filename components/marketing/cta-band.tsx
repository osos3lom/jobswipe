'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export function CtaBand() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden bg-brand text-brand-foreground py-16 sm:py-20">
      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-5 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl text-white text-balance">
          {t('ctaBandHeading')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base text-pretty">
          {t('ctaBandSubheading')}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/console"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-brand shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-2 focus-visible:outline-white sm:w-auto"
          >
            <span>{t('ctaBandExploreConsole')}</span>
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>

          <Link
            href="/jobs"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white sm:w-auto"
          >
            <span>{t('ctaBandSeeApp')}</span>
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  )
}
