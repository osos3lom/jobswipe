'use client'

import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import { Check, X } from 'lucide-react'
import type { ScoredJob, SwipeDirection } from '@/lib/types'
import { useI18n } from '@/lib/i18n'
import { JobCard } from './job-card'

export interface SwipeDeckHandle {
  swipe: (dir: SwipeDirection) => void
}

interface Props {
  cards: ScoredJob[]
  onSwipe: (jobId: string, dir: SwipeDirection) => void
  savedIds?: Set<string>
  onToggleSave?: (jobId: string) => void
}

const SWIPE_THRESHOLD = 110

export const SwipeDeck = forwardRef<SwipeDeckHandle, Props>(function SwipeDeck(
  { cards, onSwipe, savedIds, onToggleSave },
  ref,
) {
  // The top card is always cards[0]. We render up to 3 for depth.
  const visible = cards.slice(0, 3)
  const top = visible[0]

  const [programmatic, setProgrammatic] = useState<SwipeDirection | null>(null)

  useImperativeHandle(ref, () => ({
    swipe: (dir) => setProgrammatic(dir),
  }))

  return (
    <div className="relative h-full w-full">
      {visible
        .map((scored, i) => {
          const isTop = i === 0
          return (
            <CardLayer
              key={scored.job.id}
              scored={scored}
              depth={i}
              isTop={isTop}
              fly={isTop ? programmatic : null}
              saved={savedIds?.has(scored.job.id)}
              onToggleSave={
                onToggleSave ? () => onToggleSave(scored.job.id) : undefined
              }
              onResolved={(dir) => {
                setProgrammatic(null)
                onSwipe(scored.job.id, dir)
              }}
            />
          )
        })
        // paint the top card last so it sits above the stack
        .reverse()}
      {/* keep a reference to `top` for a11y live region */}
      <span className="sr-only" aria-live="polite">
        {top ? '' : ''}
      </span>
    </div>
  )
})

function CardLayer({
  scored,
  depth,
  isTop,
  fly,
  saved,
  onToggleSave,
  onResolved,
}: {
  scored: ScoredJob
  depth: number
  isTop: boolean
  fly: SwipeDirection | null
  saved?: boolean
  onToggleSave?: () => void
  onResolved: (dir: SwipeDirection) => void
}) {
  const { t } = useI18n()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14])
  const applyOpacity = useTransform(x, [40, 150], [0, 1])
  const skipOpacity = useTransform(x, [-150, -40], [1, 0])

  // local exit captures a drag-driven swipe; `fly` captures a button-driven one
  const [exit, setExit] = useState<SwipeDirection | null>(null)
  const leaving = exit ?? fly

  // when a button triggers `fly`, mirror it into local exit state
  useEffect(() => {
    if (fly) setExit(fly)
  }, [fly])

  function handleDragEnd(_e: unknown, info: PanInfo) {
    const power = info.offset.x + info.velocity.x * 0.25
    if (power > SWIPE_THRESHOLD) setExit('apply')
    else if (power < -SWIPE_THRESHOLD) setExit('skip')
    // otherwise framer-motion springs back via dragSnapToOrigin
  }

  // depth styling for cards behind the top one
  const behindScale = 1 - depth * 0.05
  const behindY = depth * 14

  const flyTarget =
    leaving === 'apply'
      ? { x: 700, opacity: 0, rotate: 18 }
      : leaving === 'skip'
        ? { x: -700, opacity: 0, rotate: -18 }
        : undefined

  return (
    <motion.div
      className="absolute inset-0"
      style={isTop ? { x, y, rotate, zIndex: 30 } : { zIndex: 30 - depth }}
      initial={false}
      animate={
        isTop
          ? flyTarget
            ? { ...flyTarget, transition: { duration: 0.3 } }
            : { scale: 1, y: 0 }
          : { scale: behindScale, y: behindY }
      }
      onAnimationComplete={() => {
        if (isTop && leaving) onResolved(leaving)
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      drag={isTop && !leaving}
      dragSnapToOrigin
      dragElastic={0.6}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div className="relative h-full w-full touch-none select-none">
        <JobCard
          scored={scored}
          saved={saved}
          onToggleSave={isTop ? onToggleSave : undefined}
        />

        {isTop && (
          <>
            {/* APPLY overlay */}
            <motion.div
              style={{ opacity: applyOpacity }}
              className="pointer-events-none absolute start-5 top-6 rotate-[-12deg] rtl:rotate-[12deg] rounded-xl border-4 border-success px-4 py-1.5"
            >
              <span className="flex items-center gap-1 text-2xl font-extrabold uppercase text-success">
                <Check className="h-6 w-6" />
                {t('apply')}
              </span>
            </motion.div>
            {/* SKIP overlay */}
            <motion.div
              style={{ opacity: skipOpacity }}
              className="pointer-events-none absolute end-5 top-6 rotate-[12deg] rtl:rotate-[-12deg] rounded-xl border-4 border-destructive px-4 py-1.5"
            >
              <span className="flex items-center gap-1 text-2xl font-extrabold uppercase text-destructive">
                <X className="h-6 w-6" />
                {t('skip')}
              </span>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  )
}
