'use client'

import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'

// Deterministic accent per company name so logos feel distinct without images.
const palette = [
  'bg-primary/12 text-primary',
  'bg-accent/20 text-accent-foreground',
  'bg-success/15 text-success',
  'bg-chart-4/15 text-chart-4',
  'bg-chart-5/15 text-chart-5',
]

export function CompanyAvatar({
  name,
  size = 48,
  className,
}: {
  name: string
  size?: number
  className?: string
}) {
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-2xl font-bold',
        palette[idx],
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
