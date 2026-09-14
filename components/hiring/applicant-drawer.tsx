'use client'

import { useState } from 'react'
import {
  Banknote,
  Calendar,
  Check,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Send,
  UserCheck,
  X,
} from 'lucide-react'
import { MatchRing } from '@/components/match-ring'
import { useI18n, fill } from '@/lib/i18n'
import { formatSAR } from '@/lib/hr/format'
import { cn } from '@/lib/utils'
import type { Applicant, ApplicantStage } from '@/lib/hr/types'
import type { ScoredApplicant } from '@/lib/hr/hiring-matching'

interface Props {
  scored: ScoredApplicant | null
  open: boolean
  onClose: () => void
  onMoveStage: (applicantId: string, stage: ApplicantStage) => void
  onAddNote: (applicantId: string, text: string) => void
  onInitiateHire: (applicant: Applicant) => void
}

const STAGES: { stage: ApplicantStage; labelKey: string }[] = [
  { stage: 'applied', labelKey: 'stageApplied' },
  { stage: 'screening', labelKey: 'stageScreening' },
  { stage: 'interview', labelKey: 'stageInterview' },
  { stage: 'offer', labelKey: 'stageOffer' },
  { stage: 'hired', labelKey: 'stageHired' },
  { stage: 'rejected', labelKey: 'stageRejected' },
]

export function ApplicantDrawer({
  scored,
  open,
  onClose,
  onMoveStage,
  onAddNote,
  onInitiateHire,
}: Props) {
  const { t, tx, lang } = useI18n()
  const [noteText, setNoteText] = useState('')

  if (!open || !scored) return null
  const { applicant, score, reasons, matchedSkills, missingSkills } = scored

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteText.trim()) return
    onAddNote(applicant.id, noteText.trim())
    setNoteText('')
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="relative h-full w-full max-w-xl overflow-y-auto border-s border-border bg-card p-6 shadow-2xl animate-in slide-in-from-right duration-200 sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute end-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-muted focus:outline-2"
          aria-label={t('closeDrawer')}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Drawer Header */}
        <div className="flex items-start gap-4 pe-8">
          <MatchRing score={score} size={64} stroke={6} />
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-foreground">
              {tx(applicant.name)}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-muted-foreground">
              {tx(applicant.headline)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {applicant.stage.toUpperCase()}
              </span>
              <span className="text-xs text-muted-foreground">
                Source: <span className="font-semibold capitalize text-foreground">{applicant.source}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stage Bar */}
        <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-3">
          <p className="text-xs font-bold text-muted-foreground mb-2">
            {t('currentStage')}:
          </p>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 text-xs">
            {STAGES.map(({ stage, labelKey }) => {
              const isCurrent = applicant.stage === stage
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => {
                    if (stage === 'hired') {
                      onInitiateHire(applicant)
                    } else {
                      onMoveStage(applicant.id, stage)
                    }
                  }}
                  className={cn(
                    'rounded-xl py-1.5 px-2 font-bold transition-all text-center',
                    isCurrent
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-card text-foreground hover:bg-muted',
                  )}
                >
                  {t(labelKey)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Contact & Basics Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl border border-border p-3">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              <span>Email</span>
            </span>
            <p className="mt-1 font-semibold text-foreground truncate">{applicant.email}</p>
          </div>

          <div className="rounded-2xl border border-border p-3">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              <span>Phone</span>
            </span>
            <p className="mt-1 font-semibold text-foreground dir-ltr text-start">{applicant.phone}</p>
          </div>

          <div className="rounded-2xl border border-border p-3">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{t('locationLabel')}</span>
            </span>
            <p className="mt-1 font-semibold capitalize text-foreground">{applicant.city}</p>
          </div>

          <div className="rounded-2xl border border-border p-3">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Banknote className="h-3.5 w-3.5" />
              <span>{t('expectedSalary')}</span>
            </span>
            <p className="mt-1 font-semibold text-primary">
              {formatSAR(applicant.expectedSalary, lang)}
            </p>
          </div>
        </div>

        {/* Match Breakdown Section */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            AI Match Breakdown ({score}%)
          </h4>

          {/* Reasons List */}
          <div className="space-y-1.5">
            {reasons.map((reason, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium',
                  reason.positive
                    ? 'bg-success/10 text-success'
                    : 'bg-warning/10 text-warning',
                )}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{tx(reason.label)}</span>
              </div>
            ))}
          </div>

          {/* Skills Breakdown */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground mb-1.5">
                {t('matchedSkills')} ({matchedSkills.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {matchedSkills.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg bg-success/15 px-2 py-0.5 text-xs font-bold text-success"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-muted-foreground mb-1.5">
                {t('missingSkills')} ({missingSkills.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {missingSkills.length > 0 ? (
                  missingSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CV Narrative */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            {t('cvSummary')}
          </h4>
          <p className="rounded-2xl border border-border bg-muted/30 p-4 text-xs leading-relaxed text-foreground">
            {tx(applicant.cvSummary)}
          </p>
        </div>

        {/* Recruiter Notes & Timeline */}
        <div className="mt-6 border-t border-border pt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('recruiterNotes')} ({applicant.notes.length})
            </h4>
          </div>

          {/* Add note input */}
          <form onSubmit={handlePostNote} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={t('addNotePlaceholder')}
                className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground focus:outline-2 focus:outline-primary"
              />
              <button
                type="submit"
                disabled={!noteText.trim()}
                aria-label={t('saveNote')}
                className="rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5 rtl:-scale-x-100" />
              </button>
            </div>
          </form>

          {/* Notes list */}
          <div className="space-y-2">
            {applicant.notes.length > 0 ? (
              applicant.notes.map((note) => (
                <div key={note.id} className="rounded-2xl border border-border bg-card p-3 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                    <span className="font-bold text-foreground">{note.author}</span>
                    <span>{note.createdAt}</span>
                  </div>
                  <p className="text-foreground leading-relaxed">{note.text}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">
                {t('noNotesYet')}
              </p>
            )}
          </div>
        </div>

        {/* Action Button: Hire Candidate */}
        {applicant.stage !== 'hired' && (
          <div className="mt-8 border-t border-border pt-6">
            <button
              type="button"
              onClick={() => onInitiateHire(applicant)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-success px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-success transition-colors"
            >
              <UserCheck className="h-4 w-4" />
              <span>{t('hireCandidate')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
