'use client'

import Link from 'next/link'
import { ArrowRight, Briefcase, Sparkles, User, Wallet } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function DemoHubSection() {
  const { t } = useI18n()

  return (
    <section id="demo" className="border-b border-border bg-background py-16 sm:py-24 transition-colors">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('demoHubBadge')}</span>
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-foreground text-balance">
            {t('demoHubHeading')}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t('demoHubSubheading')}
          </p>
        </div>

        {/* 3 Role Cards from Phase 0 Hub */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <RoleCard
            href="/console"
            icon={<Briefcase className="h-6 w-6" />}
            title={t('roleAdmin')}
            hint={t('roleAdminHint')}
            cta={t('openDemo')}
            active
          />
          <RoleCard
            href="/jobs"
            icon={<User className="h-6 w-6" />}
            title={t('roleCandidate')}
            hint={t('roleCandidateHint')}
            cta={t('openDemo')}
            active
          />
          <RoleCard
            href="/me"
            icon={<Wallet className="h-6 w-6" />}
            title={t('roleEmployee')}
            hint={t('roleEmployeeHint')}
            cta={t('openDemo')}
            active
          />
        </div>
      </div>
    </section>
  )
}

function RoleCard({
  href,
  icon,
  title,
  hint,
  cta,
  active,
}: {
  href?: string
  icon: React.ReactNode
  title: string
  hint: string
  cta: string
  active: boolean
}) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </span>
        {active ? (
          <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-bold text-success">
            Interactive
          </span>
        ) : (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground">
            Phase 7
          </span>
        )}
      </div>

      <span className="mt-5 block text-lg font-bold tracking-tight text-foreground">
        {title}
      </span>
      <span className="mt-2 block flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
        {hint}
      </span>

      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
        <span>{cta}</span>
        {href && <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />}
      </span>
    </>
  )

  const cardClasses =
    'flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-md'

  if (!href || !active) {
    return (
      <div aria-disabled="true" className={cn(cardClasses, 'opacity-60 cursor-not-allowed')}>
        {body}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        cardClasses,
        'transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-ring',
      )}
    >
      {body}
    </Link>
  )
}
