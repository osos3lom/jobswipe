'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { useI18n, fill } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function PricingTable() {
  const { t, lang } = useI18n()
  const [annual, setAnnual] = useState(false)
  const [employeeCount, setEmployeeCount] = useState(25)

  // 15% discount for annual billing
  const discountMultiplier = annual ? 0.85 : 1.0

  const tiers = [
    {
      id: 'basic',
      name: t('tierBasicName'),
      basePrice: 20,
      desc: t('tierBasicDesc'),
      features: [
        t('tierBasicF1'),
        t('tierBasicF2'),
        t('tierBasicF3'),
        t('tierBasicF4'),
      ],
      cta: t('tierBasicCta'),
      href: '/console',
      popular: false,
    },
    {
      id: 'plus',
      name: t('tierPlusName'),
      basePrice: 35,
      desc: t('tierPlusDesc'),
      features: [
        t('tierPlusF1'),
        t('tierPlusF2'),
        t('tierPlusF3'),
        t('tierPlusF4'),
        t('tierPlusF5'),
      ],
      cta: t('tierPlusCta'),
      href: '/console',
      popular: true,
    },
    {
      id: 'premium',
      name: t('tierPremiumName'),
      basePrice: 50,
      desc: t('tierPremiumDesc'),
      features: [
        t('tierPremiumF1'),
        t('tierPremiumF2'),
        t('tierPremiumF3'),
        t('tierPremiumF4'),
        t('tierPremiumF5'),
      ],
      cta: t('tierPremiumCta'),
      href: '/console',
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="border-t border-border/60 bg-muted/20 py-20 sm:py-28 transition-colors overflow-hidden">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            {t('pricingBadge')}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground text-balance">
            {t('pricingHeading')}
          </h2>
          <p className="mt-3 text-base text-muted-foreground text-balance">
            {t('pricingSubheading')}
          </p>

          {/* Billing Switch */}
          <div className="mt-8 inline-flex items-center rounded-full border border-border/70 bg-card p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={cn(
                'rounded-full px-5 py-2 text-xs font-semibold transition-all cursor-pointer',
                !annual
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t('pricingMonthly')}
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={cn(
                'rounded-full px-5 py-2 text-xs font-semibold transition-all cursor-pointer',
                annual
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t('pricingAnnual')}
            </button>
          </div>

          {/* Employee Count Interactive Slider */}
          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>{t('pricingEmployeesSlider')}</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary font-bold">
                {fill(t('pricingTeamSize'), { count: employeeCount })}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={employeeCount}
              onChange={(e) => setEmployeeCount(Number(e.target.value))}
              className="mt-3 w-full accent-primary cursor-pointer"
              aria-label={t('selectEmployeeCount')}
            />
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>5</span>
              <span>25 (Wadi Al-Noor)</span>
              <span>150+</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {tiers.map((tier) => {
            const calculatedPrice = Math.round(tier.basePrice * discountMultiplier)
            const monthlyTotal = calculatedPrice * employeeCount

            return (
              <div
                key={tier.id}
                className={cn(
                  'relative flex min-w-[280px] sm:min-w-[320px] flex-1 snap-center flex-col justify-between rounded-3xl border bg-card p-7 shadow-sm transition-all hover:shadow-md lg:min-w-0',
                  tier.popular
                    ? 'border-2 border-primary ring-4 ring-primary/5'
                    : 'border-border/70',
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 start-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      <span>{t('pricingRecommendedBadge')}</span>
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{tier.desc}</p>

                  {/* Price */}
                  <div className="mt-6 border-b border-border/70 pb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight text-foreground">
                        {calculatedPrice}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {t('pricingPerEmployee')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-primary">
                      {fill(t('pricingEstMonthlyTotal'), { sar: monthlyTotal.toLocaleString() })}
                    </p>
                  </div>

                  {/* Feature List */}
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-foreground">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-8 pt-4">
                  <Link
                    href={tier.href}
                    className={cn(
                      'flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                      tier.popular
                        ? 'bg-primary text-primary-foreground shadow-md hover:scale-[1.02] active:scale-95'
                        : 'border border-border/80 bg-muted/40 text-foreground hover:bg-muted active:scale-95',
                    )}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
