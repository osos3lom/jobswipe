'use client'

import { use, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarPlus, CheckCircle2, Send } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useStore } from '@/lib/store'
import { CompanyAvatar } from '@/components/company-avatar'
import { Button } from '@/components/ui/button'
import { interviewSlots } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { t, tx, lang, dir } = useI18n()
  const { threads, ensureThread, sendMessage, scheduleInterview } = useStore()
  const [draft, setDraft] = useState('')
  const [showSlots, setShowSlots] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ensureThread(id)
  }, [id, ensureThread])

  const thread = threads.find((th) => th.jobId === id)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread?.messages.length])

  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft

  function submit() {
    const text = draft.trim()
    if (!text) return
    sendMessage(id, text, lang)
    setDraft('')
  }

  if (!thread) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-sm text-muted-foreground">{t('noChats')}</p>
        <Button render={<Link href="/chat" />} nativeButton={false}>
          {t('back')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 px-3 py-2.5">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t('back')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary"
        >
          <BackIcon className="h-5 w-5" />
        </button>
        <CompanyAvatar name={tx(thread.companyName)} size={40} />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold leading-tight">
            {tx(thread.companyName)}
          </h1>
          <p className="truncate text-xs text-primary">{tx(thread.jobTitle)}</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {thread.messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'flex',
              m.from === 'me' ? 'justify-end' : 'justify-start',
            )}
          >
            <div
              className={cn(
                'max-w-[78%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed text-pretty',
                m.from === 'me'
                  ? 'rounded-br-md bg-primary text-primary-foreground'
                  : 'rounded-bl-md bg-card text-card-foreground border border-border',
              )}
            >
              {tx(m.text)}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Slot picker */}
      {showSlots && (
        <div className="border-t border-border/60 bg-card/80 px-4 py-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {t('pickSlot')}
          </p>
          <div className="flex flex-wrap gap-2">
            {interviewSlots.map((slot) => (
              <button
                key={`${slot.date}-${slot.time}`}
                type="button"
                onClick={() => {
                  scheduleInterview(id, slot.date, slot.time)
                  setShowSlots(false)
                  router.push('/interviews')
                }}
                className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                {new Date(slot.date).toLocaleDateString(
                  lang === 'ar' ? 'ar-SA' : 'en-GB',
                  { weekday: 'short', day: 'numeric', month: 'short' },
                )}{' '}
                · {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <div
        className="glass-panel border-t border-border/60 px-3 py-2.5"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.625rem)' }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSlots((s) => !s)}
            aria-label={t('scheduleInterview')}
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors',
              showSlots
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground/80 hover:bg-secondary/70',
            )}
          >
            <CalendarPlus className="h-5 w-5" />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                !e.nativeEvent.isComposing &&
                e.keyCode !== 229
              ) {
                e.preventDefault()
                submit()
              }
            }}
            placeholder={t('typeMessage')}
            className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary/60"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!draft.trim()}
            aria-label={t('send')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
          >
            <Send className="h-4.5 w-4.5 rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  )
}
