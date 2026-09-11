'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Loader2,
  Plus,
  UploadCloud,
  X,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useStore } from '@/lib/store'
import { SKILL_POOL, defaultProfile } from '@/lib/data'
import type { ExperienceLevel, JobType, UserProfile } from '@/lib/types'
import { CareerCoach } from '@/components/career-coach'
import { LanguageToggle } from '@/components/language-toggle'
import { Logo } from '@/components/logo'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { formatSalary } from '@/lib/format'
import { cn } from '@/lib/utils'

const REGIONS: UserProfile['city'][] = ['riyadh', 'makkah', 'eastern', 'madinah', 'asir', 'remote']
const LEVELS: ExperienceLevel[] = ['entry', 'junior', 'mid', 'senior', 'lead']
const TYPES: JobType[] = ['full_time', 'part_time', 'contract', 'remote', 'internship']

const TOTAL = 4

export default function OnboardingPage() {
  const { t, tx, dir, lang } = useI18n()
  const { completeOnboarding } = useStore()
  const router = useRouter()

  const [stepIdx, setStepIdx] = useState(0)
  const [profile, setProfile] = useState<UserProfile>({ ...defaultProfile })
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [goalReady, setGoalReady] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function patch(p: Partial<UserProfile>) {
    setProfile((prev) => ({ ...prev, ...p }))
  }

  function simulateParse() {
    setParsing(true)
    setTimeout(() => {
      // Pseudo-random but stable subset of the skill pool.
      const picked = SKILL_POOL.filter((_, i) => i % 3 === 0).slice(0, 5)
      patch({ skills: Array.from(new Set([...profile.skills, ...picked])) })
      setParsing(false)
      setParsed(true)
    }, 1400)
  }

  function addSkill(s: string) {
    const v = s.trim()
    if (!v || profile.skills.includes(v)) return
    patch({ skills: [...profile.skills, v] })
    setSkillInput('')
  }
  function removeSkill(s: string) {
    patch({ skills: profile.skills.filter((x) => x !== s) })
  }
  function toggleType(ty: JobType) {
    patch({
      jobTypes: profile.jobTypes.includes(ty)
        ? profile.jobTypes.filter((x) => x !== ty)
        : [...profile.jobTypes, ty],
    })
  }

  const canContinue = useMemo(() => {
    if (stepIdx === 0) return profile.name.trim().length > 1
    if (stepIdx === 1) return profile.skills.length > 0
    if (stepIdx === 2) return goalReady
    return true
  }, [stepIdx, profile, goalReady])

  function next() {
    if (stepIdx < TOTAL - 1) {
      setStepIdx((s) => s + 1)
    } else {
      completeOnboarding(profile)
      router.push('/discover')
    }
  }
  function back() {
    if (stepIdx > 0) setStepIdx((s) => s - 1)
    else router.push('/jobs')
  }
  function skip() {
    // Finish onboarding with whatever has been filled in (defaults are fine).
    completeOnboarding(profile)
    router.push('/discover')
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-3">
        <Logo />
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={skip}
            className="h-9 rounded-full px-3 text-muted-foreground"
          >
            {t('skipForNow')}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Button>
          <LanguageToggle />
        </div>
      </header>

      {/* progress */}
      <div className="px-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                i <= stepIdx ? 'bg-primary' : 'bg-muted',
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-xs font-medium text-muted-foreground">
          {t('step')} {stepIdx + 1} {t('of')} {TOTAL}
        </p>
      </div>

      <div className="relative flex-1 overflow-hidden px-4 pb-4 pt-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, x: dir === 'rtl' ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir === 'rtl' ? 24 : -24 }}
            transition={{ duration: 0.25 }}
            className="flex h-full flex-col"
          >
            {/* STEP 1 — basics */}
            {stepIdx === 0 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold tracking-tight text-balance">
                  {t('yourBasics')}
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="name">{t('fullName')}</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => patch({ name: e.target.value })}
                    placeholder={lang === 'ar' ? 'محمد العتيبي' : 'Mohammed Al-Otaibi'}
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headline">{t('headline')}</Label>
                  <Input
                    id="headline"
                    value={profile.headline}
                    onChange={(e) => patch({ headline: e.target.value })}
                    placeholder={lang === 'ar' ? 'مهندس برمجيات' : 'Software Engineer'}
                    className="h-12 rounded-2xl"
                  />
                </div>
              </div>
            )}

            {/* STEP 2 — CV + skills */}
            {stepIdx === 1 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold tracking-tight text-balance">
                  {t('uploadCv')}
                </h2>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={() => simulateParse()}
                />
                <button
                  type="button"
                  onClick={() => (parsed ? undefined : fileRef.current?.click())}
                  disabled={parsing}
                  className={cn(
                    'flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed px-4 py-8 text-center transition-colors',
                    parsed
                      ? 'border-success/50 bg-success/5'
                      : 'border-primary/30 bg-primary/5 hover:bg-primary/10',
                  )}
                >
                  {parsing ? (
                    <>
                      <Loader2 className="h-7 w-7 animate-spin text-primary" />
                      <span className="text-sm font-medium">{t('parsing')}</span>
                    </>
                  ) : parsed ? (
                    <>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                        <FileText className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-medium text-success">
                        cv-{profile.name || 'profile'}.pdf
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UploadCloud className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-medium">{t('uploadCvHint')}</span>
                    </>
                  )}
                </button>

                <div className="space-y-2">
                  <Label>{t('extractedSkills')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s) => (
                      <span
                        key={s}
                        className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => removeSkill(s)}
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
              </div>
            )}

            {/* STEP 3 — AI career coach */}
            {stepIdx === 2 && (
              <div className="flex h-full flex-col">
                <h2 className="text-2xl font-bold tracking-tight text-balance">
                  {t('coachTitle')}
                </h2>
                <p className="mb-2 mt-1 text-sm text-muted-foreground">
                  {t('coachIntro')}
                </p>
                <div className="min-h-0 flex-1">
                  <CareerCoach
                    onComplete={(goal, skills) => {
                      patch({ careerGoal: goal, aspirationalSkills: skills })
                      setGoalReady(true)
                    }}
                  />
                </div>
                {goalReady && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 p-3"
                  >
                    <Label className="text-xs text-primary">{t('yourGoal')}</Label>
                    <textarea
                      value={profile.careerGoal}
                      onChange={(e) => patch({ careerGoal: e.target.value })}
                      rows={3}
                      className="mt-1 w-full resize-none bg-transparent text-sm font-medium leading-relaxed outline-none"
                    />
                    <p className="text-[11px] text-muted-foreground">{t('goalHint')}</p>
                  </motion.div>
                )}
              </div>
            )}

            {/* STEP 4 — preferences */}
            {stepIdx === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-balance">
                  {t('preferences')}
                </h2>

                <div className="space-y-2">
                  <Label>{t('preferredCity')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map((r) => (
                      <Chip
                        key={r}
                        active={profile.city === r}
                        onClick={() => patch({ city: r })}
                      >
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
                        active={profile.experience === l}
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
                      {formatSalary(profile.desiredSalary, profile.desiredSalary, lang).split('–')[0]}
                    </span>
                  </div>
                  <Slider
                    value={[profile.desiredSalary]}
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
                        active={profile.jobTypes.includes(ty)}
                        onClick={() => toggleType(ty)}
                      >
                        {t(ty)}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* footer nav */}
      <div className="flex items-center gap-3 px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={back}
          className="h-12 rounded-2xl px-4"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
          {t('back')}
        </Button>
        <Button
          type="button"
          onClick={next}
          disabled={!canContinue}
          className="h-12 flex-1 rounded-2xl text-base font-semibold"
        >
          {stepIdx === TOTAL - 1 ? (
            <>
              <Check className="h-5 w-5" />
              {t('finish')}
            </>
          ) : (
            <>
              {t('next')}
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
            </>
          )}
        </Button>
      </div>
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
