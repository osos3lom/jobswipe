'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu as MenuIcon, Search } from 'lucide-react'
import { ConsoleSidebar } from './console-sidebar'
import { DemoMenu } from '@/components/demo-menu'
import { LanguageToggle } from '@/components/language-toggle'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { TourProvider } from '@/components/tour/tour-provider'
import { TourPopover } from '@/components/tour/tour-popover'
import { useI18n } from '@/lib/i18n'
import { useHrLoaded } from '@/lib/hr/store'

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const { t, dir } = useI18n()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const loaded = useHrLoaded()

  // The drawer covers the page, so stop the page behind it from scrolling
  // and let Escape close it.
  useEffect(() => {
    if (!drawerOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [drawerOpen])

  const offscreen = dir === 'rtl' ? '100%' : '-100%'

  return (
    <TourProvider>
      <div className="flex min-h-[100dvh] bg-background">
        <ConsoleSidebar className="sticky top-0 hidden h-[100dvh] lg:flex" />

        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              />
              <motion.div
                key="drawer"
                initial={{ x: offscreen }}
                animate={{ x: 0 }}
                exit={{ x: offscreen }}
                transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                className="fixed inset-y-0 start-0 z-50 lg:hidden"
              >
                <ConsoleSidebar
                  className="h-full"
                  onNavigate={() => setDrawerOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-background/80 px-4 py-2.5 backdrop-blur-xl lg:px-8 transition-colors">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={t('openMenu')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            >
              <MenuIcon className="h-4 w-4" />
            </button>
            <div className="lg:hidden">
              <Logo product="platform" withName={false} />
            </div>

            {/* Apple Quick Search Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3.5 py-1.5 text-xs text-muted-foreground transition-all hover:bg-muted/70 max-w-xs w-full">
              <Search className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span className="flex-1 text-[12px]">{t('consoleSearchPlaceholder')}</span>
            </div>

            <div className="flex-1" />
            <div data-tour="role-switch">
              <DemoMenu />
            </div>
            <LanguageToggle />
            <ThemeToggle compact />
          </header>

          <main className="flex-1 px-4 py-5 lg:px-8 lg:py-7">
            {loaded ? (
              children
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">
                {t('loading')}
              </p>
            )}
          </main>
        </div>
      </div>
      <TourPopover />
    </TourProvider>
  )
}
