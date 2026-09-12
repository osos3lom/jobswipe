'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { complianceDict } from './dict/compliance'
import { employeeDict } from './dict/employee'
import { hiringDict } from './dict/hiring'
import { hrModulesDict } from './dict/hr-modules'
import { marketingDict } from './dict/marketing'
import { payrollDict } from './dict/payroll'
import { peopleDict } from './dict/people'
import { platformDict } from './dict/platform'
import { tourDict } from './dict/tour'
import type { Lang, LocalizedText } from './types'

type Dict = Record<string, LocalizedText>

const candidateDict: Dict = {
  appName: { en: 'iHR Jobs', ar: 'وظائف iHR' },
  tagline: {
    en: 'Swipe into your next role',
    ar: 'اسحب نحو وظيفتك القادمة',
  },
  // nav
  discover: { en: 'Discover', ar: 'استكشف' },
  matches: { en: 'Matches', ar: 'التطابقات' },
  chat: { en: 'Chat', ar: 'المحادثات' },
  interviews: { en: 'Interviews', ar: 'المقابلات' },
  profile: { en: 'Profile', ar: 'الملف' },
  // landing
  heroTitle: {
    en: 'AI job matching, made for Saudi Arabia',
    ar: 'مطابقة وظائف ذكية، صُممت للسعودية',
  },
  heroSubtitle: {
    en: 'Build your profile, set a career goal with your AI coach, then swipe to apply.',
    ar: 'أنشئ ملفك، وحدد هدفك المهني مع مدربك الذكي، ثم اسحب للتقديم.',
  },
  getStarted: { en: 'Get started', ar: 'ابدأ الآن' },
  alreadyHaveProfile: { en: 'I already have a profile', ar: 'لدي ملف بالفعل' },
  // onboarding
  step: { en: 'Step', ar: 'خطوة' },
  of: { en: 'of', ar: 'من' },
  next: { en: 'Continue', ar: 'متابعة' },
  back: { en: 'Back', ar: 'رجوع' },
  finish: { en: 'Start matching', ar: 'ابدأ المطابقة' },
  yourBasics: { en: 'Your basics', ar: 'معلوماتك الأساسية' },
  fullName: { en: 'Full name', ar: 'الاسم الكامل' },
  headline: { en: 'Professional headline', ar: 'المسمى المهني' },
  uploadCv: { en: 'Upload your CV', ar: 'ارفع سيرتك الذاتية' },
  uploadCvHint: {
    en: 'Drop your CV and our AI will extract your skills',
    ar: 'أسقط سيرتك الذاتية وسيستخرج الذكاء الاصطناعي مهاراتك',
  },
  parsing: { en: 'Reading your CV…', ar: 'نقرأ سيرتك الذاتية…' },
  extractedSkills: { en: 'Extracted skills', ar: 'المهارات المستخرجة' },
  addSkill: { en: 'Add a skill', ar: 'أضف مهارة' },
  coachTitle: { en: 'AI Career Coach', ar: 'مدرب المسار الذكي' },
  coachIntro: {
    en: 'Answer a few questions so I can shape your long-term goal.',
    ar: 'أجب عن بعض الأسئلة لأصيغ هدفك بعيد المدى.',
  },
  yourGoal: { en: 'Your SMART career goal', ar: 'هدفك المهني الذكي' },
  goalHint: {
    en: 'Edit it to make it yours. We use it to rank jobs.',
    ar: 'عدّله ليناسبك. نستخدمه لترتيب الوظائف.',
  },
  preferences: { en: 'Preferences', ar: 'التفضيلات' },
  preferredCity: { en: 'Preferred location', ar: 'الموقع المفضل' },
  experienceLevel: { en: 'Experience level', ar: 'مستوى الخبرة' },
  desiredSalary: { en: 'Desired monthly salary (SAR)', ar: 'الراتب الشهري المطلوب (ريال)' },
  jobTypes: { en: 'Job types', ar: 'أنواع الوظائف' },
  typeYourAnswer: { en: 'Type your answer…', ar: 'اكتب إجابتك…' },
  skipForNow: { en: 'Skip', ar: 'تخطّي' },
  // discover
  applied: { en: 'Applied', ar: 'تم التقديم' },
  skipped: { en: 'Skipped', ar: 'تم التخطي' },
  apply: { en: 'Apply', ar: 'تقديم' },
  skip: { en: 'Skip', ar: 'تخطي' },
  undo: { en: 'Undo', ar: 'تراجع' },
  match: { en: 'match', ar: 'تطابق' },
  whyMatch: { en: 'Why this matches', ar: 'لماذا يناسبك' },
  noMoreJobs: { en: 'You are all caught up', ar: 'لقد اطلعت على كل الوظائف' },
  noMoreJobsHint: {
    en: 'Check back later for fresh roles, or review your matches.',
    ar: 'عد لاحقًا لوظائف جديدة، أو راجع تطابقاتك.',
  },
  reset: { en: 'Reset deck', ar: 'إعادة التعيين' },
  verified: { en: 'Verified', ar: 'موثّق' },
  perMonth: { en: '/mo', ar: '/شهر' },
  // matches
  yourMatches: { en: 'Your matches', ar: 'تطابقاتك' },
  noMatchesYet: { en: 'No matches yet', ar: 'لا توجد تطابقات بعد' },
  noMatchesHint: {
    en: 'Swipe right on jobs you like to see them here.',
    ar: 'اسحب يمينًا على الوظائف لتظهر هنا.',
  },
  startSwiping: { en: 'Start swiping', ar: 'ابدأ السحب' },
  messageEmployer: { en: 'Message', ar: 'مراسلة' },
  // chat
  messages: { en: 'Messages', ar: 'الرسائل' },
  noChats: { en: 'No conversations yet', ar: 'لا توجد محادثات بعد' },
  typeMessage: { en: 'Type a message…', ar: 'اكتب رسالة…' },
  send: { en: 'Send', ar: 'إرسال' },
  scheduleInterview: { en: 'Schedule interview', ar: 'جدولة مقابلة' },
  // interviews
  upcoming: { en: 'Upcoming interviews', ar: 'المقابلات القادمة' },
  noInterviews: { en: 'No interviews scheduled', ar: 'لا توجد مقابلات مجدولة' },
  pickSlot: { en: 'Pick a time slot', ar: 'اختر موعدًا' },
  confirm: { en: 'Confirm', ar: 'تأكيد' },
  confirmed: { en: 'Confirmed', ar: 'مؤكدة' },
  proposed: { en: 'Proposed', ar: 'مقترحة' },
  video: { en: 'Video call', ar: 'مكالمة فيديو' },
  onsite: { en: 'On-site', ar: 'في الموقع' },
  phone: { en: 'Phone', ar: 'هاتف' },
  // profile
  editProfile: { en: 'Edit profile', ar: 'تعديل الملف' },
  skills: { en: 'Skills', ar: 'المهارات' },
  careerGoal: { en: 'Career goal', ar: 'الهدف المهني' },
  language: { en: 'Language', ar: 'اللغة' },
  stats: { en: 'Activity', ar: 'النشاط' },
  appliedCount: { en: 'Applied', ar: 'تقديمات' },
  savedCount: { en: 'Saved', ar: 'محفوظة' },
  interviewsCount: { en: 'Interviews', ar: 'مقابلات' },
  // job types
  full_time: { en: 'Full-time', ar: 'دوام كامل' },
  part_time: { en: 'Part-time', ar: 'دوام جزئي' },
  contract: { en: 'Contract', ar: 'عقد' },
  remote: { en: 'Remote', ar: 'عن بعد' },
  internship: { en: 'Internship', ar: 'تدريب' },
  // experience
  entry: { en: 'Entry', ar: 'مبتدئ' },
  junior: { en: 'Junior', ar: 'مبتدئ متقدم' },
  mid: { en: 'Mid-level', ar: 'متوسط' },
  senior: { en: 'Senior', ar: 'خبير' },
  lead: { en: 'Lead', ar: 'قيادي' },
  // regions
  riyadh: { en: 'Riyadh', ar: 'الرياض' },
  makkah: { en: 'Jeddah / Makkah', ar: 'جدة / مكة' },
  eastern: { en: 'Eastern Province', ar: 'المنطقة الشرقية' },
  madinah: { en: 'Madinah', ar: 'المدينة' },
  asir: { en: 'Asir', ar: 'عسير' },
  // matches tabs / saved
  saved: { en: 'Saved', ar: 'محفوظة' },
  noSavedYet: { en: 'Nothing saved yet', ar: 'لا يوجد محفوظات بعد' },
  noSavedHint: {
    en: 'Tap the bookmark on a job to save it for later.',
    ar: 'اضغط على الإشارة المرجعية لحفظ الوظيفة لاحقًا.',
  },
  applyNow: { en: 'Apply now', ar: 'قدّم الآن' },
  saveForLater: { en: 'Save for later', ar: 'احفظ لاحقًا' },
  statusApplied: { en: 'Applied', ar: 'تم التقديم' },
  statusInChat: { en: 'In chat', ar: 'محادثة جارية' },
  statusInterview: { en: 'Interview', ar: 'مقابلة' },
  // interviews
  reschedule: { en: 'Reschedule', ar: 'إعادة جدولة' },
  interviewFor: { en: 'Interview for', ar: 'مقابلة لوظيفة' },
  // profile
  settings: { en: 'Settings', ar: 'الإعدادات' },
  theme: { en: 'Theme', ar: 'المظهر' },
  lightMode: { en: 'Light', ar: 'فاتح' },
  darkMode: { en: 'Dark', ar: 'داكن' },
  saveChanges: { en: 'Save changes', ar: 'حفظ التغييرات' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  growthSkills: { en: 'Growth skills', ar: 'مهارات التطوير' },
  resetApp: { en: 'Reset app data', ar: 'إعادة تعيين البيانات' },
  resetAppHint: {
    en: 'Clears your profile, swipes and chats on this device.',
    ar: 'يمسح ملفك وسحباتك ومحادثاتك على هذا الجهاز.',
  },
  about: { en: 'About iHR Jobs', ar: 'عن وظائف iHR' },
  aboutText: {
    en: 'The job-seeker side of the iHR Platform concept demo. All data stays on your device.',
    ar: 'الجانب الخاص بالباحثين عن عمل من العرض التجريبي لمنصة iHR. جميع البيانات محفوظة على جهازك.',
  },
  // landing
  landingFeature1: { en: 'AI-matched roles', ar: 'وظائف مطابقة بالذكاء' },
  landingFeature2: { en: 'Career coach & goals', ar: 'مدرب مهني وأهداف' },
  landingFeature3: { en: 'Arabic & English', ar: 'عربي وإنجليزي' },
}

const dict: Dict = {
  ...candidateDict,
  ...platformDict,
  ...marketingDict,
  ...peopleDict,
  ...payrollDict,
  ...hiringDict,
  ...complianceDict,
  ...hrModulesDict,
  ...tourDict,
  ...employeeDict,
}

// Fills {placeholders} in a translated string: fill(t('todoPayroll'), { month })
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match,
  )
}

