import type { LocalizedText } from '@/lib/types'

export const employeeDict: Record<string, LocalizedText> = {
  // Navigation & Shell
  employeePortal: { en: 'Employee Portal', ar: 'بوابة الموظف الذاتية' },
  empNavHome: { en: 'Home', ar: 'الرئيسية' },
  empNavPayslips: { en: 'Payslips', ar: 'مسيرات الرواتب' },
  empNavLeave: { en: 'Time Off', ar: 'إجازاتي' },
  empNavLetters: { en: 'HR Letters', ar: 'خطابات الموارد' },
  empNavAssistant: { en: 'HR Assistant', ar: 'المساعد الذكي' },
  switchEmployeeUser: { en: 'Switch employee profile', ar: 'تبديل الموظف' },

  // Home Screen
  welcomeBackEmployee: { en: 'Welcome back, {name}', ar: 'أهلاً بك، {name}' },
  nextPayDayIn: { en: 'Next payday in {days} days', ar: 'يوم الراتب القادم خلال {days} يوماً' },
  payDateEstimated: { en: 'Pay Date: {date}', ar: 'تاريخ الإيداع: {date}' },
  estimatedNetSalary: { en: 'Estimated Net Pay', ar: 'صافي الراتب المتوقع' },
  myLeaveBalance: { en: 'Annual Leave Balance', ar: 'رصيد الإجازة السنوية' },
  daysAvailable: { en: '{days} days available', ar: '{days} يوماً متاحة' },
  documentExpiryAlert: { en: 'Document Status', ar: 'حالة الوثائق الرسمية' },
  iqamaExpiresIn: { en: 'Iqama expires in {days} days', ar: 'تنتهي الإقامة خلال {days} يوماً' },
  contractValidUntil: { en: 'Contract authenticated on Qiwa', ar: 'عقد العمل موثق عبر منصة قوى' },
  quickActions: { en: 'Quick Actions', ar: 'إجراءات سريعة' },

  // Payslips
  payslipsTitle: { en: 'My Payslips & Compensation', ar: 'كشوفات الرواتب الشهرية' },
  payslipsSubtitle: {
    en: 'Official monthly payslips reconciled with General Organization for Social Insurance (GOSI) deductions.',
    ar: 'كشوف الرواتب المعتمدة رسمياً والمطابقة لاستقطاعات التأمينات الاجتماعية (GOSI).',
  },
  viewPayslip: { en: 'View breakdown', ar: 'عرض التفاصيل' },
  downloadPayslip: { en: 'Print / Save PDF', ar: 'طباعة / حفظ PDF' },
  gosiDeductions: { en: 'GOSI Contribution (Employee)', ar: 'اشتراك التأمينات (الموظف)' },
  netTakeHome: { en: 'Net Take-Home', ar: 'صافي المبلغ المحول' },
  noPayslipsYet: { en: 'No completed payroll cycles yet.', ar: 'لا توجد كشوفات رواتب سابقة بعد.' },

  // Leave & Time Off
  myLeaveTitle: { en: 'Time Off & Balances', ar: 'أرصدة الإجازات والغياب' },
  myLeaveSubtitle: {
    en: 'Check your statutory leave balances under Saudi Labor Law and submit new requests to HR.',
    ar: 'متابعة أرصدة الإجازات النظامية وتقديم طلبات جديدة للإدارة مباشرة.',
  },
  submitLeaveRequest: { en: 'Request Time Off', ar: 'تقديم طلب إجازة' },
  myRequestsHistory: { en: 'My Requests History', ar: 'سجل طلباتي' },
  requestSentNotice: {
    en: 'Request submitted! It is now visible in the HR Console approval queue.',
    ar: 'تم إرسال الطلب بنجاح! يظهر الآن في سجل موافقات إدارة الموارد البشرية.',
  },

  // HR Letters
  lettersTitle: { en: 'Official HR Letters & Certificates', ar: 'الشهادات والخطابات الرسمية' },
  lettersSubtitle: {
    en: 'Instantly generate certified bilingual letters with verification QR code for banks, embassies, or government entities.',
    ar: 'إصدار خطابات تعريفية معتمدة ثنائية اللغة فورياً مع رمز التحقق للبنوك والسفارات والجهات الحكومية.',
  },
  letterTypeSalary: { en: 'Salary Certificate (Bank / Finance)', ar: 'شهادة تعريف بالراتب (للبنوك والتمويل)' },
  letterTypeExperience: { en: 'Service & Experience Certificate', ar: 'شهادة خبرة وخدمة' },
  letterTypeEmbassy: { en: 'Embassy Visa Introduction Letter', ar: 'خطاب تعريف للسفارات والتأشيرات' },
  letterAddressedTo: { en: 'Addressed To', ar: 'موجه إلى' },
  letterAddressedPlaceholder: { en: 'e.g. Al Rajhi Bank, French Embassy, To Whom It May Concern', ar: 'مثال: مصرف الراجحي، سفارة فرنسا، إلى من يهمه الأمر' },
  includeSalaryBreakdown: { en: 'Include monthly salary package breakdown', ar: 'تضمين تفاصيل الراتب والبدلات في الخطاب' },
  generateLetter: { en: 'Generate Official Letter', ar: 'إصدار الخطاب المعتمد' },
  printLetter: { en: 'Print Official Letter', ar: 'طباعة الخطاب الرسمي' },
  letterVerificationNotice: {
    en: 'This digital certificate is electronically sealed and verified in accordance with Saudi Labor Law standards.',
    ar: 'هذه الوثيقة صادرة ومختومة إلكترونياً ومعتمدة وفق اشتراكات وأنظمة العمل في المملكة العربية السعودية.',
  },

  // Scripted AI Assistant
  assistantTitle: { en: 'iHR Employee Assistant', ar: 'المساعد الذكي للموظف' },
  assistantSubtitle: {
    en: 'Ask questions about your leave balance, payday, company policy, and social insurance.',
    ar: 'اطرح أسئلتك حول رصيد إجازاتك، وموعد الراتب، وسياسات المنشأة، واشتراكات التأمينات.',
  },
  assistantDisclaimer: {
    en: 'Scripted Demo Assistant — answers generated dynamically from your employee record and Saudi Labor Law rules.',
    ar: 'مساعد تجريبي مبرمج — يجيب فورياً بناءً على بياناتك المسجلة وأنظمة العمل السعودية.',
  },
  promptPayday: { en: 'When is my next payday?', ar: 'متى موعد الراتب القادم؟' },
  promptLeave: { en: 'How many annual leave days do I have?', ar: 'كم رصيد إجازتي السنوية المتبقي؟' },
  promptGosi: { en: 'How much is deducted for GOSI?', ar: 'كم يستقطع مني للتأمينات الاجتماعية؟' },
  promptRamadan: { en: 'What are the Ramadan working hours?', ar: 'ما هي ساعات العمل في رمضان؟' },
  promptIqama: { en: 'When does my Iqama expire?', ar: 'متى تنتهي صلاحية إقامتي؟' },
}
