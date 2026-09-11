'use client'

import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

// A typographic mark, deliberately not a copy of the iHR logo: this is a
// concept demo, not iHR's own site.
export function Logo({
  product = 'jobs',
  withName = true,
  inverse = false,
  className,
}: {
  product?: 'jobs' | 'platform'
  withName?: boolean
  inverse?: boolean
  className?: string
}) {
  const { t } = useI18n()
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-xl text-[13px] font-extrabold tracking-tight',
          inverse ? 'bg-white text-brand' : 'bg-primary text-primary-foreground',
        )}
        aria-hidden="true"
      >
        iHR
      </span>
      {withName && (
        <span
          className={cn(
            'text-lg font-bold tracking-tight',
            inverse ? 'text-white' : 'text-foreground',
          )}
        >
          {t(product === 'platform' ? 'productPlatform' : 'productJobs')}
        </span>
      )}
      <span className="sr-only">
        {t(product === 'platform' ? 'platformName' : 'appName')}
      </span>
    </div>
  )
}
