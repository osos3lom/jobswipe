import type { ExperienceLevel, Job, MatchReason, ScoredJob, UserProfile } from './types'

const EXP_ORDER: ExperienceLevel[] = ['entry', 'junior', 'mid', 'senior', 'lead']

function expDistance(a: ExperienceLevel, b: ExperienceLevel) {
  return Math.abs(EXP_ORDER.indexOf(a) - EXP_ORDER.indexOf(b))
}

/**
 * Deterministic stand-in for an AI matching model. Produces a 0-100 score plus
 * human-readable reasons. The signature mirrors what a real LLM/embedding
 * ranker would expose, so it can be swapped out later.
 */
export function scoreJob(profile: UserProfile, job: Job): ScoredJob {
  const reasons: MatchReason[] = []
  let score = 0

  // --- Skills overlap (max 40) ---
  const userSkills = new Set(profile.skills.map((s) => s.toLowerCase()))
  const jobSkills = job.skills.map((s) => s.toLowerCase())
  const overlap = jobSkills.filter((s) => userSkills.has(s))
  const skillRatio = jobSkills.length ? overlap.length / jobSkills.length : 0
  score += skillRatio * 40
  if (overlap.length >= 2) {
    reasons.push({
      key: 'skills',
      label: {
        en: `${overlap.length} matching skills`,
        ar: `${overlap.length} مهارات متطابقة`,
      },
      positive: true,
    })
  } else if (overlap.length === 0) {
    reasons.push({
      key: 'skills-low',
      label: { en: 'Few skills overlap', ar: 'تطابق محدود في المهارات' },
      positive: false,
    })
  }

  // --- Location (max 18) ---
  if (job.region === profile.city) {
    score += 18
    reasons.push({
      key: 'location',
      label: { en: 'In your city', ar: 'في مدينتك' },
      positive: true,
    })
  } else if (job.region === 'remote' || job.remoteFriendly) {
    score += 14
    reasons.push({
      key: 'remote',
      label: { en: 'Remote friendly', ar: 'يدعم العمل عن بعد' },
      positive: true,
    })
  } else {
    score += 4
  }

  // --- Salary fit (max 20) ---
  if (job.salaryMax >= profile.desiredSalary) {
    if (job.salaryMin >= profile.desiredSalary) {
      score += 20
      reasons.push({
        key: 'salary',
        label: { en: 'Above your target pay', ar: 'أعلى من راتبك المطلوب' },
        positive: true,
      })
    } else {
      score += 14
      reasons.push({
        key: 'salary-ok',
        label: { en: 'Meets your pay range', ar: 'يلبّي نطاق راتبك' },
        positive: true,
      })
    }
  } else {
    score += 3
    reasons.push({
      key: 'salary-low',
      label: { en: 'Below your target pay', ar: 'أقل من راتبك المطلوب' },
      positive: false,
    })
  }

  // --- Experience fit (max 12) ---
  const dist = expDistance(profile.experience, job.experience)
  score += Math.max(0, 12 - dist * 5)
  if (dist === 0) {
    reasons.push({
      key: 'exp',
      label: { en: 'Right seniority', ar: 'مستوى خبرة مناسب' },
      positive: true,
    })
  }

  // --- Job type fit (max 5) ---
  if (profile.jobTypes.includes(job.type)) {
    score += 5
    reasons.push({
      key: 'type',
      label: { en: 'Preferred job type', ar: 'نوع وظيفة مفضّل' },
      positive: true,
    })
  }

  // --- Career-goal alignment boost (max 5) ---
  const aspir = new Set(profile.aspirationalSkills.map((s) => s.toLowerCase()))
  const goalText = profile.careerGoal.toLowerCase()
  const goalHit =
    jobSkills.some((s) => aspir.has(s)) ||
    (goalText && job.title.en.toLowerCase().split(' ').some((w) => w.length > 3 && goalText.includes(w)))
  if (goalHit) {
    score += 5
    reasons.push({
      key: 'goal',
      label: { en: 'Moves you toward your goal', ar: 'يقرّبك من هدفك' },
      positive: true,
    })
  }

  // Verified bonus (small nudge, capped at 100)
  if (job.verified) score += 2

  score = Math.max(4, Math.min(100, Math.round(score)))

  // keep the 3 strongest positive reasons + any single negative
  const positives = reasons.filter((r) => r.positive).slice(0, 3)
  const negatives = reasons.filter((r) => !r.positive).slice(0, 1)

  return { job, score, reasons: [...positives, ...negatives] }
}

export function rankJobs(profile: UserProfile, list: Job[]): ScoredJob[] {
  return list.map((j) => scoreJob(profile, j)).sort((a, b) => b.score - a.score)
}
