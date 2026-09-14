'use client'

import { useState } from 'react'
import {
  Banknote,
  CheckCircle2,
  ChevronDown,
  GripVertical,
  MapPin,
  MessageSquare,
} from 'lucide-react'
import { MatchRing } from '@/components/match-ring'
import { useI18n } from '@/lib/i18n'
import { formatSAR } from '@/lib/hr/format'
import { cn } from '@/lib/utils'
import type { Applicant, ApplicantStage } from '@/lib/hr/types'
import type { ScoredApplicant } from '@/lib/hr/hiring-matching'

const ALL_STAGES: ApplicantStage[] = [
  'applied',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
]

interface Props {
  scored: ScoredApplicant
  onSelect: (applicant: Applicant) => void
  onMoveStage: (applicantId: string, stage: ApplicantStage) => void
}

export function ApplicantCard({ scored, onSelect, onMoveStage }: Props) {
  const { t, tx, lang } = useI18n()
  const { applicant, score, reasons, matchedSkills } = scored
  const [menuOpen, setMenuOpen] = useState(false)

  const topReason = reasons[0]

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', applicant.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md cursor-grab active:cursor-grabbing focus-within:ring-2 focus-within:ring-primary/20"
      onClick={(e) => {
        // If clicking inside the menu or select, don't trigger drawer
        if ((e.target as HTMLElement).closest('[data-stop-propagation]')) return
        onSelect(applicant)
      }}
    >
      {/* Top row: Match ring + info + drag grip */}
      <div>
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-3">
            <MatchRing score={score} size={46} stroke={4} />
            <div>
              <h4 className="text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
                {tx(applicant.name)}
              </h4>
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {tx(applicant.headline)}
              </p>
            </div>
          </div>

          <span
            className="text-muted-foreground/40 group-hover:text-muted-foreground/80 transition-colors"
            title={t('dragToMove')}
            aria-hidden="true"
          >
            <GripVertical className="h-4 w-4" />
          </span>
        </div>

        {/* 1-Line Match Rationale */}
        {topReason && (
          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-foreground">
            <CheckCircle2
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                topReason.positive
                  ? 'text-success'
                  : 'text-warning',
              )}
            />
            <span className="truncate">{tx(topReason.label)}</span>
          </div>
        )}

        {/* Matched skills chips */}
        {matchedSkills.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {matchedSkills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary"
              >
                {skill}
              </span>
            ))}
            {matchedSkills.length > 3 && (
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                +{matchedSkills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata & Accessible Move-to dropdown */}
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="capitalize">{applicant.city}</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Banknote className="h-3 w-3 text-primary" />
            <span>{formatSAR(applicant.expectedSalary, lang)}</span>
          </span>
          {applicant.notes.length > 0 && (
            <span className="flex items-center gap-1 text-primary">
              <MessageSquare className="h-3 w-3" />
              <span>{applicant.notes.length}</span>
            </span>
          )}
        </div>

        {/* Keyboard-accessible Move-to menu */}
        <div className="relative" data-stop-propagation="true">
          <select
            value={applicant.stage}
            onChange={(e) => {
              onMoveStage(applicant.id, e.target.value as ApplicantStage)
            }}
            aria-label={t('moveTo')}
            className="cursor-pointer rounded-lg border border-border bg-background px-2 py-1 text-[11px] font-semibold text-foreground shadow-xs hover:border-primary focus:outline-2 focus:outline-primary"
          >
            {ALL_STAGES.map((s) => (
              <option key={s} value={s}>
                {s === applicant.stage ? `✓ ${t(stageKey(s))}` : t(stageKey(s))}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function stageKey(stage: ApplicantStage): string {
  switch (stage) {
    case 'applied':
      return 'stageApplied'
    case 'screening':
      return 'stageScreening'
    case 'interview':
      return 'stageInterview'
    case 'offer':
      return 'stageOffer'
    case 'hired':
      return 'stageHired'
    case 'rejected':
      return 'stageRejected'
  }
}
