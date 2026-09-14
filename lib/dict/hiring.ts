import type { LocalizedText } from '@/lib/types'

export const hiringDict: Record<string, LocalizedText> = {
  // Hiring hub / Jobs list
  hiringTitle: { en: 'Recruitment & Talent (ATS)', ar: 'التوظيف واستقطاب الكفاءات' },
  hiringSubtitle: {
    en: 'Manage open requisitions, review AI-matched candidates, and swipe inbound talent directly into onboarding.',
    ar: 'إدارة الوظائف المتاحة، مراجعة تطابق المرشحين بالذكاء الاصطناعي، ونقل الكفاءات مباشرة إلى التهيئة.',
  },
  openPositions: { en: 'Open positions', ar: 'الوظائف المتاحة' },
  activeCandidates: { en: 'Active candidates', ar: 'مرشحون نشطون' },
  daysOpen: { en: '{n}d open', ar: 'مفتوحة منذ {n} أيام' },
  viewPipeline: { en: 'View pipeline', ar: 'عرض المسار' },
  recruiterSwipe: { en: 'Recruiter swipe', ar: 'سحب التوظيف' },
  backToJobs: { en: 'All open jobs', ar: 'كافة الوظائف' },
  filterByJob: { en: 'Filter by job', ar: 'تصفية حسب الوظيفة' },
  searchCandidates: { en: 'Search candidates…', ar: 'ابحث عن مرشح…' },

  // Stages
  stageApplied: { en: 'Applied', ar: 'تم التقديم' },
  stageScreening: { en: 'Screening', ar: 'الفرز الأولي' },
  stageInterview: { en: 'Interview', ar: 'المقابلة' },
  stageOffer: { en: 'Offer', ar: 'عرض عمل' },
  stageHired: { en: 'Hired', ar: 'تم التوظيف' },
  stageRejected: { en: 'Rejected', ar: 'مستبعد' },

  // Kanban & Cards
  moveTo: { en: 'Move to…', ar: 'نقل إلى…' },
  matchScore: { en: 'Match', ar: 'تطابق' },
  matchedSkills: { en: 'Matched skills', ar: 'مهارات متطابقة' },
  missingSkills: { en: 'Missing skills', ar: 'مهارات مفقودة' },
  expectedSalary: { en: 'Expected salary', ar: 'الراتب المتوقع' },
  notesCount: { en: '{count} notes', ar: '{count} ملاحظات' },
  emptyColumn: { en: 'No candidates in this stage', ar: 'لا يوجد مرشحون في هذه المرحلة' },
  dragHint: { en: 'Drag card or use Move menu to transition', ar: 'اسحب البطاقة أو استخدم قائمة النقل' },

  // Candidate Drawer
  candidateDrawerTitle: { en: 'Candidate Profile', ar: 'ملف المرشح' },
  cvSummary: { en: 'CV & Experience Narrative', ar: 'ملخص السيرة الذاتية والخبرة' },
  recruiterNotes: { en: 'Recruiter Notes & Timeline', ar: 'ملاحظات وتحديثات فريق التوظيف' },
  noNotesYet: { en: 'No recruiter notes added yet.', ar: 'لا توجد ملاحظات مسجلة بعد.' },
  addNotePlaceholder: { en: 'Write a note about this candidate…', ar: 'اكتب ملاحظة حول تقييم المرشح…' },
  saveNote: { en: 'Post note', ar: 'حفظ الملاحظة' },
  contactInfo: { en: 'Contact information', ar: 'معلومات الاتصال' },
  appliedOnDate: { en: 'Applied on {date}', ar: 'قدّم بتاريخ {date}' },
  currentStage: { en: 'Current stage', ar: 'المرحلة الحالية' },

  // Hire Dialog
  hireCandidate: { en: 'Hire candidate', ar: 'توظيف المرشح' },
  hireDialogTitle: { en: 'Confirm Hire & Onboarding Handoff', ar: 'تأكيد التوظيف وبدء مرحلة التهيئة' },
  hireDialogDesc: {
    en: 'Hiring {name} will automatically create a new employee record with status "Onboarding" at Wadi Al-Noor Trading Co., instantly reflected on your HR dashboard.',
    ar: 'توظيف {name} سينشئ سجلاً لموظف جديد بحالة "قيد التهيئة" في شركة وادي النور التجارية وسيظهر فوراً في لوحة تحكم المنشأة.',
  },
  departmentAssignment: { en: 'Assign department:', ar: 'تعيين القسم:' },
  startingSalary: { en: 'Starting salary package (SAR):', ar: 'حزمة الراتب الشهري (ريال):' },
  confirmHire: { en: 'Confirm & Hand off to Onboarding', ar: 'تأكيد التوظيف والبدء بالتهيئة' },
  hireSuccessAlert: {
    en: '{name} successfully hired and added to onboarding roster!',
    ar: 'تم توظيف {name} بنجاح وإضافته إلى قائمة الموظفين قيد التهيئة!',
  },
  viewInDashboard: { en: 'Go to HR Dashboard', ar: 'الانتقال للوحة التحكم' },

  // Recruiter Swipe Deck
  swipeTitle: { en: 'Recruiter Fast-Review Swipe', ar: 'سحب التقييم السريع للمرشحين' },
  swipeSubtitle: {
    en: 'Swipe right to Shortlist (Screening) or left to Pass (Rejected). Seamlessly reviews inbound candidate submissions.',
    ar: 'اسحب لليمين للقبول المبدئي (فرز أولي) أو لليسار للاستبعاد. تصفح الطلبات الواردة بسرعة فائقة.',
  },
  swipeShortlist: { en: 'Shortlist', ar: 'قبول مبدئي' },
  swipePass: { en: 'Pass', ar: 'تخطي' },
  swipeUndo: { en: 'Undo', ar: 'تراجع' },
  swipeDeckEmpty: { en: 'All candidates reviewed!', ar: 'اكتملت مراجعة المتقدمين!' },
  swipeDeckEmptyHint: {
    en: 'There are no more unreviewed candidates in the Applied stage for this position.',
    ar: 'لا يوجد مرشحون غير مراجعين في مرحلة التقديم لهذه الوظيفة حالياً.',
  },
  backToPipeline: { en: 'Back to kanban pipeline', ar: 'العودة لمسار التوظيف' },
  keyboardControls: {
    en: 'Controls: Drag card, or press Right Arrow to Shortlist, Left Arrow to Pass.',
    ar: 'التحكم: اسحب البطاقة، أو اضغط السهم الأيمن للقبول المبدئي، والأيسر للتخطي.',
  },
  shortlistedCount: { en: 'Shortlisted', ar: 'مقبولون' },
  passedCount: { en: 'Passed', ar: 'مستبعدون' },
  remainingInDeck: { en: '{count} candidates in deck', ar: '{count} مرشحين متبقين' },
  ariaPassCandidate: { en: 'Pass on candidate', ar: 'استبعاد المرشح' },
  ariaUndoSwipe: { en: 'Undo last swipe', ar: 'التراجع عن السحب الأخير' },
  ariaShortlistCandidate: { en: 'Shortlist candidate', ar: 'قبول مبدئي للمرشح' },
  dragCardHint: { en: 'Drag card or use arrow keys to evaluate', ar: 'اسحب البطاقة أو استخدم مفاتيح الأسهم للتقييم' },
  openReqsHint: { en: 'Open requisitions', ar: 'طلبات توظيف مفتوحة' },
  syncedFromApp: { en: 'Synced from the candidate app', ar: 'مُزامنة من تطبيق الباحثين عن عمل' },
  handedToOnboarding: { en: 'Handed off to onboarding', ar: 'مُحوَّلون إلى التهيئة' },
  inScreeningInterview: { en: 'In screening & interview', ar: 'في الفرز والمقابلات' },
  screeningInterviewSplit: {
    en: '{screening} screening · {interview} interview',
    ar: '{screening} فرز · {interview} مقابلة',
  },
  dragToMove: { en: 'Drag to move between stages', ar: 'اسحب للنقل بين المراحل' },
  closeDrawer: { en: 'Close panel', ar: 'إغلاق اللوحة' },
  locationLabel: { en: 'Location', ar: 'الموقع' },
  hireSuccessDetail: {
    en: 'New employee record {id} was created with status {status}.',
    ar: 'تم إنشاء سجل موظف جديد {id} بحالة {status}.',
  },
  totalCandidates: { en: '{count} candidates in total', ar: '{count} مرشح إجمالاً' },
}
