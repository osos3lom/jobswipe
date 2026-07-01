'use client'

import { Compass } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function Logo({
  withName = true,
  className,
}: {
  withName?: boolean
  className?: string
}) {
  const { t } = useI18n()
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Compass className="h-5 w-5" strokeWidth={2.2} />
      </span>
      {withName && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          {t('appName')}
        </span>
      )}
    </div>
  )
}
