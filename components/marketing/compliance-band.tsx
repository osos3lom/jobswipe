'use client'

import {
  Banknote,
  FileCheck2,
  Globe2,
  IdCard,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export function ComplianceBand() {
  const { t } = useI18n()

  const complianceChips = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      title: t('chipGosiTitle'),
      desc: t('chipGosiDesc'),
      badge: 'Auto-split',
    },
    {
      icon: <Banknote className="h-5 w-5 text-primary" />,
      title: t('chipWpsTitle'),
      desc: t('chipWpsDesc'),
      badge: 'SIF 100%',
    },
    {
      icon: <FileCheck2 className="h-5 w-5 text-primary" />,
      title: t('chipQiwaTitle'),
      desc: t('chipQiwaDesc'),
      badge: 'Integrated',
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      title: t('chipNitaqatTitle'),
      desc: t('chipNitaqatDesc'),
      badge: 'Platinum/Green',
    },
    {
      icon: <IdCard className="h-5 w-5 text-primary" />,
      title: t('chipIqamaTitle'),
      desc: t('chipIqamaDesc'),
      badge: '90/60/30 Days',
    },
    {
      icon: <Globe2 className="h-5 w-5 text-primary" />,
      title: t('chipArabicTitle'),
      desc: t('chipArabicDesc'),
      badge: 'RTL + Hijri',
    },
  ]

  return (
    <section id="compliance" className="border-b border-border bg-card py-16 sm:py-20 transition-colors">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section Header */}
        <div className="text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            {t('complianceBadge')}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-foreground text-balance">
            {t('complianceHeading')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t('complianceSubheading')}
          </p>
        </div>

        {/* Capability Chips Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {complianceChips.map((chip, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-3xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {chip.icon}
                  </span>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold text-secondary-foreground">
                    {chip.badge}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                  {chip.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {chip.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
