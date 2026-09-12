import type { LocalizedText } from '@/lib/types'

export const complianceDict: Record<string, LocalizedText> = {
  // Navigation & Page Title
  complianceTitle: { en: 'Compliance Hub', ar: 'مركز الامتثال والأنظمة السعودية' },
  complianceSubtitle: {
    en: 'Track Saudization & Nitaqat band status, monitor document expiries, and export WPS salary files.',
    ar: 'متابعة نسبة التوطين ونطاقات، ومراقبة صلاحية الوثائق، وتصدير ملفات حماية الأجور (WPS).',
  },

  // KPI Overview Cards
  compKpiSaudization: { en: 'Saudization & Nitaqat', ar: 'نسبة التوطين ونطاقات' },
  compKpiSaudizationHint: { en: '{rate} · {band}', ar: '{rate} · {band}' },
  compKpiDocs: { en: 'Document Expiries', ar: 'تنبيهات الوثائق' },
  compKpiDocsHint: { en: '{expired} expired · {expiring} within 60 days', ar: '{expired} منتهية · {expiring} خلال ٦٠ يومًا' },
  compKpiWps: { en: 'WPS Salary File', ar: 'ملف حماية الأجور (WPS)' },
  compKpiWpsHint: { en: 'Ready for {period}', ar: 'جاهز لدورة {period}' },
  compKpiContracts: { en: 'Qiwa Contracts', ar: 'عقود العمل (منصة قوى)' },
  compKpiContractsHint: { en: '{auth}% authenticated · {pending} pending', ar: '{auth}٪ موثقة · {pending} قيد التوثيق' },

  // Nitaqat Band Meter
  nitaqatTitle: { en: 'Nitaqat Classification & Saudization', ar: 'تصنيف نطاقات ونسبة التوطين' },
  nitaqatDesc: {
    en: 'Real-time calculation against Ministry of Human Resources and Social Development (HRSD) illustrative thresholds for wholesale & distribution.',
    ar: 'احتساب فوري وفق النطاقات التوضيحية لوزارة الموارد البشرية والتنمية الاجتماعية لنشاط تجارة الجملة والتوزيع.',
  },
  nitaqatIllustrativeBadge: { en: 'Illustrative HRSD thresholds', ar: 'نسب توضيحية لوزارة الموارد البشرية' },
  currentStanding: { en: 'Current standing', ar: 'الوضع الحالي' },
  platinumStatusMessage: {
    en: 'Excellent! Your company is in the Platinum band. You can hire up to {buffer} additional resident employees before dropping to High Green.',
    ar: 'ممتاز! شركتك في النطاق البلاتيني. يمكنك توظيف حتى {buffer} مقيمين إضافيين قبل الانتقال للأخضر المرتفع.',
  },
  advanceBandMessage: {
    en: 'You need {hires} additional Saudi hires to advance to {nextBand}.',
    ar: 'تحتاج إلى تعيين {hires} موظفين سعوديين إضافيين للانتقال إلى {nextBand}.',
  },
  bandRed: { en: 'Red', ar: 'الأحمر' },
  bandLowGreen: { en: 'Low Green', ar: 'الأخضر المنخفض' },
  bandMediumGreen: { en: 'Medium Green', ar: 'الأخضر المتوسط' },
  bandHighGreen: { en: 'High Green', ar: 'الأخضر المرتفع' },
  bandPlatinum: { en: 'Platinum', ar: 'البلاتيني' },

  // Saudization Simulator
  simulatorTitle: { en: 'What-if hire simulator', ar: 'محاكي أثر التوظيف' },
  simulatorDesc: { en: 'Simulate the impact of new hires on your Nitaqat band.', ar: 'شاهد أثر التعيينات الجديدة على نطاق المنشأة فورياً.' },
  simAddSaudi: { en: 'Add Saudi hire (+1)', ar: 'إضافة موظف سعودي (+١)' },
  simAddExpat: { en: 'Add Resident hire (+1)', ar: 'إضافة موظف مقيم (+١)' },
  simReset: { en: 'Reset', ar: 'إعادة ضبط' },
  simProjectedRate: { en: 'Simulated rate: {rate} ({band})', ar: 'النسبة المتوقعة: {rate} ({band})' },

  // Document Expiry Tracker
  docTrackerTitle: { en: 'Document & Contract Expiry Tracker', ar: 'سجل متابعة صلاحية الوثائق والعقود' },
  docTrackerSubtitle: {
    en: 'Unified view of Iqamas, passports, and Qiwa employment contracts, prioritized by urgency.',
    ar: 'سجل موحّد لمتابعة هويات المقيمين وجوازات السفر وعقود قوى، مرتبة حسب الأولوية وتاريخ الانتهاء.',
  },
  filterAll: { en: 'All items', ar: 'الكل' },
  filterExpired: { en: 'Expired', ar: 'منتهية' },
  filterNext30: { en: 'Next 30 days', ar: 'خلال ٣٠ يوماً' },
  filterNext60: { en: 'Next 60 days', ar: 'خلال ٦٠ يوماً' },
  filterNext90: { en: 'Next 90 days', ar: 'خلال ٩٠ يوماً' },
  filterAllTypes: { en: 'All document types', ar: 'جميع أنواع الوثائق' },
  filterIqamaOnly: { en: 'Iqamas only', ar: 'الإقامات فقط' },
  filterPassportOnly: { en: 'Passports only', ar: 'جوازات السفر فقط' },
  filterContractOnly: { en: 'Qiwa contracts only', ar: 'عقود قوى فقط' },
  colDocType: { en: 'Document', ar: 'الوثيقة' },
  colDocNumber: { en: 'Doc number', ar: 'رقم الوثيقة' },
  colExpiryDate: { en: 'Expiry date', ar: 'تاريخ الانتهاء' },
  colDaysLeft: { en: 'Status / Days', ar: 'الحالة / الأيام' },
  noDocsMatching: { en: 'No documents match the selected filter criteria.', ar: 'لا توجد وثائق تطابق معايير التصفية المحددة.' },
  viewProfile: { en: 'View profile', ar: 'عرض الملف' },

  // WPS Export
  wpsExportTitle: { en: 'Wages Protection System (WPS / Mudad) Export', ar: 'تصدير ملف حماية الأجور (WPS / مُدد)' },
  wpsExportSubtitle: {
    en: 'Generate the standard Salary Information File (SIF) from your latest pay run for bank upload.',
    ar: 'توليد ملف معلومات الرواتب القياسي (SIF) من آخر مسير معتمد لرفعه إلى البنك أو منصة مُدد.',
  },
  wpsDisclaimer: {
    en: 'Illustrative sample layout formatted with UTF-8 BOM for Microsoft Excel. Non-routable IBANs for demonstration.',
    ar: 'تنسيق قياسي تجريبي بترميز UTF-8 BOM لبرنامج إكسل. أرقام الآيبان وهمية وغير قابلة للتحويل لأغراض العرض.',
  },
  wpsPayPeriod: { en: 'Payroll period', ar: 'فترة المسير' },
  wpsTotalNet: { en: 'Total net transfer', ar: 'إجمالي الحوالات' },
  wpsRecordsCount: { en: 'Salary records', ar: 'عدد السجلات' },
  wpsDownloadBtn: { en: 'Download WPS File (.csv)', ar: 'تحميل ملف حماية الأجور (.csv)' },
  wpsDownloadingBtn: { en: 'Generating CSV file…', ar: 'جارٍ توليد الملف…' },
  wpsDownloadedBtn: { en: 'Downloaded ({count} records)', ar: 'تم التحميل ({count} سجل)' },
  wpsPreviewTitle: { en: 'File format preview (SIF sample rows)', ar: 'معاينة هيكل الملف (نماذج أسطر SIF)' },
  wpsTogglePreview: { en: 'Toggle file preview', ar: 'معاينة محتوى الملف' },
}
