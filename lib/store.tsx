'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { defaultProfile, getJob, sampleInterview, seedThread } from './data'
import type {
  ChatMessage,
  ChatThread,
  Interview,
  SwipeDirection,
  SwipeRecord,
  UserProfile,
} from './types'

interface AppState {
  profile: UserProfile
  onboarded: boolean
  swipes: SwipeRecord[]
  saved: string[]
  threads: ChatThread[]
  interviews: Interview[]
}

interface StoreValue extends AppState {
  hydrated: boolean
  setProfile: (p: UserProfile) => void
  completeOnboarding: (p: UserProfile) => void
  recordSwipe: (jobId: string, direction: SwipeDirection) => void
  undoSwipe: () => void
  resetSwipes: () => void
  toggleSaveJob: (jobId: string) => void
  sendMessage: (jobId: string, text: string, lang: 'en' | 'ar') => void
  ensureThread: (jobId: string) => void
  scheduleInterview: (jobId: string, date: string, time: string) => void
  confirmInterview: (id: string) => void
  appliedJobIds: string[]
  resetAll: () => void
}

const StoreContext = createContext<StoreValue | null>(null)
const KEY = 'masari.state.v1'

const initial: AppState = {
  profile: defaultProfile,
  onboarded: false,
  swipes: [],
  saved: [],
  threads: [],
  interviews: [],
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initial)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) setState({ ...initial, ...JSON.parse(raw) })
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(KEY, JSON.stringify(state))
  }, [state, hydrated])

  const setProfile = useCallback((p: UserProfile) => {
    setState((s) => ({ ...s, profile: p }))
  }, [])

  const completeOnboarding = useCallback((p: UserProfile) => {
    setState((s) => ({ ...s, profile: p, onboarded: true }))
  }, [])

  const recordSwipe = useCallback((jobId: string, direction: SwipeDirection) => {
    setState((s) => {
      const swipes = [
        ...s.swipes.filter((sw) => sw.jobId !== jobId),
        { jobId, direction, at: Date.now() },
      ]
      let threads = s.threads
      // Applying creates a conversation thread with the employer.
      if (direction === 'apply' && !s.threads.some((t) => t.jobId === jobId)) {
        const job = getJob(jobId)
        if (job) threads = [seedThread(job), ...s.threads]
      }
      // Once applied, a job no longer lives in the "saved for later" list.
      const saved =
        direction === 'apply' ? s.saved.filter((id) => id !== jobId) : s.saved
      return { ...s, swipes, saved, threads }
    })
  }, [])

  const toggleSaveJob = useCallback((jobId: string) => {
    setState((s) => ({
      ...s,
      saved: s.saved.includes(jobId)
        ? s.saved.filter((id) => id !== jobId)
        : [jobId, ...s.saved],
    }))
  }, [])

  const undoSwipe = useCallback(() => {
    setState((s) => {
      if (s.swipes.length === 0) return s
      const last = s.swipes[s.swipes.length - 1]
      return {
        ...s,
        swipes: s.swipes.slice(0, -1),
        threads:
          last.direction === 'apply'
            ? s.threads.filter(
                (t) => !(t.jobId === last.jobId && t.messages.length <= 1),
              )
            : s.threads,
      }
    })
  }, [])

  const resetSwipes = useCallback(() => {
    setState((s) => ({ ...s, swipes: [] }))
  }, [])

  const ensureThread = useCallback((jobId: string) => {
    setState((s) => {
      if (s.threads.some((t) => t.jobId === jobId)) return s
      const job = getJob(jobId)
      if (!job) return s
      return { ...s, threads: [seedThread(job), ...s.threads] }
    })
  }, [])

  const sendMessage = useCallback(
    (jobId: string, text: string, lang: 'en' | 'ar') => {
      const msg: ChatMessage = {
        id: `${jobId}-${Date.now()}`,
        from: 'me',
        at: Date.now(),
        text: { en: text, ar: text },
      }
      setState((s) => ({
        ...s,
        threads: s.threads.map((t) =>
          t.jobId === jobId ? { ...t, messages: [...t.messages, msg] } : t,
        ),
      }))
      // Simulated employer reply.
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `${jobId}-${Date.now()}-r`,
          from: 'them',
          at: Date.now(),
          text: {
            en: 'Great, thanks for sharing! Would you be available for a short interview this week?',
            ar: 'رائع، شكرًا للمشاركة! هل أنت متاح لمقابلة قصيرة هذا الأسبوع؟',
          },
        }
        setState((s) => ({
          ...s,
          threads: s.threads.map((t) =>
            t.jobId === jobId ? { ...t, messages: [...t.messages, reply] } : t,
          ),
        }))
      }, 1200)
    },
    [],
  )

  const scheduleInterview = useCallback(
    (jobId: string, date: string, time: string) => {
      const job = getJob(jobId)
      if (!job) return
      setState((s) => {
        const base = sampleInterview(job)
        const iv: Interview = { ...base, date, time, status: 'proposed' }
        return {
          ...s,
          interviews: [...s.interviews.filter((i) => i.jobId !== jobId), iv],
        }
      })
    },
    [],
  )

  const confirmInterview = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      interviews: s.interviews.map((i) =>
        i.id === id ? { ...i, status: 'confirmed' } : i,
      ),
    }))
  }, [])

  const resetAll = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY)
    } catch {
      // ignore
    }
    setState(initial)
  }, [])

  const appliedJobIds = useMemo(
    () => state.swipes.filter((s) => s.direction === 'apply').map((s) => s.jobId),
    [state.swipes],
  )

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      hydrated,
      setProfile,
      completeOnboarding,
      recordSwipe,
      undoSwipe,
      resetSwipes,
      toggleSaveJob,
      sendMessage,
      ensureThread,
      scheduleInterview,
      confirmInterview,
      appliedJobIds,
      resetAll,
    }),
    [
      state,
      hydrated,
      setProfile,
      completeOnboarding,
      recordSwipe,
      undoSwipe,
      resetSwipes,
      toggleSaveJob,
      sendMessage,
      ensureThread,
      scheduleInterview,
      confirmInterview,
      appliedJobIds,
      resetAll,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
