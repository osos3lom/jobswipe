'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Heart, MessageCircle, CalendarClock, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const items = [
  { href: '/discover', icon: Compass, key: 'discover' },
  { href: '/matches', icon: Heart, key: 'matches' },
  { href: '/chat', icon: MessageCircle, key: 'chat' },
  { href: '/interviews', icon: CalendarClock, key: 'interviews' },
  { href: '/profile', icon: User, key: 'profile' },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useI18n()
  const { appliedJobIds, threads, interviews } = useStore()

  const badges: Record<string, number> = {
    matches: appliedJobIds.length,
    chat: threads.length,
    interviews: interviews.length,
  }

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[max(env(safe-area-inset-bottom),0.75rem)] px-4"
    >
      <div className="glass-strong pointer-events-auto flex w-full max-w-md items-center justify-between rounded-[28px] px-2 py-2 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)]">
        {items.map(({ href, icon: Icon, key }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          const count = badges[key]
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5"
            >
              <span className="relative flex h-9 w-12 items-center justify-center">
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl bg-primary/12"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon
                  className={cn(
                    'relative h-[22px] w-[22px] transition-colors',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                  strokeWidth={active ? 2.4 : 1.9}
                />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                    {count}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  'text-[10px] font-medium leading-none transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {t(key)}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
