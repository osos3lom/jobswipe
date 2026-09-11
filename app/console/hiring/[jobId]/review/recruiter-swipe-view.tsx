'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CheckCircle2,
  ChevronLeft,
  Flame,
  Info,
  MapPin,
  RotateCcw,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react'
import { jobs } from '@/lib/data'
import { useHr, useMoveApplicantStage } from '@/lib/hr/store'
import { useI18n, fill } from '@/lib/i18n'
import { formatSAR } from '@/lib/hr/format'
import { scoreApplicantForJob, type ScoredApplicant } from '@/lib/hr/hiring-matching'
import { MatchRing } from '@/components/match-ring'
import { cn } from '@/lib/utils'
import type { Applicant, ApplicantStage } from '@/lib/hr/types'

interface HistoryItem {
  applicantId: string
  fromStage: ApplicantStage
  toStage: ApplicantStage
}

const SWIPE_THRESHOLD = 100

export function RecruiterSwipeView({ jobId }: { jobId: string }) {
  const { t, tx, lang, dir } = useI18n()
  const { applicants } = useHr()
  const moveStage = useMoveApplicantStage()

  const [history, setHistory] = useState<HistoryItem[]>([])
  const [flyDirection, setFlyDirection] = useState<'shortlist' | 'pass' | null>(null)

  const job = useMemo(() => jobs.find((j) => j.id === jobId) ?? jobs[0], [jobId])

  // Get applicants for this job in 'applied' stage
  const pendingApplicants = useMemo(() => {
    return applicants
      .filter((a) => a.jobId === jobId && a.stage === 'applied')
      .map((a) => scoreApplicantForJob(a, job))
  }, [applicants, jobId, job])

  const topCard = pendingApplicants[0]

  const stats = useMemo(() => {
    const jobApplicants = applicants.filter((a) => a.jobId === jobId)
    const shortlisted = jobApplicants.filter(
      (a) => a.stage === 'screening' || a.stage === 'interview' || a.stage === 'offer',
    ).length
    const passed = jobApplicants.filter((a) => a.stage === 'rejected').length
    return {
      remaining: pendingApplicants.length,
      shortlisted,
      passed,
    }
  }, [applicants, jobId, pendingApplicants])

  // Handle swipe resolution
  const handleResolve = (direction: 'shortlist' | 'pass') => {
    if (!topCard) return
    const applicantId = topCard.applicant.id
    const targetStage: ApplicantStage = direction === 'shortlist' ? 'screening' : 'rejected'

    setHistory((prev) => [
      { applicantId, fromStage: 'applied', toStage: targetStage },
      ...prev,
    ])
    moveStage(applicantId, targetStage)
    setFlyDirection(null)
  }

  // Handle Undo
  const handleUndo = () => {
    if (history.length === 0) return
    const [lastAction, ...rest] = history
    moveStage(lastAction.applicantId, lastAction.fromStage)
    setHistory(rest)
  }

  // Keyboard navigation support: ArrowRight to Shortlist, ArrowLeft to Pass
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing if user is typing in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setFlyDirection('shortlist')
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setFlyDirection('pass')
      } else if ((e.key === 'Backspace' || e.key.toLowerCase() === 'z') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleUndo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [history])

  return (
    <div className="mx-auto max-w-4xl px-4 py-4">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href={`/console/hiring/${jobId}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
            <span>{t('backToPipeline')}</span>
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <Flame className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              {t('swipeTitle')} · {tx(job.title)}
            </h1>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400">
            {stats.shortlisted} {t('shortlistedCount')}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            {stats.passed} {t('passedCount')}
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
            {fill(t('remainingInDeck'), { count: stats.remaining })}
          </span>
        </div>
      </div>

      {/* Swipe Deck Area */}
      <div className="mt-8 flex flex-col items-center">
        {/* Keyboard hint */}
        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
          <Info className="h-3.5 w-3.5" />
          <span>{t('keyboardControls')}</span>
        </p>

        {topCard ? (
          <div className="relative h-[480px] w-full max-w-md">
            {/* Render 2 cards for stack depth */}
            {pendingApplicants.slice(0, 2).map((scored, index) => {
              const isTop = index === 0
              return (
                <RecruiterCardLayer
                  key={scored.applicant.id}
                  scored={scored}
                  isTop={isTop}
                  depth={index}
                  fly={isTop ? flyDirection : null}
                  onResolved={(dir) => handleResolve(dir)}
                />
              )
            }).reverse()}
          </div>
        ) : (
          /* Empty State */
          <div className="flex h-[360px] w-full max-w-md flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">
              {t('swipeDeckEmpty')}
            </h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              {t('swipeDeckEmptyHint')}
            </p>
            <div className="mt-6 flex gap-3">
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={handleUndo}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t('swipeUndo')}</span>
                </button>
              )}
              <Link
                href={`/console/hiring/${jobId}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/95"
              >
                <span>{t('backToPipeline')}</span>
                <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        )}

        {/* Action Controls Toolbar */}
        {topCard && (
          <div className="mt-6 flex items-center justify-center gap-6">
            {/* Pass / Reject Button */}
            <button
              type="button"
              onClick={() => setFlyDirection('pass')}
              aria-label="Pass on candidate"
              className="group flex h-14 w-14 items-center justify-center rounded-full border-2 border-destructive/40 bg-card text-destructive shadow-md transition-all hover:scale-105 hover:bg-destructive hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Undo Button */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0}
              aria-label="Undo last swipe"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:bg-muted disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Shortlist / Screening Button */}
            <button
              type="button"
              onClick={() => setFlyDirection('shortlist')}
              aria-label="Shortlist candidate"
              className="group flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-card text-emerald-600 shadow-md transition-all hover:scale-105 hover:bg-emerald-600 hover:text-white dark:text-emerald-400"
            >
              <Check className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function RecruiterCardLayer({
  scored,
  isTop,
  depth,
  fly,
  onResolved,
}: {
  scored: ScoredApplicant
  isTop: boolean
  depth: number
  fly: 'shortlist' | 'pass' | null
  onResolved: (dir: 'shortlist' | 'pass') => void
}) {
  const { t, tx, lang } = useI18n()
  const { applicant, score, reasons, matchedSkills } = scored

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12])
  const shortlistOpacity = useTransform(x, [30, 120], [0, 1])
  const passOpacity = useTransform(x, [-120, -30], [1, 0])

  const [exit, setExit] = useState<'shortlist' | 'pass' | null>(null)
  const leaving = exit ?? fly

  useEffect(() => {
    if (fly) setExit(fly)
  }, [fly])

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    const power = info.offset.x + info.velocity.x * 0.2
    if (power > SWIPE_THRESHOLD) setExit('shortlist')
    else if (power < -SWIPE_THRESHOLD) setExit('pass')
  }

  const flyTarget =
    leaving === 'shortlist'
      ? { x: 600, opacity: 0, rotate: 16 }
      : leaving === 'pass'
        ? { x: -600, opacity: 0, rotate: -16 }
        : undefined

  return (
    <motion.div
      className="absolute inset-0"
      style={isTop ? { x, y, rotate, zIndex: 30 } : { zIndex: 30 - depth }}
      initial={false}
      animate={
        isTop
          ? flyTarget
            ? { ...flyTarget, transition: { duration: 0.25 } }
            : { scale: 1, y: 0 }
          : { scale: 1 - depth * 0.04, y: depth * 12 }
      }
      onAnimationComplete={() => {
        if (isTop && leaving) onResolved(leaving)
      }}
      drag={isTop && !leaving ? 'x' : false}
      dragSnapToOrigin
      dragElastic={0.6}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div className="relative h-full w-full select-none rounded-3xl border border-border bg-card p-6 shadow-xl flex flex-col justify-between">
        {/* Stamp Overlays */}
        {isTop && (
          <>
            {/* SHORTLIST (Right) */}
            <motion.div
              style={{ opacity: shortlistOpacity }}
              className="pointer-events-none absolute start-6 top-6 rotate-[-12deg] rounded-2xl border-4 border-emerald-500 bg-emerald-500/10 px-4 py-1 z-50 backdrop-blur-xs"
            >
              <span className="flex items-center gap-1.5 text-2xl font-black uppercase text-emerald-600 dark:text-emerald-400">
                <Check className="h-6 w-6" />
                {t('swipeShortlist')}
              </span>
            </motion.div>

            {/* PASS (Left) */}
            <motion.div
              style={{ opacity: passOpacity }}
              className="pointer-events-none absolute end-6 top-6 rotate-[12deg] rounded-2xl border-4 border-destructive bg-destructive/10 px-4 py-1 z-50 backdrop-blur-xs"
            >
              <span className="flex items-center gap-1.5 text-2xl font-black uppercase text-destructive">
                <X className="h-6 w-6" />
                {t('swipePass')}
              </span>
            </motion.div>
          </>
        )}

        <div>
          {/* Card Top: Match Ring + Candidate Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <MatchRing score={score} size={64} stroke={6} />
              <div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold uppercase text-primary">
                  {applicant.experience} Level
                </span>
                <h3 className="mt-1 text-lg font-extrabold text-foreground">
                  {tx(applicant.name)}
                </h3>
                <p className="text-xs font-medium text-muted-foreground">
                  {tx(applicant.headline)}
                </p>
              </div>
            </div>
          </div>

          {/* Core Info Strip */}
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-muted/40 p-3 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="capitalize">{applicant.city}</span>
            </span>
            <span className="flex items-center gap-1 font-bold text-foreground">
              <Banknote className="h-3.5 w-3.5 text-primary" />
              <span>{formatSAR(applicant.expectedSalary, lang)}</span>
            </span>
          </div>

          {/* Match Reasons */}
          <div className="mt-4 space-y-1.5">
            {reasons.slice(0, 2).map((r, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold',
                  r.positive
                    ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-500/10 text-amber-800 dark:text-amber-300',
                )}
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{tx(r.label)}</span>
              </div>
            ))}
          </div>

          {/* Matched Skills */}
          <div className="mt-4">
            <p className="text-[11px] font-bold text-muted-foreground mb-1.5">
              Matched Skills:
            </p>
            <div className="flex flex-wrap gap-1">
              {matchedSkills.map((s) => (
                <span
                  key={s}
                  className="rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* CV Summary */}
          <div className="mt-4">
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {tx(applicant.cvSummary)}
            </p>
          </div>
        </div>

        {/* Card bottom hint */}
        <div className="border-t border-border/70 pt-3 text-center text-[11px] text-muted-foreground">
          Drag card or use arrow keys to evaluate
        </div>
      </div>
    </motion.div>
  )
}
