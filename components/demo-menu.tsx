'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu } from '@base-ui/react/menu'
import { Briefcase, ChevronDown, RotateCcw, User, Wallet } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useStore } from '@/lib/store'
import { useHrReset } from '@/lib/hr/store'
import { cn } from '@/lib/utils'

// Lets a reviewer jump between the two sides of the demo and start over.
// The current role is read from the URL so it can never drift from the page
// actually on screen.
export function DemoMenu({ className }: { className?: string }) {
  const { t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const resetHr = useHrReset()
  const { resetAll } = useStore()
  const [confirmation, setConfirmation] = useState(false)

  const role = pathname.startsWith('/console') ? 'admin' : 'candidate'

  useEffect(() => {
    if (!confirmation) return
    const id = window.setTimeout(() => setConfirmation(false), 2500)
    return () => window.clearTimeout(id)
  }, [confirmation])

  const resetEverything = useCallback(() => {
    resetAll()
    resetHr()
    setConfirmation(true)
    router.push('/')
  }, [resetAll, resetHr, router])

  const itemClass =
    'flex cursor-default select-none items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm outline-none data-[highlighted]:bg-muted data-[disabled]:opacity-50'

  return (
    <>
      <Menu.Root>
        <Menu.Trigger
          className={cn(
            'inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            className,
          )}
        >
          {t('demoMenu')}
          <ChevronDown className="h-3.5 w-3.5" />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner className="z-50" sideOffset={8} align="end">
            <Menu.Popup className="min-w-60 rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl outline-none">
              <Menu.GroupLabel className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t('switchRole')}
              </Menu.GroupLabel>
              <Menu.Item
                className={itemClass}
                onClick={() => router.push('/console')}
              >
                <Briefcase className="h-4 w-4 text-primary" />
                <span className="flex-1">{t('roleAdmin')}</span>
                {role === 'admin' && (
                  <span className="text-[10px] font-semibold text-primary">●</span>
                )}
              </Menu.Item>
              <Menu.Item className={itemClass} onClick={() => router.push('/jobs')}>
                <User className="h-4 w-4 text-primary" />
                <span className="flex-1">{t('roleCandidate')}</span>
                {role === 'candidate' && (
                  <span className="text-[10px] font-semibold text-primary">●</span>
                )}
              </Menu.Item>
              <Menu.Item className={itemClass} disabled>
                <Wallet className="h-4 w-4" />
                <span className="flex-1">{t('roleEmployee')}</span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold">
                  {t('comingSoon')}
                </span>
              </Menu.Item>
              <Menu.Separator className="my-1.5 h-px bg-border" />
              <Menu.Item
                className={cn(itemClass, 'text-destructive')}
                onClick={resetEverything}
              >
                <RotateCcw className="h-4 w-4" />
                {t('resetDemo')}
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <div aria-live="polite" className="sr-only">
        {confirmation ? t('resetDemoDone') : ''}
      </div>
      {confirmation && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <span className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-lg">
            {t('resetDemoDone')}
          </span>
        </div>
      )}
    </>
  )
}
