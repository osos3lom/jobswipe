'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'

export interface TourStep {
  id: string
  targetSelector: string
  titleKey: string
  bodyKey: string
  preferredSide?: 'top' | 'bottom' | 'left' | 'right'
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'step-dashboard',
    targetSelector: '[data-tour="dashboard-overview"]',
    titleKey: 'tourStep1Title',
    bodyKey: 'tourStep1Body',
    preferredSide: 'bottom',
  },
  {
    id: 'step-payroll',
    targetSelector: '[data-tour="payroll-cta"]',
    titleKey: 'tourStep2Title',
    bodyKey: 'tourStep2Body',
    preferredSide: 'bottom',
  },
  {
    id: 'step-hiring',
    targetSelector: '[data-tour="hiring-nav"]',
    titleKey: 'tourStep3Title',
    bodyKey: 'tourStep3Body',
    preferredSide: 'right',
  },
  {
    id: 'step-compliance',
    targetSelector: '[data-tour="compliance-nav"]',
    titleKey: 'tourStep4Title',
    bodyKey: 'tourStep4Body',
    preferredSide: 'right',
  },
  {
    id: 'step-roles',
    targetSelector: '[data-tour="role-switch"]',
    titleKey: 'tourStep5Title',
    bodyKey: 'tourStep5Body',
    preferredSide: 'bottom',
  },
]

const STORAGE_KEY_TOUR_STATUS = 'ihr.tour.status.v1'

interface TourContextValue {
  isActive: boolean
  currentStepIndex: number
  totalSteps: number
  currentStep: TourStep | null
  showPrompt: boolean
  startTour: () => void
  skipTour: () => void
  nextStep: () => void
  prevStep: () => void
  restartTour: () => void
  dismissPrompt: () => void
}

const TourContext = createContext<TourContextValue | null>(null)

export function TourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const [isActive, setIsActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showPrompt, setShowPrompt] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    try {
      const status = window.localStorage.getItem(STORAGE_KEY_TOUR_STATUS)
      // If user has never seen or dismissed the tour and lands on console, show the prompt
      if (!status && pathname.startsWith('/console')) {
        setShowPrompt(true)
      }
    } catch {
      // ignore
    }
  }, [pathname])

  const startTour = useCallback(() => {
    setShowPrompt(false)
    setIsActive(true)
    setCurrentStepIndex(0)
    try {
      window.localStorage.setItem(STORAGE_KEY_TOUR_STATUS, 'in_progress')
    } catch {
      // ignore
    }
    if (!pathname.startsWith('/console')) {
      router.push('/console')
    }
  }, [pathname, router])

  const skipTour = useCallback(() => {
    setIsActive(false)
    setShowPrompt(false)
    try {
      window.localStorage.setItem(STORAGE_KEY_TOUR_STATUS, 'dismissed')
    } catch {
      // ignore
    }
  }, [])

  const restartTour = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY_TOUR_STATUS)
    } catch {
      // ignore
    }
    startTour()
  }, [startTour])

  const nextStep = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      setIsActive(false)
      try {
        window.localStorage.setItem(STORAGE_KEY_TOUR_STATUS, 'completed')
      } catch {
        // ignore
      }
    }
  }, [currentStepIndex])

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }, [currentStepIndex])

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false)
    try {
      window.localStorage.setItem(STORAGE_KEY_TOUR_STATUS, 'dismissed')
    } catch {
      // ignore
    }
  }, [])

  // Keyboard navigation: Escape key skips tour
  useEffect(() => {
    if (!isActive) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipTour()
      } else if (e.key === 'ArrowRight') {
        // Note: nextStep or prevStep depending on dir
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, skipTour])

  const currentStep = useMemo(() => {
    if (!isActive || currentStepIndex < 0 || currentStepIndex >= TOUR_STEPS.length) {
      return null
    }
    return TOUR_STEPS[currentStepIndex]
  }, [isActive, currentStepIndex])

  const value = useMemo(
    () => ({
      isActive,
      currentStepIndex,
      totalSteps: TOUR_STEPS.length,
      currentStep,
      showPrompt,
      startTour,
      skipTour,
      nextStep,
      prevStep,
      restartTour,
      dismissPrompt,
    }),
    [
      isActive,
      currentStepIndex,
      currentStep,
      showPrompt,
      startTour,
      skipTour,
      nextStep,
      prevStep,
      restartTour,
      dismissPrompt,
    ],
  )

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>
}

export function useTour() {
  const ctx = useContext(TourContext)
  if (!ctx) throw new Error('useTour must be used within TourProvider')
  return ctx
}
