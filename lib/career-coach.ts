import type { Lang, LocalizedText } from './types'

export interface CoachOption {
  value: string
  label: LocalizedText
  /** skills this answer implies, fed into matching as aspirational skills */
  skills?: string[]
}

export interface CoachQuestion {
  id: string
  prompt: LocalizedText
  options: CoachOption[]
  allowFreeText?: boolean
}

/**
 * Deterministic question tree for the simulated AI career coach. A real LLM
 * could replace `buildSmartGoal` and stream follow-up questions instead.
 */
export const coachQuestions: CoachQuestion[] = [
  {
    id: 'direction',
    prompt: {
      en: 'Where do you want your career to head?',
      ar: 'إلى أين تريد أن يتجه مسارك المهني؟',
    },
    options: [
      {
        value: 'leadership',
        label: { en: 'Into leadership & management', ar: 'نحو القيادة والإدارة' },
        skills: ['Leadership', 'Project Management'],
      },
      {
        value: 'expert',
        label: { en: 'Become a technical expert', ar: 'أصبح خبيرًا تقنيًا' },
        skills: ['Cloud / AWS', 'Cybersecurity'],
      },
      {
        value: 'switch',
        label: { en: 'Switch into a new field', ar: 'الانتقال إلى مجال جديد' },
        skills: ['Data Analysis'],
      },
      {
        value: 'entrepreneur',
        label: { en: 'Build my own venture', ar: 'تأسيس مشروعي الخاص' },
        skills: ['Leadership', 'Marketing'],
      },
    ],
  },
  {
    id: 'timeline',
    prompt: {
      en: 'What timeline feels right for this goal?',
      ar: 'ما الإطار الزمني المناسب لهذا الهدف؟',
    },
    options: [
      { value: '1', label: { en: 'Within 1 year', ar: 'خلال سنة' } },
      { value: '3', label: { en: 'In about 3 years', ar: 'خلال 3 سنوات تقريبًا' } },
      { value: '5', label: { en: 'In 5 years', ar: 'خلال 5 سنوات' } },
    ],
  },
  {
    id: 'motivation',
    prompt: {
      en: 'What matters most to you right now?',
      ar: 'ما الأهم بالنسبة لك الآن؟',
    },
    options: [
      { value: 'salary', label: { en: 'Higher salary', ar: 'راتب أعلى' } },
      { value: 'impact', label: { en: 'Meaningful impact', ar: 'أثر ذو معنى' } },
      { value: 'balance', label: { en: 'Work-life balance', ar: 'توازن الحياة والعمل' } },
      { value: 'growth', label: { en: 'Fast growth', ar: 'نمو سريع' } },
    ],
  },
  {
    id: 'focus',
    prompt: {
      en: 'Name one skill you want to grow. (Type your own)',
      ar: 'اذكر مهارة واحدة تريد تطويرها. (اكتبها بنفسك)',
    },
    allowFreeText: true,
    options: [
      { value: 'Leadership', label: { en: 'Leadership', ar: 'القيادة' }, skills: ['Leadership'] },
      { value: 'Cloud / AWS', label: { en: 'Cloud / AWS', ar: 'الحوسبة السحابية' }, skills: ['Cloud / AWS'] },
      { value: 'Data Analysis', label: { en: 'Data Analysis', ar: 'تحليل البيانات' }, skills: ['Data Analysis'] },
      { value: 'Public Speaking', label: { en: 'Public Speaking', ar: 'التحدث أمام الجمهور' } },
    ],
  },
]

export interface CoachAnswers {
  direction?: string
  timeline?: string
  motivation?: string
  focus?: string
}

const directionText: Record<string, LocalizedText> = {
  leadership: {
    en: 'grow into a leadership role managing a high-performing team',
    ar: 'التطور إلى دور قيادي يدير فريقًا عالي الأداء',
  },
  expert: {
    en: 'become a recognised technical expert in my field',
    ar: 'أن أصبح خبيرًا تقنيًا معترفًا به في مجالي',
  },
  switch: {
    en: 'successfully transition into a new, future-ready field',
    ar: 'الانتقال بنجاح إلى مجال جديد جاهز للمستقبل',
  },
  entrepreneur: {
    en: 'launch and grow my own venture',
    ar: 'إطلاق مشروعي الخاص وتنميته',
  },
}

const motivationText: Record<string, LocalizedText> = {
  salary: { en: 'increasing my earning power', ar: 'زيادة قدرتي على الكسب' },
  impact: { en: 'creating meaningful impact', ar: 'تحقيق أثر ذي معنى' },
  balance: { en: 'protecting a healthy work-life balance', ar: 'الحفاظ على توازن صحي بين العمل والحياة' },
  growth: { en: 'accelerating my professional growth', ar: 'تسريع نموي المهني' },
}

/** Synthesizes a SMART goal sentence from the collected answers. */
export function buildSmartGoal(answers: CoachAnswers, lang: Lang): string {
  const dir = directionText[answers.direction ?? 'leadership'] ?? directionText.leadership
  const years = answers.timeline ?? '3'
  const motiv = motivationText[answers.motivation ?? 'growth'] ?? motivationText.growth
  const skill = answers.focus?.trim() || (lang === 'ar' ? 'مهارة أساسية' : 'a core skill')

  if (lang === 'ar') {
    return `خلال ${years} سنوات، سأعمل على ${dir.ar} من خلال إتقان ${skill}، مع التركيز على ${motiv.ar} وقياس تقدّمي عبر أهداف ربع سنوية واضحة.`
  }
  return `Within ${years} years, I will ${dir.en} by mastering ${skill}, focusing on ${motiv.en}, and tracking progress through clear quarterly milestones.`
}

/** Collects the aspirational skills implied by the chosen options. */
export function aspirationalSkillsFrom(answers: CoachAnswers): string[] {
  const result = new Set<string>()
  for (const q of coachQuestions) {
    const val = (answers as Record<string, string | undefined>)[q.id]
    const opt = q.options.find((o) => o.value === val)
    opt?.skills?.forEach((s) => result.add(s))
  }
  if (answers.focus) result.add(answers.focus.trim())
  return [...result]
}
