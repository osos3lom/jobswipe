'use client'

import { Info } from 'lucide-react'
import { fill, useI18n } from '@/lib/i18n'
import { DEMO_AUTHOR } from '@/lib/demo-config'
import { cn } from '@/lib/utils'

export function DemoDisclaimer({
  className,
  withIcon = true,
}: {
  className?: string
  withIcon?: boolean
}) {
  const { t, tx } = useI18n()
  return (
    <p className={cn('flex items-start gap-1.5 text-xs leading-relaxed', className)}>
      {withIcon && <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      <span>{fill(t('disclaimer'), { author: tx(DEMO_AUTHOR) })}</span>
    </p>
  )
}
