'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  Kanban,
  MapPin,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react'
import { jobs } from '@/lib/data'
import { useHr } from '@/lib/hr/store'
import { useI18n, fill } from '@/lib/i18n'
import { formatSAR } from '@/lib/hr/format'
import { cn } from '@/lib/utils'

// Only show the 5 open roles we seeded applicants for
const ACTIVE_JOB_IDS = ['j1', 'j2', 'j3', 'j6', 'j8']

export default function HiringDashboardPage() {
  const { t, tx, lang } = useI18n()
  const { applicants } = useHr()

  const activeJobs = useMemo(
    () => jobs.filter((j) => ACTIVE_JOB_IDS.includes(j.id)),
    [],
  )

  const stats = useMemo(() => {
    const totalApplicants = applicants.length
    const screeningCount = applicants.filter((a) => a.stage === 'screening').length
    const interviewCount = applicants.filter((a) => a.stage === 'interview').length
    const hiredCount = applicants.filter((a) => a.stage === 'hired').length
    return {
      openPositions: activeJobs.length,
      totalApplicants,
      screeningCount,
      interviewCount,
      hiredCount,
    }
  }, [applicants, activeJobs])

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              iHR Recruiter
            </span>
            <span className="text-xs text-muted-foreground">ATS & Pipeline</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            {t('hiringTitle')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('hiringSubtitle')}
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Briefcase className="h-4 w-4 text-primary" />
            <span>{t('openPositions')}</span>
          </span>
          <p className="mt-2 text-2xl font-extrabold text-foreground">
            {stats.openPositions}
          </p>
          <p className="text-[11px] text-muted-foreground">Wadi Al-Noor requisitions</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>{t('activeCandidates')}</span>
          </span>
          <p className="mt-2 text-2xl font-extrabold text-foreground">
            {stats.totalApplicants}
          </p>
          <p className="text-[11px] text-muted-foreground">Synced from candidate app</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>In Screening & Interview</span>
          </span>
          <p className="mt-2 text-2xl font-extrabold text-primary">
            {stats.screeningCount + stats.interviewCount}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {stats.screeningCount} screening · {stats.interviewCount} interview
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <UserCheck className="h-4 w-4 text-success" />
            <span>{t('stageHired')}</span>
          </span>
          <p className="mt-2 text-2xl font-extrabold text-success">
            {stats.hiredCount}
          </p>
          <p className="text-[11px] text-muted-foreground">Handed off to onboarding</p>
        </div>
      </div>

      {/* Requisitions List */}
      <div className="mt-8">
        <h2 className="text-base font-extrabold text-foreground mb-4">
          Active Requisitions ({activeJobs.length})
        </h2>

        <div className="space-y-4">
          {activeJobs.map((job) => {
            const jobApplicants = applicants.filter((a) => a.jobId === job.id)
            const appliedCount = jobApplicants.filter((a) => a.stage === 'applied').length
            const activeCount = jobApplicants.filter(
              (a) => a.stage !== 'hired' && a.stage !== 'rejected',
            ).length

            return (
              <div
                key={job.id}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md lg:flex-row lg:items-center"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                      {job.experience.toUpperCase()}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {fill(t('daysOpen'), { n: job.postedDaysAgo })}
                    </span>
                    {job.remoteFriendly && (
                      <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                        Remote Friendly
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {tx(job.title)}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{tx(job.city)}</span>
                    </span>
                    <span>
                      {formatSAR(job.salaryMin, lang)} - {formatSAR(job.salaryMax, lang)} / mo
                    </span>
                    <span className="font-semibold text-foreground">
                      {jobApplicants.length} applicants ({appliedCount} new to review)
                    </span>
                  </div>

                  {/* Stage pill breakdown */}
                  <div className="mt-4 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="rounded-lg bg-chart-4/10 px-2 py-0.5 font-bold text-chart-4">
                      {jobApplicants.filter((a) => a.stage === 'applied').length} Applied
                    </span>
                    <span className="rounded-lg bg-warning/10 px-2 py-0.5 font-bold text-warning">
                      {jobApplicants.filter((a) => a.stage === 'screening').length} Screening
                    </span>
                    <span className="rounded-lg bg-primary/10 px-2 py-0.5 font-bold text-primary">
                      {jobApplicants.filter((a) => a.stage === 'interview').length} Interview
                    </span>
                    <span className="rounded-lg bg-accent/10 px-2 py-0.5 font-bold text-accent">
                      {jobApplicants.filter((a) => a.stage === 'offer').length} Offer
                    </span>
                    <span className="rounded-lg bg-success/10 px-2 py-0.5 font-bold text-success">
                      {jobApplicants.filter((a) => a.stage === 'hired').length} Hired
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:mt-0 lg:ms-6">
                  {appliedCount > 0 && (
                    <Link
                      href={`/console/hiring/${job.id}/review`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
                    >
                      <Flame className="h-4 w-4 text-accent" />
                      <span>{t('recruiterSwipe')}</span>
                      <span className="rounded-full bg-primary px-1.5 py-0.2 text-[10px] text-primary-foreground">
                        {appliedCount}
                      </span>
                    </Link>
                  )}

                  <Link
                    href={`/console/hiring/${job.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-primary/95"
                  >
                    <Kanban className="h-4 w-4" />
                    <span>{t('viewPipeline')}</span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
