import { scoreJob } from '@/lib/matching'
import type { Job, UserProfile } from '@/lib/types'
import type { Applicant } from './types'

export interface ScoredApplicant {
  applicant: Applicant
  job: Job
  score: number
  reasons: {
    key: string
    label: { en: string; ar: string }
    positive: boolean
  }[]
  matchedSkills: string[]
  missingSkills: string[]
}

/**
 * Reverses the matching engine: scores an Applicant against a Job's requirements
 * using the exact same algorithm the candidate app uses, ensuring 100% score consistency.
 */
export function scoreApplicantForJob(applicant: Applicant, job: Job): ScoredApplicant {
  const profile: UserProfile = {
    name: applicant.name.en,
    headline: applicant.headline.en,
    avatar: applicant.avatar || '',
    city:
      applicant.city === 'jeddah'
        ? 'makkah'
        : applicant.city === 'dammam'
          ? 'eastern'
          : applicant.city === 'riyadh'
            ? 'riyadh'
            : 'remote',
    skills: applicant.skills,
    experience: applicant.experience,
    desiredSalary: applicant.expectedSalary,
    jobTypes: [job.type],
    careerGoal: applicant.headline.en,
    aspirationalSkills: [],
  }

  const scored = scoreJob(profile, job)

  const applicantSkillsLower = new Set(applicant.skills.map((s) => s.toLowerCase()))
  const matchedSkills = job.skills.filter((s) => applicantSkillsLower.has(s.toLowerCase()))
  const missingSkills = job.skills.filter((s) => !applicantSkillsLower.has(s.toLowerCase()))

  return {
    applicant,
    job,
    score: scored.score,
    reasons: scored.reasons,
    matchedSkills,
    missingSkills,
  }
}
