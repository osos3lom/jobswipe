'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export function CtaBand() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-36 text-center border-t border-border/60 transition-colors">
      {/* Apple ethereal ambient glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 opacity-25 dark:opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #b62b46 0%, #7a0c0c 45%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          <span>{t('appleHeroBadge')}</span>
        </span>

        <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground text-balance">
          {t('ctaBandHeading')}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg text-balance">
          {t('ctaBandSubheading')}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/console"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:bg-primary/95 active:scale-95 sm:w-auto"
          >
            <span>{t('ctaBandExploreConsole')}</span>
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>

          <Link
            href="/jobs"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border/80 bg-background/60 px-8 py-3.5 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:bg-muted hover:scale-[1.02] active:scale-95 sm:w-auto"
          >
            <span>{t('ctaBandSeeApp')}</span>
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  )
}

