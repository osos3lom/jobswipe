import type { LocalizedText } from '@/lib/types'

// Strings for the iHR Platform side of the demo: the hub, the console shell
// and the console dashboard. Placeholders like {n} are filled with fill()
// from lib/i18n. Each later phase adds its own dictionary file here.
export const platformDict: Record<string, LocalizedText> = {
  platformName: { en: 'iHR Platform', ar: 'منصة iHR' },
  productJobs: { en: 'Jobs', ar: 'وظائف' },
  productPlatform: { en: 'Platform', ar: 'المنصة' },
  conceptDemo: { en: 'Concept demo', ar: 'عرض تجريبي' },
  disclaimer: {
    en: 'Unofficial concept demo by {author}. Not affiliated with or endorsed by iHR. Every person, company and figure is fictional.',
    ar: 'عرض تجريبي غير رسمي من إعداد {author}. غير تابع لـ iHR ولا معتمد منها. جميع الأشخاص والشركات والأرقام وهمية.',
  },

  // hub
  hubTitle: {
    en: 'HR, payroll and hiring in one platform, built for Saudi companies',
    ar: 'الموارد البشرية والرواتب والتوظيف في منصة واحدة، مصمّمة للشركات السعودية',
  },
  hubSubtitle: {
    en: 'Pick a role to explore the demo. Everything runs in your browser on a fictional company.',
    ar: 'اختر دورًا لاستكشاف العرض. كل شيء يعمل في متصفحك على بيانات شركة وهمية.',
  },
  roleAdmin: { en: 'HR admin', ar: 'مسؤول الموارد البشرية' },
  roleAdminHint: {
    en: 'Run the company: people, payroll, compliance and hiring.',
    ar: 'أدر الشركة: الموظفون والرواتب والامتثال والتوظيف.',
  },
  roleCandidate: { en: 'Job seeker', ar: 'باحث عن عمل' },
  roleCandidateHint: {
    en: 'Swipe through AI-matched jobs in the iHR Jobs mobile app.',
    ar: 'تصفح وظائف مطابقة بالذكاء الاصطناعي عبر تطبيق وظائف iHR.',
  },
  roleEmployee: { en: 'Employee', ar: 'موظف' },
  roleEmployeeHint: {
    en: 'Payslips, leave requests and HR letters.',
    ar: 'قسائم الرواتب وطلبات الإجازة والخطابات.',
  },
  openDemo: { en: 'Open', ar: 'افتح' },
  comingSoon: { en: 'Soon', ar: 'قريبًا' },

  // demo menu
  demoMenu: { en: 'Demo', ar: 'العرض' },
  switchRole: { en: 'Switch role', ar: 'تبديل الدور' },
  resetDemo: { en: 'Reset demo data', ar: 'إعادة ضبط بيانات العرض' },
  resetDemoDone: { en: 'Demo data reset', ar: 'تمت إعادة ضبط البيانات' },

  // console shell
  console: { en: 'Console', ar: 'لوحة التحكم' },
  navDashboard: { en: 'Home', ar: 'الرئيسية' },
  navPeople: { en: 'People', ar: 'الموظفون' },
  navPayroll: { en: 'Payroll', ar: 'الرواتب' },
  navTimeOff: { en: 'Time off', ar: 'الإجازات' },
  navHiring: { en: 'Hiring', ar: 'التوظيف' },
  navOnboarding: { en: 'Onboarding', ar: 'التهيئة' },
  navCompliance: { en: 'Compliance', ar: 'الامتثال' },
  navBenefits: { en: 'Benefits', ar: 'المزايا' },
  navPerformance: { en: 'Performance', ar: 'الأداء' },
  navReports: { en: 'Reports', ar: 'التقارير' },
  openMenu: { en: 'Open menu', ar: 'فتح القائمة' },
  backToHub: { en: 'Demo hub', ar: 'صفحة العرض' },
  closeMenu: { en: 'Close menu', ar: 'إغلاق القائمة' },
  loading: { en: 'Loading…', ar: 'جارٍ التحميل…' },

  // dashboard
  greetingMorning: { en: 'Good morning', ar: 'صباح الخير' },
  greetingAfternoon: { en: 'Good afternoon', ar: 'مساء الخير' },
  greetingEvening: { en: 'Good evening', ar: 'مساء الخير' },
  dashboardSubtitle: {
    en: "Here's what needs attention at {company}.",
    ar: 'إليك ما يحتاج إلى انتباهك في {company}.',
  },
  kpiHeadcount: { en: 'Headcount', ar: 'عدد الموظفين' },
  kpiHeadcountHint: {
    en: '{onboarding} onboarding · {leave} on leave',
    ar: '{onboarding} قيد التهيئة · {leave} في إجازة',
  },
  kpiPayroll: { en: 'Monthly payroll', ar: 'الرواتب الشهرية' },
  kpiPayrollHint: { en: 'Next payday {date}', ar: 'موعد الصرف القادم {date}' },
  kpiSaudization: { en: 'Saudization', ar: 'نسبة التوطين' },
  kpiSaudizationHint: {
    en: '{saudi} Saudi · {nonSaudi} non-Saudi',
    ar: '{saudi} سعودي · {nonSaudi} غير سعودي',
  },
  kpiDocs: { en: 'Documents expiring', ar: 'وثائق تقارب الانتهاء' },
  kpiDocsHint: { en: 'Iqamas within 60 days', ar: 'إقامات خلال ٦٠ يومًا' },
  todos: { en: 'Needs attention', ar: 'يحتاج انتباهك' },
  todoAllClear: { en: 'Nothing needs attention right now.', ar: 'لا يوجد ما يحتاج انتباهك الآن.' },
  todoIqamaExpired: {
    en: 'Iqama expired {days} ago — {name}',
    ar: 'انتهت إقامة {name} منذ {days}',
  },
  todoIqamaToday: { en: 'Iqama expires today — {name}', ar: 'تنتهي إقامة {name} اليوم' },
  todoIqamaExpiring: {
    en: 'Iqama expires in {days} — {name}',
    ar: 'تنتهي إقامة {name} خلال {days}',
  },
  todoPayroll: { en: 'Run {month} payroll', ar: 'تشغيل رواتب {month}' },
  todoPayrollHint: { en: 'Due in {days} · {count} employees', ar: 'مستحقة خلال {days} · {count} موظف' },
  todoOnboarding: { en: 'Finish onboarding — {name}', ar: 'إكمال تهيئة {name}' },
  todoOnboardingHint: { en: 'Started {days} ago', ar: 'بدأ منذ {days}' },
  byDepartment: { en: 'Team by department', ar: 'الفريق حسب القسم' },
  hijriToday: { en: 'Today', ar: 'اليوم' },
}
