'use client'

import { Info, Quote, Star } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export function SocialProof() {
  const { t } = useI18n()

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
    { value: t('stat4Value'), label: t('stat4Label') },
  ]

  return (
    <section id="case-study" className="border-b border-border bg-card py-16 sm:py-24 transition-colors overflow-hidden">
      <div className="mx-auto max-w-5xl px-5">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Info className="h-3.5 w-3.5" />
            <span>{t('socialProofBadge')}</span>
          </div>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-foreground text-balance">
            {t('socialProofHeading')}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs text-muted-foreground sm:text-sm">
            {t('socialProofDisclaimer')}
          </p>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-3xl border border-border bg-background p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-extrabold text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs font-semibold text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial Quote Card */}
        <div className="mt-8 rounded-3xl border border-border bg-background p-8 sm:p-10 shadow-sm relative overflow-hidden">
          <Quote className="absolute -bottom-6 end-6 h-32 w-32 text-muted/30 pointer-events-none" />

          <div className="flex items-center gap-1 text-warning mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-warning" />
            ))}
          </div>

          <blockquote className="text-base sm:text-lg lg:text-xl font-medium leading-relaxed text-foreground text-pretty">
            {t('socialProofQuote')}
          </blockquote>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground">
              ن
            </div>
            <div>
              <p className="font-extrabold text-foreground">
                {t('socialProofAuthorName')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('socialProofAuthorRole')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
