'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Flame,
  Kanban,
  MapPin,
  Search,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react'
import { jobs } from '@/lib/data'
import {
  useAddApplicantNote,
  useHireApplicant,
  useHr,
  useMoveApplicantStage,
} from '@/lib/hr/store'
import { useI18n } from '@/lib/i18n'
import { scoreApplicantForJob, type ScoredApplicant } from '@/lib/hr/hiring-matching'
import { ApplicantCard } from '@/components/hiring/applicant-card'
import { ApplicantDrawer } from '@/components/hiring/applicant-drawer'
import { HireDialog } from '@/components/hiring/hire-dialog'
import { cn } from '@/lib/utils'
import type { Applicant, ApplicantStage, DepartmentId } from '@/lib/hr/types'

const COLUMNS: { stage: ApplicantStage; labelKey: string; color: string }[] = [
  { stage: 'applied', labelKey: 'stageApplied', color: 'border-chart-4/40 bg-chart-4/5 text-chart-4' },
  { stage: 'screening', labelKey: 'stageScreening', color: 'border-warning/40 bg-warning/5 text-warning' },
  { stage: 'interview', labelKey: 'stageInterview', color: 'border-primary/40 bg-primary/5 text-primary' },
  { stage: 'offer', labelKey: 'stageOffer', color: 'border-accent/40 bg-accent/5 text-accent' },
  { stage: 'hired', labelKey: 'stageHired', color: 'border-success/40 bg-success/5 text-success' },
  { stage: 'rejected', labelKey: 'stageRejected', color: 'border-border bg-muted/40 text-muted-foreground' },
]

export function PipelineView({ jobId }: { jobId: string }) {
  const { t, tx } = useI18n()
  const { applicants } = useHr()
  const moveStage = useMoveApplicantStage()
  const addNote = useAddApplicantNote()
  const hireApplicant = useHireApplicant()

  const [query, setQuery] = useState('')
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [hiringApplicant, setHiringApplicant] = useState<Applicant | null>(null)
  const [dragOverCol, setDragOverCol] = useState<ApplicantStage | null>(null)

  const job = useMemo(() => jobs.find((j) => j.id === jobId) ?? jobs[0], [jobId])

  // Filter applicants for this job and compute match scores
  const scoredApplicants = useMemo<ScoredApplicant[]>(() => {
    return applicants
      .filter((a) => a.jobId === jobId)
      .map((a) => scoreApplicantForJob(a, job))
      .filter((sa) => {
        if (!query.trim()) return true
        const q = query.toLowerCase()
        return (
          sa.applicant.name.en.toLowerCase().includes(q) ||
          sa.applicant.name.ar.includes(q) ||
          sa.applicant.skills.some((s) => s.toLowerCase().includes(q))
        )
      })
  }, [applicants, jobId, job, query])

  const appliedCount = useMemo(
    () => scoredApplicants.filter((sa) => sa.applicant.stage === 'applied').length,
    [scoredApplicants],
  )

  const selectedScored = useMemo(() => {
    if (!selectedApplicant) return null
    return scoredApplicants.find((sa) => sa.applicant.id === selectedApplicant.id) ?? null
  }, [selectedApplicant, scoredApplicants])

  const handleDropOnStage = (targetStage: ApplicantStage, e: React.DragEvent) => {
    e.preventDefault()
    setDragOverCol(null)
    const applicantId = e.dataTransfer.getData('text/plain')
    if (!applicantId) return

    if (targetStage === 'hired') {
      const applicant = applicants.find((a) => a.id === applicantId)
      if (applicant) {
        setHiringApplicant(applicant)
        return
      }
    }

    moveStage(applicantId, targetStage)
  }

  const handleStageChange = (applicantId: string, stage: ApplicantStage) => {
    if (stage === 'hired') {
      const applicant = applicants.find((a) => a.id === applicantId)
      if (applicant) {
        setHiringApplicant(applicant)
        return
      }
    }
    moveStage(applicantId, stage)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Bar / Breadcrumb */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/console/hiring"
            className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 rtl:-scale-x-100" />
            <span>{t('backToJobs')}</span>
          </Link>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {tx(job.title)}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{tx(job.city)}</span>
            </span>
            <span>·</span>
            <span>{scoredApplicants.length} total candidates</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchCandidates')}
              className="rounded-2xl border border-border bg-card ps-8 pe-3 py-1.5 text-xs font-medium text-foreground focus:outline-2 focus:outline-primary w-48 sm:w-56"
            />
          </div>

          {/* Recruiter Swipe Button */}
          {appliedCount > 0 && (
            <Link
              href={`/console/hiring/${jobId}/review`}
              className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary shadow-xs transition-colors hover:bg-primary/20"
            >
              <Flame className="h-4 w-4 text-accent" />
              <span>{t('recruiterSwipe')}</span>
              <span className="rounded-full bg-primary px-1.5 py-0.2 text-[10px] text-primary-foreground">
                {appliedCount}
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="overflow-x-auto pb-6">
        <div className="flex min-w-[1200px] snap-x snap-mandatory gap-4 lg:grid lg:min-w-0 lg:grid-cols-6">
          {COLUMNS.map((col) => {
            const columnCandidates = scoredApplicants.filter(
              (sa) => sa.applicant.stage === col.stage,
            )
            const isDragOver = dragOverCol === col.stage

            return (
              <div
                key={col.stage}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOverCol(col.stage)
                }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={(e) => handleDropOnStage(col.stage, e)}
                className={cn(
                  'flex min-w-[240px] flex-col rounded-3xl border p-3.5 transition-all lg:min-w-0',
                  isDragOver
                    ? 'border-2 border-primary bg-primary/5 ring-4 ring-primary/10'
                    : 'border-border/80 bg-muted/20',
                )}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-foreground">
                      {t(col.labelKey)}
                    </h3>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[11px] font-extrabold',
                        col.color,
                      )}
                    >
                      {columnCandidates.length}
                    </span>
                  </div>
                </div>

                {/* Candidate Cards Stack */}
                <div className="mt-3 flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)]">
                  {columnCandidates.length > 0 ? (
                    columnCandidates.map((scored) => (
                      <ApplicantCard
                        key={scored.applicant.id}
                        scored={scored}
                        onSelect={(app) => setSelectedApplicant(app)}
                        onMoveStage={handleStageChange}
                      />
                    ))
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border/80 p-4 text-center">
                      <p className="text-[11px] text-muted-foreground">
                        {t('emptyColumn')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Drawer */}
      <ApplicantDrawer
        scored={selectedScored}
        open={!!selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        onMoveStage={(id, stage) => {
          handleStageChange(id, stage)
          if (selectedApplicant) {
            setSelectedApplicant((prev) => (prev ? { ...prev, stage } : null))
          }
        }}
        onAddNote={(id, text) => addNote(id, text)}
        onInitiateHire={(applicant) => {
          setSelectedApplicant(null)
          setHiringApplicant(applicant)
        }}
      />

      {/* Hire Dialog */}
      <HireDialog
        applicant={hiringApplicant}
        open={!!hiringApplicant}
        onClose={() => setHiringApplicant(null)}
        onConfirmHire={(applicantId, dept) => hireApplicant(applicantId, dept)}
      />
    </div>
  )
}
