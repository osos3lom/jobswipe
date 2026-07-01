'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Briefcase,
  Check,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Target,
  Trash2,
  Wallet,
  X,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useStore } from '@/lib/store'
import { AppShell } from '@/components/app-shell'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { formatSalary, initials } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ExperienceLevel, JobType, UserProfile } from '@/lib/types'

const REGIONS: UserProfile['city'][] = [
  'riyadh',
  'makkah',
  'eastern',
  'madinah',
  'asir',
  'remote',
]
const LEVELS: ExperienceLevel[] = ['entry', 'junior', 'mid', 'senior', 'lead']
const TYPES: JobType[] = ['full_time', 'part_time', 'contract', 'remote', 'internship']

export default function ProfilePage() {
  const { t, lang } = useI18n()
  const router = useRouter()
  const { profile, setProfile, appliedJobIds, saved, interviews, resetAll } =
    useStore()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<UserProfile>(profile)
  const [skillInput, setSkillInput] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  function startEdit() {
    setDraft(profile)
    setEditing(true)
  }
  function save() {
    setProfile(draft)
    setEditing(false)
  }
  function cancel() {
    setDraft(profile)
    setEditing(false)
  }
  function patch(p: Partial<UserProfile>) {
    setDraft((prev) => ({ ...prev, ...p }))
  }
  function addSkill(s: string) {
    const v = s.trim()
    if (!v || draft.skills.includes(v)) return
    patch({ skills: [...draft.skills, v] })
    setSkillInput('')
  }
  function reset() {
    resetAll()
    router.replace('/')
  }

  const salaryLabel = formatSalary(profile.desiredSalary, profile.desiredSalary, lang).split(
    '–',
  )[0]

  return (
    <AppShell
      title={t('profile')}
      action={
        !editing ? (
          <Button
            size="sm"
            variant="secondary"
            className="h-9 rounded-full px-3"
            onClick={startEdit}
          >
            <Pencil className="h-4 w-4" />
            {t('editProfile')}
          </Button>
        ) : undefined
      }
    >
      {editing ? (
        /* ---------- EDIT MODE ---------- */
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('fullName')}</Label>
            <Input
              id="name"
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
              className="h-12 rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="headline">{t('headline')}</Label>
            <Input
              id="headline"
              value={draft.headline}
              onChange={(e) => patch({ headline: e.target.value })}
              className="h-12 rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('careerGoal')}</Label>
            <textarea
              value={draft.careerGoal}
              onChange={(e) => patch({ careerGoal: e.target.value })}
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm leading-relaxed outline-none focus:border-primary/60"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('skills')}</Label>
            <div className="flex flex-wrap gap-2">
              {draft.skills.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => patch({ skills: draft.skills.filter((x) => x !== s) })}
                    aria-label={`remove ${s}`}
                  >
                    <X className="h-3.5 w-3.5 opacity-60" />
                  </button>
                </span>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                addSkill(skillInput)
              }}
              className="flex gap-2"
            >
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder={t('addSkill')}
                className="h-11 rounded-2xl"
              />
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-2xl"
                aria-label={t('addSkill')}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </form>
          </div>

          <div className="space-y-2">
            <Label>{t('preferredCity')}</Label>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <Chip key={r} active={draft.city === r} onClick={() => patch({ city: r })}>
                  {t(r)}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('experienceLevel')}</Label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <Chip
                  key={l}
                  active={draft.experience === l}
                  onClick={() => patch({ experience: l })}
                >
                  {t(l)}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t('desiredSalary')}</Label>
              <span className="text-sm font-semibold text-primary">
                {formatSalary(draft.desiredSalary, draft.desiredSalary, lang).split('–')[0]}
              </span>
            </div>
            <Slider
              value={[draft.desiredSalary]}
              min={4000}
              max={40000}
              step={1000}
              onValueChange={(v) =>
                patch({ desiredSalary: Array.isArray(v) ? v[0] : v })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>{t('jobTypes')}</Label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((ty) => (
                <Chip
                  key={ty}
                  active={draft.jobTypes.includes(ty)}
                  onClick={() =>
                    patch({
                      jobTypes: draft.jobTypes.includes(ty)
                        ? draft.jobTypes.filter((x) => x !== ty)
                        : [...draft.jobTypes, ty],
                    })
                  }
                >
                  {t(ty)}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button variant="ghost" className="h-12 rounded-2xl px-4" onClick={cancel}>
              {t('cancel')}
            </Button>
            <Button className="h-12 flex-1 rounded-2xl text-base font-semibold" onClick={save}>
              <Check className="h-5 w-5" />
              {t('saveChanges')}
            </Button>
          </div>
        </div>
      ) : (
        /* ---------- VIEW MODE ---------- */
        <div className="space-y-5">
          {/* identity */}
          <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-2xl font-bold text-primary"
              aria-hidden="true"
            >
              {initials(profile.name || 'You')}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold leading-tight">
                {profile.name || t('fullName')}
              </h2>
              <p className="truncate text-sm text-muted-foreground">{profile.headline}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                <MapPin className="h-3 w-3" />
                {t(profile.city)}
              </p>
            </div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-3">
            <Stat value={appliedJobIds.length} label={t('appliedCount')} />
            <Stat value={saved.length} label={t('savedCount')} />
            <Stat value={interviews.length} label={t('interviewsCount')} />
          </div>

          {/* career goal */}
          {profile.careerGoal && (
            <Section icon={<Target className="h-4 w-4" />} title={t('careerGoal')}>
              <p className="text-sm leading-relaxed text-foreground/90 text-pretty">
                {profile.careerGoal}
              </p>
              {profile.aspirationalSkills.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t('growthSkills')}
                  </p>
                  <ChipRow items={profile.aspirationalSkills} accent />
                </div>
              )}
            </Section>
          )}

          {/* skills */}
          {profile.skills.length > 0 && (
            <Section title={t('skills')}>
              <ChipRow items={profile.skills} />
            </Section>
          )}

          {/* preferences */}
          <Section title={t('preferences')}>
            <dl className="space-y-2 text-sm">
              <PrefRow icon={<Briefcase className="h-4 w-4" />} label={t('experienceLevel')}>
                {t(profile.experience)}
              </PrefRow>
              <PrefRow icon={<Wallet className="h-4 w-4" />} label={t('desiredSalary')}>
                {salaryLabel}
              </PrefRow>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.jobTypes.map((ty) => (
                  <span
                    key={ty}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {t(ty)}
                  </span>
                ))}
              </div>
            </dl>
          </Section>

          {/* settings */}
          <Section title={t('settings')}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('language')}</span>
                <LanguageToggle />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('theme')}</span>
                <ThemeToggle />
              </div>
            </div>
          </Section>

          {/* about + reset */}
          <div className="rounded-3xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-foreground">{t('about')}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">
              {t('aboutText')}
            </p>
            <div className="mt-3 border-t border-border/60 pt-3">
              {confirmReset ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-9 flex-1 rounded-xl"
                    onClick={reset}
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('resetApp')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-xl"
                    onClick={() => setConfirmReset(false)}
                  >
                    {t('cancel')}
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="flex items-center gap-2 text-sm font-medium text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('resetApp')}
                </button>
              )}
              <p className="mt-1.5 text-[11px] text-muted-foreground">{t('resetAppHint')}</p>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {title}
      </p>
      {children}
    </div>
  )
}

function ChipRow({ items, accent }: { items: string[]; accent?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <span
          key={s}
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-medium',
            accent
              ? 'bg-accent/20 text-accent-foreground'
              : 'bg-secondary text-secondary-foreground',
          )}
        >
          {s}
        </span>
      ))}
    </div>
  )
}

function PrefRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium">{children}</span>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-colors active:scale-95',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground hover:bg-secondary',
      )}
    >
      {children}
    </button>
  )
}
