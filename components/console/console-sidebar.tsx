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

  return (
    <aside
      className={cn(
        'flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground',
        className,
      )}
    >
      <div className="px-4 py-4">
        <Link href="/console" onClick={onNavigate} className="inline-flex">
          <Logo product="platform" inverse />
        </Link>
      </div>

      <nav aria-label={t('console')} className="flex-1 overflow-y-auto px-2 pb-2">
        <ul className="space-y-0.5">
          {CONSOLE_NAV.map(({ key, href, icon: Icon }) => {
            const active =
              href !== undefined &&
              (pathname === href || (href !== '/console' && pathname.startsWith(href)))
            const inner = (
              <>
                <Icon className="h-[18px] w-[18px]" />
                <span className="flex-1">{t(key)}</span>
                {href === undefined && (
                  <span className="rounded-full bg-sidebar-accent px-1.5 py-0.5 text-[10px] font-semibold">
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
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                    )}
                  >
                    {inner}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground/45"
                  >
                    {inner}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="space-y-2.5 border-t border-sidebar-border p-4">
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
          className="text-[11px] text-sidebar-foreground/55"
        />
      </div>
    </aside>
  )
}
