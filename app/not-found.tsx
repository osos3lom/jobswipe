'use client'

import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const { t } = useI18n()

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 p-6 text-center bg-background">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <Compass className="h-10 w-10 animate-pulse" />
      </span>
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">404</h1>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">
          {t('pageNotFound')}
        </p>
      </div>
      <Button
        render={<Link href="/" />}
        nativeButton={false}
        className="rounded-2xl"
      >
        <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
        {t('back')}
      </Button>
    </div>
  )
}
