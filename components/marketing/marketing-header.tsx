'use client'

import Link from 'next/link'
import {
  Briefcase,
  CreditCard,
  LayoutDashboard,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function MarketingHeader() {
  const { t, lang, setLang } = useI18n()

  const navItems = [
    { href: '#overview', icon: Sparkles, label: t('navFeatures') },
    { href: '#systems', icon: ShieldCheck, label: t('navCompliance') },
    { href: '#showcase', icon: LayoutGrid, label: t('appleShowcaseBadge') },
    { href: '#pricing', icon: CreditCard, label: t('navPricing') },
  ]

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-hidden px-2 sm:px-4 pt-2.5 sm:pt-4 transition-all pointer-events-none flex justify-center">
      <div className="flex h-11 sm:h-13 max-w-[calc(100vw-1rem)] items-center gap-0.5 sm:gap-2.5 rounded-full border border-border/70 bg-background/80 px-1.5 sm:px-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-2xl dark:border-white/10 dark:bg-black/75 pointer-events-auto transition-all">
        {/* Brand Logo mark */}
        <Link
          href="/"
          className="flex items-center rounded-full p-1 transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
          aria-label="iHR Platform"
        >
          <Logo product="platform" withName={false} className="scale-[0.78] sm:scale-95" />
        </Link>

        {/* Divider */}
        <div className="h-4 w-px bg-border/60 shrink-0" aria-hidden="true" />

        {/* Iconic Section Navigation with Apple Tooltips */}
        <nav className="flex items-center gap-0.5 sm:gap-1 shrink-0" aria-label="Main Navigation">
          {navItems.map(({ href, icon: Icon, label }, idx) => (
            <a
              key={href}
              href={href}
              title={label}
              aria-label={label}
              className={cn(
                'group relative flex h-7.5 w-7.5 sm:h-9 sm:w-9 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-muted/70 hover:text-foreground active:scale-90',
                idx === 1 && 'hidden min-[375px]:flex', // Hide systems anchor on extremely small screens
                idx === 3 && 'hidden min-[340px]:flex', // Hide pricing anchor on tiny screens
              )}
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:scale-110" />
              {/* Apple floating micro-tooltip on hover */}
              <span className="pointer-events-none absolute -bottom-8 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-popover px-2 py-0.5 text-[10px] font-semibold text-popover-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 z-50">
                {label}
              </span>
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-4 w-px bg-border/60" aria-hidden="true" />

        {/* Utility Controls: Theme & 1-Click Language Switch */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <ThemeToggle
            compact
            className="h-7.5 w-7.5 sm:h-9 sm:w-9 border-0 bg-transparent hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-all active:scale-90"
          />

          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            aria-label="Switch language"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            className="group relative flex h-7.5 w-7.5 sm:h-9 sm:w-9 items-center justify-center rounded-full text-[11px] font-bold text-muted-foreground transition-all hover:bg-muted/70 hover:text-foreground active:scale-90"
          >
            <span>{lang === 'ar' ? 'EN' : 'ع'}</span>
            <span className="pointer-events-none absolute -bottom-8 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-popover px-2 py-0.5 text-[10px] font-semibold text-popover-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 z-50">
              {lang === 'ar' ? 'English' : 'العربية'}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-border/60 shrink-0" aria-hidden="true" />

        {/* Actions: Candidate App (Icon) + Console Launch */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <Link
            href="/jobs"
            title={t('seeJobApp')}
            aria-label={t('seeJobApp')}
            className="group relative flex h-7.5 w-7.5 sm:h-9 sm:w-9 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-muted/70 hover:text-foreground active:scale-90"
          >
            <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:scale-110" />
            <span className="pointer-events-none absolute -bottom-8 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-popover px-2 py-0.5 text-[10px] font-semibold text-popover-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 z-50">
              {t('seeJobApp')}
            </span>
          </Link>

          <Link
            href="/console"
            title={t('appleHeroCtaPrimary')}
            aria-label={t('appleHeroCtaPrimary')}
            className="flex items-center justify-center gap-1.5 rounded-full bg-primary h-7.5 sm:h-9 px-2.5 sm:px-3.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-95 hover:scale-[1.03] active:scale-95 shrink-0"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('appleHeroCtaPrimary')}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

