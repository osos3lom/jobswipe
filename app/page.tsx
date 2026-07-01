'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Globe, Sparkles, Target } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useStore } from '@/lib/store'
import { Logo } from '@/components/logo'
import { LanguageToggle } from '@/components/language-toggle'
import { MatchRing } from '@/components/match-ring'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { onboarded, hydrated } = useStore()

  useEffect(() => {
    if (hydrated && onboarded) router.replace('/discover')
  }, [hydrated, onboarded, router])

  // Avoid flashing the hero to returning users before the redirect fires.
  if (!hydrated || onboarded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <Logo />
      </div>
    )
  }

  const features = [
    { icon: Sparkles, label: t('landingFeature1') },
    { icon: Target, label: t('landingFeature2') },
    { icon: Globe, label: t('landingFeature3') },
  ]

  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
      {/* decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
      />

      <header className="relative flex items-center justify-between px-5 py-4">
        <Logo />
        <LanguageToggle />
      </header>

      <main className="relative flex flex-1 flex-col justify-between px-5 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-4">
        <div>
          {/* mock swipe card */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            className="mx-auto mt-2 w-64"
          >
            <div className="rounded-[28px] border border-border bg-card p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-3 w-24 rounded-full bg-foreground/80" />
                  <div className="mt-2 flex items-center gap-1">
                    <div className="h-2.5 w-16 rounded-full bg-muted-foreground/40" />
                    <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                  </div>
                </div>
                <MatchRing score={92} size={52} />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['React', 'TypeScript', 'UI'].map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  ✕
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ♥
                </span>
              </div>
            </div>
          </motion.div>

          {/* headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-8 text-center"
          >
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-balance">
              {t('heroTitle')}
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground text-pretty">
              {t('heroSubtitle')}
            </p>
          </motion.div>

          {/* features */}
          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mx-auto mt-6 flex max-w-xs flex-col gap-2"
          >
            {features.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="glass flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="mt-8 space-y-2"
        >
          <Button
            render={<Link href="/onboarding" />}
            nativeButton={false}
            className="h-12 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/25"
          >
            {t('getStarted')}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Button>
          <Button
            render={<Link href="/discover" />}
            nativeButton={false}
            variant="ghost"
            className="h-11 w-full rounded-2xl text-sm font-medium text-muted-foreground"
          >
            {t('alreadyHaveProfile')}
          </Button>
        </motion.div>
      </main>
    </div>
  )
}
