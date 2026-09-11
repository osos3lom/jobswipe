'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function ThemeToggle({
  className,
  compact = false,
}: {
  className?: string
  /** Single icon button, for tight headers like the console topbar. */
  compact?: boolean
}) {
  const { theme, setTheme, toggle } = useTheme()
  const { t } = useI18n()

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={t(theme === 'dark' ? 'lightMode' : 'darkMode')}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
          className,
        )}
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>
    )
  }

  return (
    <div
      className={cn(
        'glass inline-flex items-center rounded-full p-0.5 text-xs font-medium',
        className,
      )}
      role="group"
      aria-label={t('theme')}
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
        className={cn(
          'flex items-center gap-1 rounded-full px-3 py-1 transition-colors',
          theme === 'light'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground',
        )}
      >
        <Sun className="h-3.5 w-3.5" />
        {t('lightMode')}
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        className={cn(
          'flex items-center gap-1 rounded-full px-3 py-1 transition-colors',
          theme === 'dark'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground',
        )}
      >
        <Moon className="h-3.5 w-3.5" />
        {t('darkMode')}
      </button>
    </div>
  )
}