interface I18nValue {
  lang: Lang
  dir: 'ltr' | 'rtl'
  setLang: (l: Lang) => void
  toggle: () => void
  t: (key: keyof typeof dict | string) => string
  tx: (text: LocalizedText | undefined) => string
}

const I18nContext = createContext<I18nValue | null>(null)

const STORAGE_KEY = 'masari.lang'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Arabic-first, like ihr.sa. The inline script in the root layout applies a
  // saved English preference before paint so the direction never flips.
  const [lang, setLangState] = useState<Lang>('ar')

  useEffect(() => {
    const saved = (typeof window !== 'undefined' &&
      window.localStorage.getItem(STORAGE_KEY)) as Lang | null
    if (saved === 'ar' || saved === 'en') setLangState(saved)
  }, [])

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    window.localStorage.setItem(STORAGE_KEY, lang)
  }, [lang, dir])

  const setLang = (l: Lang) => setLangState(l)
  const toggle = () => setLangState((p) => (p === 'en' ? 'ar' : 'en'))

  const t = (key: string) => {
    const entry = dict[key]
    return entry ? entry[lang] : key
  }
  const tx = (text: LocalizedText | undefined) => (text ? text[lang] : '')

  const value = useMemo<I18nValue>(
    () => ({ lang, dir, setLang, toggle, t, tx }),
    [lang, dir],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
