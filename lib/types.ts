export type Lang = 'en' | 'ar'

export type JobType = 'full_time' | 'part_time' | 'contract' | 'remote' | 'internship'
export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead'

export interface LocalizedText {
  en: string
  ar: string
}

export interface Job {
  id: string
  title: LocalizedText
  company: LocalizedText
  logo: string
  city: LocalizedText
  region: 'riyadh' | 'makkah' | 'eastern' | 'madinah' | 'asir' | 'remote'
  type: JobType
  experience: ExperienceLevel
  salaryMin: number
  salaryMax: number
  skills: string[]
  description: LocalizedText
  verified: boolean
  postedDaysAgo: number
  remoteFriendly: boolean
}

export interface UserProfile {
  name: string
  headline: string
  avatar: string
  city: Job['region']
  skills: string[]
  experience: ExperienceLevel
  desiredSalary: number
  jobTypes: JobType[]
  // produced by the AI career coach
  careerGoal: string
  aspirationalSkills: string[]
}

export interface MatchReason {
  key: string
  label: LocalizedText
  positive: boolean
}

export interface ScoredJob {
  job: Job
  score: number
  reasons: MatchReason[]
}

export type SwipeDirection = 'apply' | 'skip'

export interface SwipeRecord {
  jobId: string
  direction: SwipeDirection
  at: number
}

export interface ChatMessage {
  id: string
  from: 'me' | 'them'
  text: LocalizedText | { en: string; ar: string }
  at: number
}

export interface ChatThread {
  jobId: string
  companyName: LocalizedText
  jobTitle: LocalizedText
  logo: string
  messages: ChatMessage[]
}

export interface Interview {
  id: string
  jobId: string
  jobTitle: LocalizedText
  company: LocalizedText
  logo: string
  date: string // ISO date
  time: string // HH:mm
  mode: 'video' | 'onsite' | 'phone'
  status: 'proposed' | 'confirmed'
}
