'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CONSOLE_NAV } from './console-nav'
import { DemoDisclaimer } from '@/components/demo-disclaimer'
import { Logo } from '@/components/logo'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function ConsoleSidebar({
  className,
  onNavigate,
}: {
  className?: string
  /** Called after a nav link is followed, so the mobile drawer can close. */
  onNavigate?: () => void
}) {
  const { t } = useI18n()
  const pathname = usePathname()

  const sections = [
    { key: 'workspace', labelKey: 'navSectionWorkspace', items: CONSOLE_NAV.filter((n) => n.section === 'workspace') },
    { key: 'people', labelKey: 'navSectionPeople', items: CONSOLE_NAV.filter((n) => n.section === 'people') },
    { key: 'finance', labelKey: 'navSectionFinance', items: CONSOLE_NAV.filter((n) => n.section === 'finance') },
  ]

  return (
    <aside
      className={cn(
        'flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-e border-sidebar-border/30 backdrop-blur-xl',
        className,
      )}
    >
      <div className="px-5 py-5 flex items-center justify-between">
        <Link href="/console" onClick={onNavigate} className="inline-flex transition-transform active:scale-95">
          <Logo product="platform" inverse />
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/90">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span>{t('companyStatusLive')}</span>
        </span>
      </div>

      <nav aria-label={t('console')} className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
        {sections.map((sec) => (
          <div key={sec.key}>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 mb-1">
              {t(sec.labelKey)}
            </p>
            <ul className="space-y-0.5">
              {sec.items.map(({ key, href, icon: Icon }) => {
                const active =
                  href !== undefined &&
                  (pathname === href || (href !== '/console' && pathname.startsWith(href)))
                const inner = (
                  <>
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-[13px]">{t(key)}</span>
                    {href === undefined && (
                      <span className="rounded-full bg-sidebar-accent px-1.5 py-0.5 text-[10px] font-medium">
                        {t('comingSoon')}
                      </span>
                    )}
                  </>
                )
                return (
                  <li key={key}>
                    {href ? (
                      <Link
                        href={href}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        data-tour={
                          key === 'navHiring'
                            ? 'hiring-nav'
                            : key === 'navCompliance'
                            ? 'compliance-nav'
                            : undefined
                        }
                        className={cn(
                          'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all',
                          active
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm'
                            : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                        )}
                      >
                        {inner}
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="flex cursor-default items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground/40"
                      >
                        {inner}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-2.5 border-t border-sidebar-border/50 p-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-sidebar-foreground/75 transition-colors hover:text-sidebar-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:-scale-x-100" />
          {t('backToHub')}
        </Link>
        <DemoDisclaimer
          withIcon={false}
          className="text-[11px] text-sidebar-foreground/50"
        />
      </div>
    </aside>
  )
}
