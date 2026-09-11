'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function MarketingHeader() {
  const { t } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '#features', label: t('navFeatures') },
    { href: '#compliance', label: t('navCompliance') },
    { href: '#pricing', label: t('navPricing') },
    { href: '#case-study', label: t('navCaseStudy') },
    { href: '#demo', label: t('navDemoHub') },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Logo product="platform" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main Navigation">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right Controls & CTAs */}
        <div className="hidden items-center gap-2.5 sm:flex">
          <ThemeToggle />
          <LanguageToggle />
          <Link
            href="/jobs"
            className="hidden rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:bg-muted lg:inline-flex"
          >
            {t('seeJobApp')}
          </Link>
          <Link
            href="/console"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {t('exploreConsole')}
            <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl border border-border p-2 text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-border bg-background px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-1 text-sm font-semibold text-foreground/80 hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-border">
              <Link
                href="/console"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm"
              >
                {t('exploreConsole')}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
              <Link
                href="/jobs"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground"
              >
                {t('seeJobApp')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
