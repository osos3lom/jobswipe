import type { LocalizedText } from '@/lib/types'

// All strings for the marketing homepage (Phase 1).
// Bilingual: Arabic (RTL) and English (LTR).
export const marketingDict: Record<string, LocalizedText> = {
  // Navigation
  navFeatures: { en: 'Features', ar: 'المزايا' },
  navCompliance: { en: 'Compliance', ar: 'الامتثال' },
  navPricing: { en: 'Pricing', ar: 'الأسعار' },
  navCaseStudy: { en: 'Case study', ar: 'قصة نجاح' },
  navDemoHub: { en: 'Try demo', ar: 'جرّب العرض' },
  exploreConsole: { en: 'Explore console', ar: 'استكشف لوحة التحكم' },
  seeJobApp: { en: 'See candidate app', ar: 'تطبيق المرشحين' },

  // Hero Section
  heroPill: {
    en: 'Concept demo · Built for Saudi companies',
    ar: 'عرض تجريبي · مصمّم للشركات في المملكة',
  },
  heroHeadline: {
    en: 'Modern HR, payroll & hiring built for the Kingdom',
    ar: 'منظومة متكاملة للموارد البشرية والرواتب والتوظيف صُممت للمملكة',
  },
  heroSubhead: {
    en: 'Automate Saudi payroll with WPS & GOSI, track Iqama renewals, stay green in Nitaqat, and hire through an AI-powered swipe app. All in one bilingual platform.',
    ar: 'أتمتة الرواتب ونظام حماية الأجور والتأمينات الاجتماعية، وتتبّع الإقامات ونطاقات، واستقطاب الكفاءات عبر تطبيق ذكي. كل ذلك في منصة موحدة باللغتين العربية والإنجليزية.',
  },
  heroCtaConsole: { en: 'Explore employer console', ar: 'استكشف لوحة أصحاب العمل' },
  heroCtaJobs: { en: 'See candidate mobile app', ar: 'تصفح تطبيق الباحثين عن عمل' },
  heroTrustPill: {
    en: 'Interactive browser demo with simulated Saudi enterprise data',
    ar: 'عرض تفاعلي مباشر ببيانات تجريبية لشركة سعودية',
  },

  // Hero Snapshot Mock Card
  heroMockMonthlyPayroll: { en: 'Monthly payroll batch', ar: 'دفعة رواتب الشهر الحالي' },
  heroMockWpsStatus: { en: 'WPS Mudad ready', ar: 'جاهز لرفع حماية الأجور' },
  heroMockEmployeesActive: { en: '25 employees', ar: '٢٥ موظفًا' },
  heroMockSaudization: { en: '60% Saudization', ar: '٦٠٪ نسبة التوطين' },
  heroMockNitaqatStatus: { en: 'High Green tier', ar: 'النطاق الأخضر المرتفع' },
  heroMockNextPayday: { en: 'Payday on 27th', ar: 'موعد الصرف ٢٧ من الشهر' },

  // Compliance Band
  complianceBadge: { en: 'Saudi Regulatory Readiness', ar: 'جاهزية كاملة للأنظمة السعودية' },
  complianceHeading: {
    en: 'Built from day one for Saudi labor laws & government platforms',
    ar: 'مصمّمة من اليوم الأول للتوافق مع نظام العمل والمنصات الحكومية السعودية',
  },
  complianceSubheading: {
    en: 'Zero manual recalculations. Pre-configured for Saudi compliance standards and statutory requirements.',
    ar: 'دون حسابات يدوية معقدة. مهيأة مسبقًا لجميع المتطلبات النظامية في المملكة.',
  },

  // Compliance Chips
  chipGosiTitle: { en: 'GOSI / التأمينات', ar: 'التأمينات الاجتماعية' },
  chipGosiDesc: {
    en: 'Automatic calculation of Annuity, SANED and occupational hazard rates for Saudis and non-Saudis.',
    ar: 'احتساب تلقائي لنسب المعاشات وساند والأخطار المهنية للمواطنين والمقيمين.',
  },
  chipWpsTitle: { en: 'WPS & Mudad / حماية الأجور', ar: 'حماية الأجور ومنصة مَدد' },
  chipWpsDesc: {
    en: 'One-click salary file generation (SIF) formatted for all Saudi commercial banks and Mudad verification.',
    ar: 'توليد ملف صرف الرواتب (SIF) متوافق مع كافة البنوك السعودية ونظام مَدد بنقرة واحدة.',
  },
  chipQiwaTitle: { en: 'Qiwa / منصة قوى', ar: 'منصة قوى' },
  chipQiwaDesc: {
    en: 'Synchronized digital contracts, probation tracking, and labor law compliant notices.',
    ar: 'توثيق ومتابعة العقود الرقمية، فترات التجربة، والإخطارات النظامية المتوافقة.',
  },
  chipNitaqatTitle: { en: 'Nitaqat / برنامج نطاقات', ar: 'برنامج نطاقات' },
  chipNitaqatDesc: {
    en: 'Real-time Saudization tracking with proactive warnings before falling below your industry quota.',
    ar: 'متابعة فورية لمعدلات التوطين وتنبيهات استباقية قبل التراجع عن النطاق المستهدف.',
  },
  chipIqamaTitle: { en: 'Iqama Tracking / تتبّع الإقامات', ar: 'تتبّع الإقامات والوثائق' },
  chipIqamaDesc: {
    en: 'Color-coded 90, 60, and 30-day countdowns to eliminate costly late-renewal penalties.',
    ar: 'تنبيهات ملوّنة قبل ٩٠ و٦٠ و٣٠ يومًا لمنع أي غرامات تأخير في تجديد الإقامات.',
  },
  chipArabicTitle: { en: 'Arabic-First / لغة عربية أصيلة', ar: 'تصميم عربي أصيل' },
  chipArabicDesc: {
    en: 'Native RTL layout, Zain typography, and dual Hijri/Gregorian date formatting throughout.',
    ar: 'واجهات مصممة لليمين أصلاً بخط زين الأنيق ودعم متكامل للتاريخين الهجري والميلادي.',
  },

  // Feature Section Header
  featuresBadge: { en: 'Everything In One Place', ar: 'كل ما تحتاجه في مكان واحد' },
  featuresHeading: {
    en: 'Five core modules that eliminate HR friction',
    ar: 'خمس منظومات متكاملة تغنيك عن تشتت الأنظمة',
  },
  featuresSubheading: {
    en: 'A connected employer experience from job posting to retirement.',
    ar: 'تجربة سلسة متصلة تبدأ من إعلان الوظيفة وتستمر حتى مستحقات نهاية الخدمة.',
  },

  // Module 1: Payroll
  modPayrollTitle: { en: 'WPS-Ready Saudi Payroll', ar: 'الرواتب المتوافقة مع حماية الأجور' },
  modPayrollTagline: {
    en: 'Run error-free monthly payroll in 3 minutes, with auto-deducted GOSI and instant SIF generation.',
    ar: 'تشغيل مسير الرواتب الشهري بدقة خلال ٣ دقائق مع اقتطاعات التأمينات وملفات البنوك المعتمدة.',
  },
  modPayrollF1: { en: 'Direct export of Saudi bank SIF salary payment files', ar: 'تصدير فوري لملفات الصرف المصرفي المعتمدة للبنوك' },
  modPayrollF2: { en: 'Automated GOSI, SANED, and occupational hazard splits', ar: 'احتساب تلقائي لاشتراكات التأمينات وساند والأخطار' },
  modPayrollF3: { en: 'Digital payslips delivered to candidate & employee portals', ar: 'قسائم رواتب رقمية مشفرة تصل فوراً لحسابات الموظفين' },
  modPayrollAction: { en: 'Test payroll in console', ar: 'جرّب مسير الرواتب باللوحة' },

  // Module 2: People
  modPeopleTitle: { en: 'Complete Employee Directory & Records', ar: 'سجل الموظفين والهيكل التنظيمي' },
  modPeopleTagline: {
    en: 'One single source of truth for your 25+ team members with digital contract archiving and org charts.',
    ar: 'مرجع شامل وموحد لبيانات الموظفين، العقود الرقمية، والهيكل الإداري للشركة.',
  },
  modPeopleF1: { en: 'Comprehensive profiles for Saudi citizens and expats', ar: 'سجلات متكاملة للمواطنين والمقيمين مع تفاصيل الوظيفة' },
  modPeopleF2: { en: 'Department hierarchies, direct managers, and salary details', ar: 'إدارة الأقسام والمدراء المباشرين وحزم التعويضات' },
  modPeopleF3: { en: 'Instant status filtering: Active, Onboarding, On Leave', ar: 'تصنيف فوري: على رأس العمل، قيد التهيئة، في إجازة' },
  modPeopleAction: { en: 'View people directory', ar: 'استعرض سجل الموظفين' },

  // Module 3: Hiring
  modHiringTitle: { en: 'AI Hiring & Interactive Candidate Swipe App', ar: 'التوظيف الذكي وتطبيق المرشحين' },
  modHiringTagline: {
    en: 'Bridge the gap between recruiters and top Saudi talent with AI-assisted matching and swiping.',
    ar: 'اربط فريق التوظيف بأفضل الكفاءات في المملكة عبر خوارزميات المطابقة وتجربة السحب السريعة.',
  },
  modHiringF1: { en: 'Direct sync between iHR console pipeline and iHR Jobs mobile app', ar: 'تزامن مباشر بين مسارات التوظيف وتطبيق الباحثين عن عمل' },
  modHiringF2: { en: 'AI Career Coach extracts skills and highlights match scores', ar: 'مساعد ذكي يستخرج المهارات ويحدد نسب المطابقة بدقة' },
  modHiringF3: { en: '1-click interview scheduling and in-app candidate chats', ar: 'جدولة المقابلات ومراسلة المرشحين المؤهلين بنقرة واحدة' },
  modHiringAction: { en: 'Open candidate swipe app', ar: 'افتح تطبيق المرشحين' },

  // Module 4: Time Off
  modTimeOffTitle: { en: 'Saudi Labor Law Time Off & Leave', ar: 'إدارة الإجازات حسب نظام العمل' },
  modTimeOffTagline: {
    en: 'Configured for 21/30 day annual leaves, official Eid holidays, Hajj leave, and sick leave balances.',
    ar: 'معدة مسبقاً لرصيد الإجازات السنوية (٢١/٣٠ يوماً)، عطلات الأعياد، إجازات الحج، والإجازات المرضية.',
  },
  modTimeOffF1: { en: 'Automated accrual calculations linked directly to payroll', ar: 'احتساب الاستحقاقات تلقائياً وربطها المباشر بمسير الرواتب' },
  modTimeOffF2: { en: 'Manager approval workflows with mobile push notifications', ar: 'مسار موافقات مرن للمدراء المباشرين' },
  modTimeOffF3: { en: 'Unified leave calendar preventing team coverage shortages', ar: 'تقويم موحد للإجازات يضمن عدم تضارب تغطية الأعمال' },
  modTimeOffAction: { en: 'See leave tracker', ar: 'اطلع على تتبع الإجازات' },

  // Module 5: Compliance
  modComplianceTitle: { en: 'Proactive Regulatory Compliance Hub', ar: 'مركز المتابعة والامتثال النظامي' },
  modComplianceTagline: {
    en: 'Never miss an Iqama expiry date or drop your Saudization tier with real-time proactive warnings.',
    ar: 'لن يفوتك تاريخ تجديد إقامة أو يتراجع نطاق شركتك مع التنبيهات الذكية والمتابعة اللحظية.',
  },
  modComplianceF1: { en: 'Visual countdown for expiring resident IDs and passports', ar: 'عد تنازلي مرئي للإقامات والجوازات التي قاربت على الانتهاء' },
  modComplianceF2: { en: 'Real-time Saudization calculator with target projections', ar: 'حاسبة توطين فورية مع استشراف التعيينات المطلوبة' },
  modComplianceF3: { en: 'Actionable to-do alerts prioritized right on the dashboard', ar: 'قائمة مهام عاجلة مرتبة حسب الأولوية بلوحة التحكم' },
  modComplianceAction: { en: 'Inspect compliance dashboard', ar: 'تصفح مؤشرات الامتثال' },

  // Social Proof Section (Fictional Company: Wadi Al-Noor Trading Co.)
  socialProofBadge: { en: 'Illustrative Case Study', ar: 'قصة نجاح تجريبية' },
  socialProofHeading: {
    en: 'How Wadi Al-Noor Trading Co. simplified HR across 3 branches',
    ar: 'كيف نظمت شركة وادي النور التجارية عملياتها عبر ٣ فروع بالمملكة',
  },
  socialProofDisclaimer: {
    en: 'Fictional demo company used throughout this presentation to demonstrate platform capabilities.',
    ar: 'شركة افتراضية مستخدمة في هذا العرض لتوضيح كفاءة المنصة في معالجة سيناريوهات حقيقية.',
  },
  socialProofQuote: {
    en: '"Before iHR Platform, calculating monthly GOSI deductions and tracking Iqama renewals for 25 staff across Riyadh, Jeddah, and Dammam took 3 separate spreadsheets and constant anxiety. Now, payroll takes 3 minutes and our compliance is 100% visible."',
    ar: '«قبل استخدام منصة iHR، كان احتساب اشتراكات التأمينات ومتابعة تواريخ الإقامات لـ ٢٥ موظفاً في الرياض وجدة والدمام يستغرق أياماً من العمل اليدوي ومتابعة الجداول. اليوم، ننجز الرواتب في ٣ دقائق وامتثالنا مكشوف بالكامل أمامنا.»',
  },
  socialProofAuthorName: { en: 'Noura Al-Harbi', ar: 'نورة الحربي' },
  socialProofAuthorRole: {
    en: 'HR Director · Wadi Al-Noor Trading Co. (Riyadh)',
    ar: 'مديرة الموارد البشرية · شركة وادي النور التجارية (الرياض)',
  },
  stat1Value: { en: '25', ar: '٢٥' },
  stat1Label: { en: 'Employees managed', ar: 'موظفاً تحت الإدارة' },
  stat2Value: { en: '99.8%', ar: '٩٩.٨٪' },
  stat2Label: { en: 'On-time WPS payroll', ar: 'التزام بحماية الأجور' },
  stat3Value: { en: '0', ar: '٠' },
  stat3Label: { en: 'Iqama late penalties', ar: 'غرامات تأخير إقامات' },
  stat4Value: { en: '60%', ar: '٦٠٪' },
  stat4Label: { en: 'High Green Saudization', ar: 'توطين في النطاق الأخضر' },

  // Pricing Section (Gusto-style: Basic, Plus, Premium)
  pricingBadge: { en: 'Transparent Pricing', ar: 'باقات اشتراك واضحة' },
  pricingHeading: {
    en: 'Simple plans that grow with your Saudi enterprise',
    ar: 'خطط مدروسة تناسب نمو منشأتك في المملكة',
  },
  pricingSubheading: {
    en: 'No hidden setup fees. Billed in SAR per employee per month.',
    ar: 'بدون رسوم تأسيس خفية. احتساب شهري بالريال السعودي لكل موظف.',
  },
  pricingDisclaimer: {
    en: 'Illustrative pricing shown for concept demonstration purposes.',
    ar: 'أسعار تقديرية توضيحية لغرض العرض التجريبي فقط.',
  },
  pricingMonthly: { en: 'Monthly billing', ar: 'الدفع الشهري' },
  pricingAnnual: { en: 'Annual billing (Save 15%)', ar: 'الدفع السنوي (وفر ١٥٪)' },
  pricingPerEmployee: { en: 'SAR / employee / month', ar: 'ريال / موظف / شهرياً' },
  pricingRecommendedBadge: { en: 'Most Popular', ar: 'الأكثر اختياراً' },
  pricingEmployeesSlider: { en: 'Estimate cost for your team size:', ar: 'احسب التكلفة التقديرية لفريقك:' },
  pricingTeamSize: { en: '{count} employees', ar: '{count} موظف' },
  pricingEstMonthlyTotal: { en: 'Estimated: SAR {sar} / month', ar: 'المجموع التقديري: {sar} ريال / شهرياً' },

  // Tier 1: Basic
  tierBasicName: { en: 'Basic', ar: 'الأساسية' },
  tierBasicDesc: {
    en: 'Essential people directory, document management, and leave tracking for small teams.',
    ar: 'إدارة بيانات الموظفين، حفظ الوثائق، وتتبع الإجازات للمنشآت الناشئة.',
  },
  tierBasicPrice: { en: '20', ar: '٢٠' },
  tierBasicF1: { en: 'Up to 50 employee profiles', ar: 'حتى ٥٠ ملف موظف' },
  tierBasicF2: { en: 'Document & Iqama expiry notifications', ar: 'تنبيهات انتهاء الوثائق والإقامات' },
  tierBasicF3: { en: 'Leave management & holiday calendar', ar: 'إدارة الإجازات وتقويم العطلات' },
  tierBasicF4: { en: 'Bilingual mobile access (iOS & Android)', ar: 'دخول باللغتين عبر الجوال' },
  tierBasicCta: { en: 'Start with Basic', ar: 'اختر الباقة الأساسية' },

  // Tier 2: Plus
  tierPlusName: { en: 'Plus', ar: 'المتقدمة' },
  tierPlusDesc: {
    en: 'Full Saudi payroll with WPS bank SIF files, GOSI auto-deductions, and Saudization tracking.',
    ar: 'مسير الرواتب المكتمل بنظام حماية الأجور، واشتراكات التأمينات، ومتابعة نطاقات.',
  },
  tierPlusPrice: { en: '35', ar: '٣٥' },
  tierPlusF1: { en: 'Everything in Basic, plus:', ar: 'كل ما تشمله الباقة الأساسية، بالإضافة إلى:' },
  tierPlusF2: { en: '3-click WPS & Mudad compliant payroll', ar: 'مسير رواتب متوافق مع نظام مَدد وحماية الأجور' },
  tierPlusF3: { en: 'Automated GOSI & SANED calculation', ar: 'احتساب آلي لاشتراكات التأمينات الاجتماعية' },
  tierPlusF4: { en: 'Live Saudization & Nitaqat projections', ar: 'متابعة حية لنسب التوطين وتوقعات نطاقات' },
  tierPlusF5: { en: 'Digital payslips & employee requests', ar: 'قسائم رواتب رقمية وإدارة طلبات الموظفين' },
  tierPlusCta: { en: 'Try Plus in console', ar: 'جرّب المتقدمة باللوحة' },

  // Tier 3: Premium
  tierPremiumName: { en: 'Premium', ar: 'المؤسسات (بريميوم)' },
  tierPremiumDesc: {
    en: 'For growing companies needing AI talent acquisition, tailored workflows, and audit support.',
    ar: 'للشركات النامية التي تتطلب استقطاب كفاءات بالذكاء الاصطناعي ودعماً تنظيمياً متخصصاً.',
  },
  tierPremiumPrice: { en: '50', ar: '٥٠' },
  tierPremiumF1: { en: 'Everything in Plus, plus:', ar: 'كل ما تشمله الباقة المتقدمة، بالإضافة إلى:' },
  tierPremiumF2: { en: 'AI Candidate matching & swipe app access', ar: 'مطابقة المرشحين بالذكاء الاصطناعي وتطبيق الوظائف' },
  tierPremiumF3: { en: 'Custom approval chains & multi-branch rules', ar: 'سلاسل موافقات مخصصة وقواعد متعددة الفروع' },
  tierPremiumF4: { en: 'Audit-ready GOSI & WPS compliance reports', ar: 'تقارير تدقيق شاملة لحماية الأجور والتأمينات' },
  tierPremiumF5: { en: 'Priority dedicated HR advisor support', ar: 'مدير حساب مخصص واستشارات أنظمة عمل' },
  tierPremiumCta: { en: 'Explore Premium demo', ar: 'استكشف مزايا بريميوم' },

  // Role Picker / Demo Hub Section
  demoHubBadge: { en: 'Interactive Demo Experience', ar: 'جرّب المنصة مباشرة' },
  demoHubHeading: {
    en: 'Experience the platform from both perspectives',
    ar: 'جرّب التجربة من منظور أصحاب العمل والباحثين عن عمل',
  },
  demoHubSubheading: {
    en: 'Explore live scenarios with pre-loaded mock data. No sign-up required, runs entirely in your browser.',
    ar: 'تصفح بيانات واقعية لشركة سعودية بدون تسجيل أو إدخال بيانات. يعمل بالكامل داخل متصفحك.',
  },

  // CTA Band
  ctaBandHeading: {
    en: 'Ready to see the modern standard of Saudi HR?',
    ar: 'مستعد للاطلاع على الجيل الجديد من برمجيات الموارد البشرية؟',
  },
  ctaBandSubheading: {
    en: 'Walk into the live console or swipe through jobs right now with zero friction.',
    ar: 'ادخل مباشرة إلى لوحة تحكم المنشأة أو تصفح تطبيق الوظائف التفاعلي خلال ثوانٍ.',
  },
  ctaBandExploreConsole: { en: 'Open employer console', ar: 'افتح لوحة أصحاب العمل' },
  ctaBandSeeApp: { en: 'Open candidate app', ar: 'افتح تطبيق المرشحين' },

  // Marketing Footer
  footerAboutText: {
    en: 'iHR Platform is an unofficial concept demo demonstrating a Gusto-grade, Saudi-first HR and payroll management system coupled with an AI candidate matching engine.',
    ar: 'منصة iHR هي عرض تجريبي مفاهيمي يوضح إمكانية بناء نظام موارد بشرية ورواتب بمعايير عالمية متوافق كلياً مع أنظمة المملكة ومقترن بمحرك توظيف ذكي.',
  },
  footerQuickLinks: { en: 'Demo Navigation', ar: 'روابط العرض' },
  footerModules: { en: 'Platform Modules', ar: 'منظومات المنصة' },
  footerLegal: { en: 'Concept Disclaimer', ar: 'إخلاء المسؤولية' },
  footerAllRights: {
    en: 'Concept demo by {author}. All company and employee identities are fictional.',
    ar: 'عرض تجريبي من إعداد {author}. جميع أسماء الشركات والموظفين خيالية لأغراض العرض.',
  },
}
