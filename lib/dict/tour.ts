import type { LocalizedText } from '@/lib/types'

export const tourDict: Record<string, LocalizedText> = {
  tourStartTitle: { en: 'Welcome to iHR Platform', ar: 'مرحباً بك في منصة iHR' },
  tourStartDesc: {
    en: 'Take a quick 2-minute tour through our Saudi-tailored employer console, payroll engine, and hiring tools.',
    ar: 'قم بجولة سريعة لمدة دقيقتين للتعرف على لوحة تحكم المنشأة، ونظام الرواتب والامتثال السعودي، وأدوات التوظيف.',
  },
  takeTour: { en: 'Take the tour', ar: 'ابدأ الجولة الإرشادية' },
  skipTour: { en: 'Skip tour', ar: 'تخطي الجولة' },
  nextStep: { en: 'Next', ar: 'التالي' },
  prevStep: { en: 'Back', ar: 'السابق' },
  finishTour: { en: 'Get started', ar: 'ابدأ الاستكشاف' },
  restartTour: { en: 'Restart guided tour', ar: 'إعادة الجولة الإرشادية' },
  tourProgress: { en: 'Step {current} of {total}', ar: 'الخطوة {current} من {total}' },

  // Step 1: Dashboard
  tourStep1Title: { en: 'Employer Command Center', ar: 'مركز قيادة المنشأة' },
  tourStep1Body: {
    en: 'Real-time overview of active headcount, monthly payroll costs, Nitaqat compliance, and urgent HR todos.',
    ar: 'نظرة شاملة فورية على عدد الموظفين، وكتلة الأجور الشهرية، ونطاقات، والمهام العاجلة.',
  },

  // Step 2: Payroll
  tourStep2Title: { en: 'One-Click Saudi Payroll', ar: 'معالجة الرواتب وحماية الأجور' },
  tourStep2Body: {
    en: 'Automated GOSI social insurance deductions and standard WPS SIF file generation for Saudi corporate banking.',
    ar: 'احتساب تلقائي لاشتراكات التأمينات الاجتماعية (GOSI) وتصدير ملفات حماية الأجور (WPS SIF).',
  },

  // Step 3: Hiring & Pipeline
  tourStep3Title: { en: 'Applicant Tracking & Swipe', ar: 'التوظيف وفرز المرشحين الذكي' },
  tourStep3Body: {
    en: 'Review applications, manage pipeline stages, or jump into the card review mode to hire top talent.',
    ar: 'متابعة مراحل المتقدمين للوظائف، وفرز السير الذاتية، ومراجعة المرشحين للانتقال لمرحلة التعيين.',
  },

  // Step 4: Compliance Hub
  tourStep4Title: { en: 'Saudi Compliance Hub', ar: 'مركز الامتثال والأنظمة' },
  tourStep4Body: {
    en: 'Live Nitaqat band calculator, What-If Saudization simulator, and Iqama & Qiwa contract expiry tracker.',
    ar: 'متابعة نطاقات فورياً، ومحاكي قرارات التوظيف، وتنبيهات صلاحية الإقامات وعقود قوى الموحدة.',
  },

  // Step 5: Employee & Candidate Switch
  tourStep5Title: { en: 'Unified 3-in-1 Platform', ar: 'منصة متكاملة بثلاث واجهات' },
  tourStep5Body: {
    en: 'Switch between Employer Console, Candidate Swipe App, and Employee Self-Service in one click from the Demo menu.',
    ar: 'انتقل بسلاسة بين لوحة المنشأة، وتطبيق المرشحين، وبوابة الموظف للخدمة الذاتية عبر قائمة العرض.',
  },
}
