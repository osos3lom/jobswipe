'use client'

import { BadgeCheck, Bookmark, Briefcase, MapPin, Wallet } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { formatSalary } from '@/lib/format'
import type { ScoredJob } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CompanyAvatar } from './company-avatar'
import { MatchRing } from './match-ring'

export function JobCard({
  scored,
  saved,
  onToggleSave,
}: {
  scored: ScoredJob
  saved?: boolean
  onToggleSave?: () => void
}) {
  const { t, tx, lang } = useI18n()
  const { job, score, reasons } = scored

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_12px_50px_-18px_rgba(0,0,0,0.35)]">
      {/* header band */}
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="flex min-w-0 items-start gap-3">
          <CompanyAvatar name={tx(job.company)} size={52} />
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold leading-tight text-balance">
              {tx(job.title)}
            </h2>
            <p className="mt-0.5 flex items-center gap-1 truncate text-sm font-medium text-muted-foreground">
              {tx(job.company)}
              {job.verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label={t('verified')} />
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MatchRing score={score} label={t('match')} />
          {onToggleSave && (
            <button
              type="button"
              // stop the pointer here so tapping the bookmark never starts a drag
              onPointerDownCapture={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                onToggleSave()
              }}
              aria-pressed={saved}
              aria-label={t('saveForLater')}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
                saved
                  ? 'border-primary bg-primary/12 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />
            </button>
          )}
        </div>
      </div>

      {/* meta pills */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
        <Meta icon={MapPin}>{tx(job.city)}</Meta>
        <Meta icon={Briefcase}>{t(job.type)}</Meta>
        <Meta icon={Wallet}>{formatSalary(job.salaryMin, job.salaryMax, lang)}</Meta>
      </div>

      {/* description */}
      <div className="px-5 pb-3">
        <p className="text-sm leading-relaxed text-foreground/80 line-clamp-3">
          {tx(job.description)}
        </p>
      </div>

      {/* skills */}
      <div className="flex flex-wrap gap-2 px-5 pb-4">
        {job.skills.map((s) => (
          <span
            key={s}
            className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
          >
            {s}
          </span>
        ))}
      </div>

      {/* why matched */}
      <div className="mt-auto border-t border-border bg-secondary/40 px-5 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t('whyMatch')}
        </p>
        <div className="flex flex-wrap gap-2">
          {reasons.map((r) => (
            <span
              key={r.key}
              className={
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ' +
                (r.positive
                  ? 'bg-success/12 text-success'
                  : 'bg-destructive/10 text-destructive')
              }
            >
              <span
                className={
                  'h-1.5 w-1.5 rounded-full ' +
                  (r.positive ? 'bg-success' : 'bg-destructive')
                }
              />
              {tx(r.label)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Meta({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/80">
      <Icon className="h-3.5 w-3.5 text-primary" />
      {children}
    </span>
  )
}
