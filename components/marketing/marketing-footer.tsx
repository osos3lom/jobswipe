'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { DemoDisclaimer } from '@/components/demo-disclaimer'
import { useI18n, fill } from '@/lib/i18n'
import { DEMO_AUTHOR } from '@/lib/demo-config'

export function MarketingFooter() {
  const { t, tx } = useI18n()

  return (
    <footer className="border-t border-white/10 bg-brand-deep text-white/80 transition-colors">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-4 sm:col-span-2">
            <Logo product="platform" inverse />
            <p className="max-w-md text-sm leading-relaxed text-white/75">
              {t('footerAboutText')}
            </p>
            <div className="pt-2">
              <DemoDisclaimer className="max-w-md rounded-2xl bg-white/10 p-3 text-white/90" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
              {t('footerQuickLinks')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/console" className="transition-colors hover:text-white">
                  {t('exploreConsole')}
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="transition-colors hover:text-white">
                  {t('seeJobApp')}
                </Link>
              </li>
              <li>
                <a href="#features" className="transition-colors hover:text-white">
                  {t('navFeatures')}
                </a>
              </li>
              <li>
                <a href="#compliance" className="transition-colors hover:text-white">
                  {t('navCompliance')}
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition-colors hover:text-white">
                  {t('navPricing')}
                </a>
              </li>
              <li>
                <a href="#demo" className="transition-colors hover:text-white">
                  {t('navDemoHub')}
                </a>
              </li>
            </ul>
          </div>

          {/* Modules Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
              {t('footerModules')}
            </h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li>
                <Link href="/console" className="transition-colors hover:text-white">
                  {t('modPayrollTitle')}
                </Link>
              </li>
              <li>
                <Link href="/console" className="transition-colors hover:text-white">
                  {t('modPeopleTitle')}
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="transition-colors hover:text-white">
                  {t('modHiringTitle')}
                </Link>
              </li>
              <li>
                <span className="text-white/50">{t('modTimeOffTitle')}</span>
              </li>
              <li>
                <Link href="/console" className="transition-colors hover:text-white">
                  {t('modComplianceTitle')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row">
          <p>{fill(t('footerAllRights'), { author: tx(DEMO_AUTHOR) })}</p>
          <p className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Wadi Al-Noor Trading Co. (25 Active Employees)</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
