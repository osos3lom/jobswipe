'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  RefreshCw,
  Video,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useStore } from '@/lib/store'
import { interviewSlots } from '@/lib/data'
import { AppShell } from '@/components/app-shell'
import { CompanyAvatar } from '@/components/company-avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Interview } from '@/lib/types'

const MODE_ICON = { video: Video, onsite: MapPin, phone: Phone } as const

export default function InterviewsPage() {
  const { t, tx, lang } = useI18n()
  const { interviews, confirmInterview, scheduleInterview } = useStore()
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)

  const sorted = useMemo(
    () =>
      [...interviews].sort((a, b) =>
        `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
      ),
    [interviews],
  )

  const groups: { key: 'proposed' | 'confirmed'; items: Interview[] }[] = [
    { key: 'confirmed', items: sorted.filter((i) => i.status === 'confirmed') },
    { key: 'proposed', items: sorted.filter((i) => i.status === 'proposed') },
  ]

  function fmtDate(date: string) {
    return new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <AppShell title={t('interviews')}>
      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 pt-24 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <CalendarClock className="h-9 w-9" />
          </span>
          <div>
            <h2 className="text-lg font-bold">{t('noInterviews')}</h2>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">
              {t('scheduleInterview')} — {t('messageEmployer')}
            </p>
          </div>
          <Button
            render={<Link href="/chat" />}
            nativeButton={false}
            className="rounded-2xl"
          >
            {t('messages')}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(
            ({ key, items }) =>
              items.length > 0 && (
                <section key={key} className="space-y-3">
                  <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t(key)}
                  </h2>
                  <motion.ul
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                    className="space-y-3"
                  >
                    {items.map((iv) => {
                      const ModeIcon = MODE_ICON[iv.mode]
                      const isConfirmed = iv.status === 'confirmed'
                      const open = rescheduleId === iv.id
                      return (
                        <motion.li
                          key={iv.id}
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            show: { opacity: 1, y: 0 },
                          }}
                          className="overflow-hidden rounded-3xl border border-border bg-card"
                        >
                          <div className="flex items-start gap-3 p-4">
                            <CompanyAvatar name={tx(iv.company)} size={48} />
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate font-semibold leading-tight">
                                {tx(iv.jobTitle)}
                              </h3>
                              <p className="truncate text-sm text-muted-foreground">
                                {tx(iv.company)}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/80">
                                <span className="flex items-center gap-1">
                                  <CalendarClock className="h-3.5 w-3.5 text-primary" />
                                  {fmtDate(iv.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5 text-primary" />
                                  {iv.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ModeIcon className="h-3.5 w-3.5 text-primary" />
                                  {t(iv.mode)}
                                </span>
                              </div>
                            </div>
                            <span
                              className={cn(
                                'flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                                isConfirmed
                                  ? 'bg-success/12 text-success'
                                  : 'bg-warning/12 text-warning',
                              )}
                            >
                              {isConfirmed && <CheckCircle2 className="h-3 w-3" />}
                              {t(iv.status)}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 border-t border-border/60 px-4 py-2.5">
                            {!isConfirmed && (
                              <Button
                                size="sm"
                                className="h-9 flex-1 rounded-xl"
                                onClick={() => {
                                  confirmInterview(iv.id)
                                  setRescheduleId(null)
                                }}
                              >
                                <Check className="h-4 w-4" />
                                {t('confirm')}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant={isConfirmed ? 'secondary' : 'outline'}
                              className={cn('h-9 rounded-xl', isConfirmed && 'flex-1')}
                              onClick={() => setRescheduleId(open ? null : iv.id)}
                            >
                              <RefreshCw className="h-4 w-4" />
                              {t('reschedule')}
                            </Button>
                          </div>

                          {/* Reschedule slot picker */}
                          {open && (
                            <div className="border-t border-border/60 bg-secondary/40 px-4 py-3">
                              <p className="mb-2 text-xs font-medium text-muted-foreground">
                                {t('pickSlot')}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {interviewSlots.map((slot) => {
                                  const active =
                                    slot.date === iv.date && slot.time === iv.time
                                  return (
                                    <button
                                      key={`${slot.date}-${slot.time}`}
                                      type="button"
                                      onClick={() => {
                                        scheduleInterview(iv.jobId, slot.date, slot.time)
                                        setRescheduleId(null)
                                      }}
                                      className={cn(
                                        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                                        active
                                          ? 'border-primary bg-primary text-primary-foreground'
                                          : 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20',
                                      )}
                                    >
                                      {new Date(slot.date).toLocaleDateString(
                                        lang === 'ar' ? 'ar-SA' : 'en-GB',
                                        { weekday: 'short', day: 'numeric', month: 'short' },
                                      )}{' '}
                                      · {slot.time}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </motion.li>
                      )
                    })}
                  </motion.ul>
                </section>
              ),
          )}
        </div>
      )}
    </AppShell>
  )
}
