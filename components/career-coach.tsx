'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import {
  aspirationalSkillsFrom,
  buildSmartGoal,
  coachQuestions,
  type CoachAnswers,
} from '@/lib/career-coach'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Bubble {
  from: 'coach' | 'me'
  text: string
}

export function CareerCoach({
  onComplete,
}: {
  onComplete: (goal: string, skills: string[]) => void
}) {
  const { t, tx, lang } = useI18n()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<CoachAnswers>({})
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [freeText, setFreeText] = useState('')
  const [done, setDone] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const current = coachQuestions[step]

  // Seed the first coach question.
  useEffect(() => {
    setBubbles([{ from: 'coach', text: tx(coachQuestions[0].prompt) }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [bubbles, done])

  function answer(value: string, label: string) {
    const q = coachQuestions[step]
    const nextAnswers = { ...answers, [q.id]: value }
    setAnswers(nextAnswers)
    const next = step + 1
    setBubbles((b) => [...b, { from: 'me', text: label }])

    setTimeout(() => {
      if (next < coachQuestions.length) {
        setBubbles((b) => [...b, { from: 'coach', text: tx(coachQuestions[next].prompt) }])
        setStep(next)
      } else {
        const goal = buildSmartGoal(nextAnswers, lang)
        setBubbles((b) => [
          ...b,
          {
            from: 'coach',
            text: lang === 'ar' ? 'رائع! إليك هدفك المهني الذكي:' : "Perfect! Here's your SMART career goal:",
          },
        ])
        setDone(true)
        // propagate goal + skills upward
        onComplete(goal, aspirationalSkillsFrom(nextAnswers))
      }
    }, 350)
  }

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-1 py-2"
      >
        <AnimatePresence initial={false}>
          {bubbles.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                'flex items-end gap-2',
                b.from === 'me' ? 'justify-end' : 'justify-start',
              )}
            >
              {b.from === 'coach' && (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
              )}
              <div
                className={cn(
                  'max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                  b.from === 'me'
                    ? 'rounded-br-md bg-primary text-primary-foreground'
                    : 'rounded-bl-md bg-secondary text-secondary-foreground',
                )}
              >
                {b.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* answer controls */}
      {!done && current && (
        <div className="mt-2 space-y-2">
          <div className="flex flex-wrap gap-2">
            {current.options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => answer(o.value, tx(o.label))}
                className="rounded-full border border-primary/30 bg-primary/5 px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/10 active:scale-95"
              >
                {tx(o.label)}
              </button>
            ))}
          </div>
          {current.allowFreeText && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const v = freeText.trim()
                if (!v) return
                answer(v, v)
                setFreeText('')
              }}
              className="flex items-end gap-2"
            >
              <Textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder={t('typeYourAnswer')}
                rows={1}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing &&
                    e.keyCode !== 229
                  ) {
                    e.preventDefault()
                    const v = freeText.trim()
                    if (!v) return
                    answer(v, v)
                    setFreeText('')
                  }
                }}
                className="min-h-10 resize-none rounded-2xl"
              />
              <button
                type="submit"
                aria-label={t('send')}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
                disabled={!freeText.trim()}
              >
                <Send className="h-4 w-4 rtl:-scale-x-100" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
