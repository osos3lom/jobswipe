'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw, Sparkles, X, Check } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useStore } from '@/lib/store'
import { jobs } from '@/lib/data'
import { rankJobs } from '@/lib/matching'
import { BottomNav } from '@/components/bottom-nav'
import { DemoMenu } from '@/components/demo-menu'
import { LanguageToggle } from '@/components/language-toggle'
import { Logo } from '@/components/logo'
import { SwipeDeck, type SwipeDeckHandle } from '@/components/swipe-deck'
import { Button } from '@/components/ui/button'

export default function DiscoverPage() {
  const { t } = useI18n()
  const router = useRouter()
  const {
    profile,
    onboarded,
    hydrated,
    swipes,
    saved,
    recordSwipe,
    undoSwipe,
    resetSwipes,
    toggleSaveJob,
  } = useStore()
  const deckRef = useRef<SwipeDeckHandle>(null)

  useEffect(() => {
    if (hydrated && !onboarded) router.replace('/onboarding')
  }, [hydrated, onboarded, router])

  const swipedIds = useMemo(() => new Set(swipes.map((s) => s.jobId)), [swipes])
  const savedIds = useMemo(() => new Set(saved), [saved])

  const cards = useMemo(() => {
    const remaining = jobs.filter((j) => !swipedIds.has(j.id))
    return rankJobs(profile, remaining)
  }, [profile, swipedIds])

  const empty = cards.length === 0

  return (
    <div className="lock-viewport mx-auto flex w-full max-w-md flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-3">
        <Logo />
        <div className="flex items-center gap-2">
          <DemoMenu />
          <LanguageToggle />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col px-4 pb-28">
        {/* deck */}
        <div className="relative min-h-0 flex-1 py-2">
          {empty ? (
            <EmptyState onReset={resetSwipes} />
          ) : (
            <SwipeDeck
              ref={deckRef}
              cards={cards}
              onSwipe={(jobId, dir) => recordSwipe(jobId, dir)}
              savedIds={savedIds}
              onToggleSave={toggleSaveJob}
            />
          )}
        </div>

        {/* action buttons */}
        {!empty && (
          <div className="flex items-center justify-center gap-5 py-3">
            <ActionButton
              label={t('skip')}
              onClick={() => deckRef.current?.swipe('skip')}
              variant="skip"
            >
              <X className="h-7 w-7" strokeWidth={2.6} />
            </ActionButton>
            <ActionButton
              label={t('undo')}
              onClick={undoSwipe}
              variant="undo"
              disabled={swipes.length === 0}
            >
              <RotateCcw className="h-5 w-5" strokeWidth={2.4} />
            </ActionButton>
            <ActionButton
              label={t('apply')}
              onClick={() => deckRef.current?.swipe('apply')}
              variant="apply"
            >
              <Check className="h-7 w-7" strokeWidth={2.6} />
            </ActionButton>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

function ActionButton({
  children,
  label,
  onClick,
  variant,
  disabled,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  variant: 'skip' | 'undo' | 'apply'
  disabled?: boolean
}) {
  const styles = {
    skip: 'h-16 w-16 bg-card text-destructive border border-destructive/20 shadow-lg',
    undo: 'h-12 w-12 bg-card text-accent border border-border shadow',
    apply: 'h-16 w-16 bg-primary text-primary-foreground shadow-lg shadow-primary/30',
  }[variant]
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className={
        'flex items-center justify-center rounded-full transition-transform active:scale-90 disabled:opacity-40 ' +
        styles
      }
    >
      {children}
    </button>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const { t } = useI18n()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <Sparkles className="h-9 w-9" />
      </span>
      <div>
        <h2 className="text-xl font-bold">{t('noMoreJobs')}</h2>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">
          {t('noMoreJobsHint')}
        </p>
      </div>
      <Button onClick={onReset} variant="outline" className="rounded-2xl">
        <RotateCcw className="h-4 w-4" />
        {t('reset')}
      </Button>
    </div>
  )
}
