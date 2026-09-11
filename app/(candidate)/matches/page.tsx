'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  BadgeCheck,
  Bookmark,
  CalendarClock,
  Heart,
  MapPin,
  MessageCircle,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useStore } from '@/lib/store'
import { getJob } from '@/lib/data'
import { scoreJob } from '@/lib/matching'
import { AppShell } from '@/components/app-shell'
import { CompanyAvatar } from '@/components/company-avatar'
import { MatchRing } from '@/components/match-ring'
import { Button } from '@/components/ui/button'
import { formatSalary } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Job } from '@/lib/types'

type Tab = 'applied' | 'saved'

export default function MatchesPage() {
  const { t, tx, lang } = useI18n()
  const router = useRouter()
  const {
    profile,
    appliedJobIds,
    saved,
    threads,
    interviews,
    ensureThread,
    recordSwipe,
    toggleSaveJob,
  } = useStore()
  const [tab, setTab] = useState<Tab>('applied')

  const applied = useMemo(
    () =>
      appliedJobIds
        .map((id) => getJob(id))
        .filter((j): j is Job => Boolean(j))
        .map((j) => scoreJob(profile, j))
        .sort((a, b) => b.score - a.score),
    [appliedJobIds, profile],
  )

  const savedJobs = useMemo(
    () =>
      saved
        .map((id) => getJob(id))
        .filter((j): j is Job => Boolean(j))
        .map((j) => scoreJob(profile, j))
        .sort((a, b) => b.score - a.score),
    [saved, profile],
  )

  function openChat(jobId: string) {
    ensureThread(jobId)
    router.push(`/chat/${jobId}`)
  }

  function statusFor(jobId: string) {
    if (interviews.some((i) => i.jobId === jobId)) return t('statusInterview')
    const thread = threads.find((th) => th.jobId === jobId)
    if (thread && thread.messages.length > 1) return t('statusInChat')
    return t('statusApplied')
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'applied', label: t('applied'), count: applied.length },
    { key: 'saved', label: t('saved'), count: savedJobs.length },
  ]

  return (
    <AppShell title={t('yourMatches')}>
      {/* Segmented tabs */}
      <div className="mb-4 flex rounded-2xl bg-muted p-1">
        {tabs.map(({ key, label, count }) => {
          const active = tab === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className="relative flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold"
            >
              {active && (
                <motion.span
                  layoutId="matches-tab"
                  className="absolute inset-0 rounded-xl bg-card shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span
                className={cn(
                  'relative transition-colors',
                  active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
              {count > 0 && (
                <span
                  className={cn(
                    'relative rounded-full px-1.5 text-[11px] font-bold',
                    active
                      ? 'bg-primary/12 text-primary'
                      : 'bg-foreground/10 text-muted-foreground',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {tab === 'applied' ? (
        applied.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-9 w-9" />}
            title={t('noMatchesYet')}
            hint={t('noMatchesHint')}
            ctaHref="/discover"
            ctaLabel={t('startSwiping')}
          />
        ) : (
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.04 } } }}
            className="space-y-3"
          >
            {applied.map(({ job, score }) => (
              <Row key={job.id}>
                <CompanyAvatar name={tx(job.company)} size={52} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold leading-tight">{tx(job.title)}</h3>
                  <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
                    {tx(job.company)}
                    {job.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusPill jobId={job.id} label={statusFor(job.id)} />
                    <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {tx(job.city)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <MatchRing score={score} size={44} stroke={4} label={t('match')} />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 rounded-full px-3 text-xs"
                    onClick={() => openChat(job.id)}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    {t('messageEmployer')}
                  </Button>
                </div>
              </Row>
            ))}
          </motion.ul>
        )
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-9 w-9" />}
          title={t('noSavedYet')}
          hint={t('noSavedHint')}
          ctaHref="/discover"
          ctaLabel={t('startSwiping')}
        />
      ) : (
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          className="space-y-3"
        >
          {savedJobs.map(({ job, score }) => (
            <Row key={job.id}>
              <CompanyAvatar name={tx(job.company)} size={52} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold leading-tight">{tx(job.title)}</h3>
                <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
                  {tx(job.company)}
                  {job.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
                </p>
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {tx(job.city)} · {formatSalary(job.salaryMin, job.salaryMax, lang)}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <MatchRing score={score} size={44} stroke={4} label={t('match')} />
                <Button
                  size="sm"
                  className="h-8 rounded-full px-3 text-xs"
                  onClick={() => recordSwipe(job.id, 'apply')}
                >
                  {t('applyNow')}
                </Button>
              </div>
              <button
                type="button"
                onClick={() => toggleSaveJob(job.id)}
                aria-label={t('saveForLater')}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary bg-primary/12 text-primary"
              >
                <Bookmark className="h-4 w-4 fill-current" />
              </button>
            </Row>
          ))}
        </motion.ul>
      )}
    </AppShell>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <motion.li
      variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
      className="flex items-center gap-3 rounded-3xl border border-border bg-card p-3.5"
    >
      {children}
    </motion.li>
  )
}

function StatusPill({ jobId, label }: { jobId: string; label: string }) {
  const { interviews } = useStore()
  const isInterview = interviews.some((i) => i.jobId === jobId)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
        isInterview
          ? 'bg-success/12 text-success'
          : 'bg-primary/10 text-primary',
      )}
    >
      {isInterview && <CalendarClock className="h-3 w-3" />}
      {label}
    </span>
  )
}

function EmptyState({
  icon,
  title,
  hint,
  ctaHref,
  ctaLabel,
}: {
  icon: React.ReactNode
  title: string
  hint: string
  ctaHref: string
  ctaLabel: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-accent/12 text-accent">
        {icon}
      </span>
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">{hint}</p>
      </div>
      <Button
        render={<Link href={ctaHref} />}
        nativeButton={false}
        className="rounded-2xl"
      >
        {ctaLabel}
      </Button>
    </div>
  )
}
