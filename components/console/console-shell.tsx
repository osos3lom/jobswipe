'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu as MenuIcon } from 'lucide-react'
import { ConsoleSidebar } from './console-sidebar'
import { DemoMenu } from '@/components/demo-menu'
import { LanguageToggle } from '@/components/language-toggle'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
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
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-background/85 px-4 py-2.5 backdrop-blur lg:px-8">
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
          <div className="flex-1" />
          <DemoMenu />
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
  )
}
