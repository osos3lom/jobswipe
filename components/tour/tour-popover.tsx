'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Sparkles,
  X,
} from 'lucide-react'
import { useTour } from './tour-provider'
import { fill, useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function TourPopover() {
  const { t, lang, dir } = useI18n()
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    showPrompt,
    startTour,
    skipTour,
    nextStep,
    prevStep,
    dismissPrompt,
  } = useTour()

  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Track target element coordinates
  useEffect(() => {
    if (!isActive || !currentStep) {
      setCoords(null)
      return
    }

    const updatePosition = () => {
      const el = document.querySelector(currentStep.targetSelector)
      if (el) {
        const rect = el.getBoundingClientRect()
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        })
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      } else {
        // Fallback to center if element not in DOM
        setCoords({
          top: window.scrollY + 120,
          left: window.innerWidth / 2 - 160,
          width: 320,
          height: 100,
        })
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)
    const timer = setTimeout(updatePosition, 100)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
      clearTimeout(timer)
    }
  }, [isActive, currentStep])

  // Initial Welcome / Take-the-Tour prompt banner
  if (showPrompt && !isActive) {
    return (
      <div className="fixed bottom-6 end-6 z-50 max-w-sm rounded-2xl border border-primary/30 bg-card p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t('tourStartTitle')}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {t('tourStartDesc')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismissPrompt}
            aria-label={t('skipTour')}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3.5 flex items-center justify-end gap-2 border-t border-border pt-2.5">
          <button
            type="button"
            onClick={dismissPrompt}
            className="rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            {t('skipTour')}
          </button>
          <button
            type="button"
            onClick={startTour}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('takeTour')}</span>
          </button>
        </div>
      </div>
    )
  }

  if (!isActive || !currentStep) return null

  const isLast = currentStepIndex === totalSteps - 1
  const isFirst = currentStepIndex === 0

  return (
    <>
      {/* Target Highlighting Glow Ring */}
      {coords && (
        <div
          className="pointer-events-none fixed z-40 rounded-xl transition-all duration-300 ring-4 ring-primary/40 ring-offset-2 ring-offset-background"
          style={{
            top: `${coords.top - window.scrollY}px`,
            left: `${coords.left - window.scrollX}px`,
            width: `${coords.width}px`,
            height: `${coords.height}px`,
          }}
        />
      )}

      {/* Floating Guided Tour Bubble */}
      <div
        ref={popoverRef}
        className="fixed bottom-8 start-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md rounded-2xl border border-primary/30 bg-card p-5 shadow-2xl text-foreground animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {currentStepIndex + 1}
            </span>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {fill(t('tourProgress'), { current: currentStepIndex + 1, total: totalSteps })}
            </span>
          </div>

          <button
            type="button"
            onClick={skipTour}
            aria-label={t('skipTour')}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title={t('skipTour')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="py-3 space-y-1">
          <h4 className="text-base font-bold text-foreground">
            {t(currentStep.titleKey)}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t(currentStep.bodyKey)}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <button
            type="button"
            onClick={skipTour}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition"
          >
            {t('skipTour')}
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                {dir === 'rtl' ? <ArrowRight className="h-3 w-3" /> : <ArrowLeft className="h-3 w-3" />}
                <span>{t('prevStep')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
            >
              <span>{isLast ? t('finishTour') : t('nextStep')}</span>
              {dir === 'rtl' ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
