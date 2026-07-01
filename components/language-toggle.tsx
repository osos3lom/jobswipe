'use client'

import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useI18n()
  return (
    <div
      className={cn(
        'glass inline-flex items-center rounded-full p-0.5 text-xs font-medium',
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={cn(
          'rounded-full px-3 py-1 transition-colors',
          lang === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground',
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('ar')}
        aria-pressed={lang === 'ar'}
        className={cn(
          'rounded-full px-3 py-1 transition-colors',
          lang === 'ar'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground',
        )}
      >
        ع
      </button>
    </div>
  )
}
