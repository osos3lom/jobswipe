import type { LocalizedText } from '@/lib/types'

export const payrollDict: Record<string, LocalizedText> = {
  // Payroll Hub
  payrollTitle: { en: 'Payroll', ar: 'الرواتب ومسيرات الدفع' },
  payrollSubtitle: {
    en: 'Review salaries, run monthly payroll, configure GOSI rates, and issue bilingual payslips.',
    ar: 'راجع الرواتب، واعتمد المسير الشهري، واضبط نسب التأمينات، وأصدر قسائم دفع ثنائية اللغة.',
  },
  currentPeriod: { en: 'Current pay cycle', ar: 'دورة الرواتب الحالية' },
  runPayrollCta: { en: 'Run payroll', ar: 'بدء مسير الرواتب' },
  viewCurrentRun: { en: 'View pay run', ar: 'عرض المسير' },
  statusDraft: { en: 'Draft', ar: 'مسودة' },
  statusSubmitted: { en: 'Completed', ar: 'مكتمل ومعتمد' },
  payDateLabel: { en: 'Payday', ar: 'تاريخ الصرف' },
  totalTransferred: { en: 'Net transfer total', ar: 'إجمالي الحوالات الصافية' },
  totalGrossPayroll: { en: 'Total gross payroll', ar: 'إجمالي الرواتب والبدلات' },
  totalCompanyCost: { en: 'Total employer cost', ar: 'إجمالي التكلفة على المنشأة' },
  totalGosiAmount: { en: 'Total GOSI contributions', ar: 'إجمالي اشتراكات التأمينات' },
  historicalRuns: { en: 'Past payroll runs', ar: 'سجل المسيرات السابقة' },
  noPastRuns: { en: 'No past payroll runs recorded.', ar: 'لا توجد مسيرات رواتب سابقة مسجلة.' },
  viewPayslips: { en: 'View payslips', ar: 'عرض القسائم' },
  periodHeader: { en: 'Pay period', ar: 'فترة الصرف' },
  employeesCount: { en: 'Employees', ar: 'الموظفون' },

  // GOSI Settings
  gosiSettingsTitle: { en: 'Social Insurance (GOSI) settings', ar: 'إعدادات التأمينات الاجتماعية (GOSI)' },
  gosiSettingsSubtitle: {
    en: 'Configurable rates applied to basic + housing. Illustrative demo rates — not legal advice.',
    ar: 'نسب قابلة للتعديل تُحتسب على الأساسي + بدل السكن. نسب توضيحية للعرض التجريبي وليست استشارة نظامية.',
  },
  gosiBadgeIllustrative: { en: 'Configurable & illustrative', ar: 'توضيحية وقابلة للتعديل' },
  gosiSaudiEmployeeRate: { en: 'Saudi employee share (Annuities + SANED)', ar: 'حصة الموظف السعودي (معاشات + ساند)' },
  gosiSaudiEmployerRate: { en: 'Saudi employer share (Annuities + Hazards + SANED)', ar: 'حصة المنشأة للسعودي (معاشات + أخطار + ساند)' },
  gosiExpatEmployeeRate: { en: 'Resident employee share', ar: 'حصة الموظف المقيم' },
  gosiExpatEmployerRate: { en: 'Resident employer share (Occupational hazards)', ar: 'حصة المنشأة للمقيم (أخطار مهنية)' },
  gosiMaxCap: { en: 'Contributory wage cap', ar: 'الحد الأعلى للأجر الخاضع للاشتراك' },
  editGosiRates: { en: 'Configure rates', ar: 'تعديل النسب' },
  saveRates: { en: 'Save rates', ar: 'حفظ النسب' },
  ratesSavedSuccess: { en: 'GOSI rates updated successfully', ar: 'تم تحديث نسب التأمينات بنجاح' },

  // Run Wizard
  wizardTitle: { en: 'Payroll run — {month}', ar: 'مسير رواتب شهر {month}' },
  step1Title: { en: '1. Review the team', ar: '١. مراجعة الفريق' },
  step1Desc: {
    en: 'Confirm who is getting paid and enter additions (overtime, bonuses) or deductions (unpaid leave).',
    ar: 'تأكيد المشمولين بالصرف وإدخال الإضافات (عمل إضافي، مكافآت) أو الخصومات (إجازات غير مدفوعة).',
  },
  step2Title: { en: '2. Review the money', ar: '٢. تدقيق الأرقام والتأمينات' },
  step2Desc: {
    en: 'Inspect per-employee gross, GOSI breakdown (Saudi vs non-Saudi), net amounts, and employer cost.',
    ar: 'تدقيق الراتب الإجمالي لكل موظف، وتفصيل التأمينات (سعودي وغير سعودي)، والصافي، وتكلفة المنشأة.',
  },
  step3Title: { en: '3. Submit & confirm', ar: '٣. الاعتماد والإصدار' },
  step3Desc: {
    en: 'Review the final summary, verify WPS transfer readiness, and submit the pay run.',
    ar: 'مراجعة الملخص النهائي، والتأكد من جاهزية ملف حماية الأجور (WPS)، واعتماد المسير.',
  },

  // Wizard Step 1: Adjustments
  includeInRun: { en: 'Include in run', ar: 'تضمين في المسير' },
  addAddition: { en: 'Add bonus / overtime', ar: 'إضافة مكافأة / إضافي' },
  addDeduction: { en: 'Add deduction', ar: 'إضافة حسم' },
  adjustmentAmount: { en: 'Amount (SAR)', ar: 'المبلغ (ريال)' },
  adjustmentReason: { en: 'Description / reason', ar: 'البيان / السبب' },
  adjAmountPlaceholder: { en: 'e.g. 1000', ar: 'مثال: ١٠٠٠' },
  adjReasonPlaceholder: { en: 'e.g. Q3 bonus or 10 hours', ar: 'مثال: مكافأة الربع الثالث أو ١٠ ساعات' },
  typeBonus: { en: 'Performance bonus', ar: 'مكافأة أداء' },
  typeOvertime: { en: 'Overtime', ar: 'عمل إضافي' },
  typeAllowance: { en: 'Allowance', ar: 'بدل استثنائي' },
  typeUnpaidLeave: { en: 'Unpaid leave', ar: 'إجازة بدون راتب' },
  typeAdvance: { en: 'Salary advance', ar: 'سلفة راتب' },
  typeViolation: { en: 'Deduction / penalty', ar: 'جزاء / حسم' },
  noAdjustments: { en: 'No adjustments', ar: 'لا توجد تسويات' },
  saveAdjustment: { en: 'Add', ar: 'إضافة' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  removeAdjustment: { en: 'Remove', ar: 'حذف' },

  // Wizard Step 2: Columns & running total
  runningSummary: { en: 'Run summary', ar: 'ملخص المسير' },
  saudiEmployeeTag: { en: 'Saudi (9.75% GOSI)', ar: 'سعودي (٩٫٧٥٪ تأمينات)' },
  expatEmployeeTag: { en: 'Expat (0% employee / 2% hazards)', ar: 'مقيم (٠٪ موظف / ٢٪ أخطار)' },
  colBasicHousingTransport: { en: 'Basic + Housing + Transport', ar: 'أساسي + سكن + نقل' },
  colGross: { en: 'Gross pay', ar: 'الإجمالي' },
  colGosiEmployee: { en: 'GOSI (Employee)', ar: 'تأمينات (الموظف)' },
  colDeductions: { en: 'Deductions', ar: 'الخصومات' },
  colNetPay: { en: 'Net pay', ar: 'صافي الراتب' },
  colGosiEmployer: { en: 'GOSI (Employer)', ar: 'تأمينات (المنشأة)' },
  colEmployerCost: { en: 'Total cost', ar: 'إجمالي التكلفة' },

  // Wizard Step 3 & Celebration
  wpsReadyTitle: { en: 'WPS compliance & direct transfer ready', ar: 'جاهز لنظام حماية الأجور (WPS) والتحويل المباشر' },
  wpsReadyDesc: {
    en: 'Pay file formatted for Saudi Wage Protection System via Riyad Bank corporate banking.',
    ar: 'ملف الرواتب مجهّز وفق متطلبات نظام حماية الأجور السعودي عبر بنك الرياض للشركات.',
  },
  submitPayRunButton: { en: 'Submit and authorize pay run', ar: 'اعتماد مسير الرواتب وإصدار القسائم' },
  submittingPayRun: { en: 'Submitting pay run…', ar: 'جارٍ اعتماد المسير…' },
  payrollSuccessTitle: { en: 'Payroll submitted successfully!', ar: 'تم اعتماد مسير الرواتب بنجاح!' },
  payrollSuccessDesc: {
    en: 'Pay run has been authorized. Direct debits scheduled and payslips are now available for all employees.',
    ar: 'تم اعتماد المسير وجدولة التحويلات البنكية، وقسائم الرواتب جاهزة الآن لجميع الموظفين.',
  },
  viewAllPayslipsBtn: { en: 'Browse generated payslips', ar: 'استعراض قسائم الرواتب الصادرة' },
  returnToPayrollHub: { en: 'Return to payroll overview', ar: 'العودة لصفحة الرواتب' },

  // Payslip
  payslipTitle: { en: 'Payslip', ar: 'قسيمة الراتب' },
  payslipSubtitle: { en: 'Official monthly pay statement', ar: 'كشف الراتب الشهري الرسمي' },
  printPayslip: { en: 'Print / Save PDF', ar: 'طباعة / حفظ كـ PDF' },
  crNumber: { en: 'CR: 1010894210 · Riyadh, KSA', ar: 'س.ت: ١٠١٠٨٩٤٢١٠ · الرياض، المملكة العربية السعودية' },
  employeeDetails: { en: 'Employee details', ar: 'بيانات الموظف' },
  earnings: { en: 'Earnings', ar: 'المستحقات' },
  deductions: { en: 'Deductions', ar: 'الاستقطاعات' },
  netPay: { en: 'Net pay', ar: 'صافي الراتب المستحق' },
  sarCurrency: { en: 'SAR', ar: 'ريال سعودي' },
  transferAccount: { en: 'Payment method', ar: 'طريقة الدفع' },
  bankTransferIban: { en: 'Direct deposit via WPS · IBAN ending in {last4}', ar: 'تحويل بنكي عبر نظام حماية الأجور · آيبان ينتهي بـ {last4}' },
  electronicDocNotice: {
    en: 'This document is electronically generated and certified by iHR Platform. No physical signature is required.',
    ar: 'هذه الوثيقة صادرة إلكترونيًا ومعتمدة من منصة iHR ولا تحتاج إلى توقيع خطي أو ختم ورقي.',
  },
  gregorianPeriod: { en: 'Gregorian period', ar: 'الفترة الميلادية' },
  hijriPeriod: { en: 'Hijri period', ar: 'الفترة الهجرية' },
}
