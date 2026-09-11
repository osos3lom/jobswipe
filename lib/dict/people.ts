import type { LocalizedText } from '@/lib/types'

export const peopleDict: Record<string, LocalizedText> = {
  // People list
  peopleTitle: { en: 'People', ar: 'الموظفون' },
  peopleSubtitle: {
    en: 'Search and filter company employees, track statuses, and view complete profiles.',
    ar: 'ابحث وصفِّ موظفي الشركة، وتابع الحالات، واطلع على الملفات الشخصية الكاملة.',
  },
  searchPlaceholder: {
    en: 'Search by name, title, or email…',
    ar: 'ابحث بالاسم، المسمى الوظيفي، أو البريد…',
  },
  filterDepartment: { en: 'Department', ar: 'القسم' },
  filterStatus: { en: 'Status', ar: 'الحالة' },
  filterNationality: { en: 'Nationality', ar: 'الجنسية' },
  filterCity: { en: 'City', ar: 'المدينة' },
  allDepartments: { en: 'All departments', ar: 'جميع الأقسام' },
  allStatuses: { en: 'All statuses', ar: 'جميع الحالات' },
  allNationalities: { en: 'All nationalities', ar: 'جميع الجنسيات' },
  allCities: { en: 'All cities', ar: 'جميع المدن' },
  filterSaudi: { en: 'Saudi citizens', ar: 'سعوديون' },
  filterNonSaudi: { en: 'Residents (Expat)', ar: 'مقيمون' },
  showingCount: { en: 'Showing {count} of {total} people', ar: 'عرض {count} من أصل {total} موظف' },
  clearFilters: { en: 'Clear filters', ar: 'إعادة ضبط التصفية' },
  noPeopleFound: { en: 'No people match your filters', ar: 'لم يتم العثور على موظفين يطابقون خيارات التصفية' },
  noPeopleFoundHint: {
    en: 'Try clearing some filters or searching for a different keyword.',
    ar: 'جرّب إلغاء بعض المرشحات أو البحث بكلمة أخرى.',
  },

  // Table columns
  colPerson: { en: 'Person', ar: 'الموظف' },
  colTitle: { en: 'Title', ar: 'المسمى الوظيفي' },
  colDepartment: { en: 'Department', ar: 'القسم' },
  colHireDate: { en: 'Hire date', ar: 'تاريخ التعيين' },
  colStatus: { en: 'Status', ar: 'الحالة' },
  colSalary: { en: 'Total salary', ar: 'الراتب الإجمالي' },

  // Statuses
  statusActive: { en: 'Active', ar: 'على رأس العمل' },
  statusOnLeave: { en: 'On leave', ar: 'في إجازة' },
  statusOnboarding: { en: 'Onboarding', ar: 'قيد التهيئة' },

  // Cities
  cityRiyadh: { en: 'Riyadh', ar: 'الرياض' },
  cityJeddah: { en: 'Jeddah', ar: 'جدة' },
  cityDammam: { en: 'Dammam', ar: 'الدمام' },

  // Person profile
  backToPeople: { en: 'Back to people', ar: 'العودة للموظفين' },
  employeeProfile: { en: 'Employee profile', ar: 'الملف الوظيفي' },
  tenure: { en: 'Tenure', ar: 'مدة الخدمة' },
  contactInfo: { en: 'Contact information', ar: 'معلومات التواصل' },
  emailAddress: { en: 'Work email', ar: 'البريد المهني' },
  workLocation: { en: 'Work location', ar: 'مقر العمل' },
  departmentAndRole: { en: 'Department & role', ar: 'القسم والدور' },

  // Salary breakdown
  salaryBreakdown: { en: 'Compensation & salary breakdown', ar: 'تفاصيل الراتب والبدلات' },
  salaryBreakdownSaudiNote: {
    en: 'Saudi standard 3-part split: Basic salary, Housing allowance, and Transportation allowance.',
    ar: 'الهيكل القياسي السعودي ثلاثي التقسيم: الراتب الأساسي، بدل السكن، وبدل النقل.',
  },
  basicSalary: { en: 'Basic salary', ar: 'الراتب الأساسي' },
  housingAllowance: { en: 'Housing allowance', ar: 'بدل السكن' },
  transportAllowance: { en: 'Transport allowance', ar: 'بدل النقل' },
  totalGrossSalary: { en: 'Total gross salary', ar: 'إجمالي الراتب' },
  gosiEmployeeShare: { en: 'Social Insurance (GOSI employee share)', ar: 'التأمينات الاجتماعية (حصة الموظف)' },
  gosiEmployerShare: { en: 'Social Insurance (GOSI employer share)', ar: 'التأمينات الاجتماعية (حصة المنشأة)' },
  estimatedNetSalary: { en: 'Estimated net monthly pay', ar: 'صافي الراتب الشهري التقديري' },
  viewLatestPayslip: { en: 'View latest payslip', ar: 'عرض قسيمة الراتب الأخيرة' },

  // Management & Hierarchy
  manager: { en: 'Manager', ar: 'المدير المباشر' },
  noManager: { en: 'No direct manager (Executive)', ar: 'لا يوجد مدير مباشر (إدارة عليا)' },
  directReports: { en: 'Direct reports', ar: 'فريق العمل التابع' },
  noDirectReports: { en: 'No direct reports', ar: 'لا يوجد موظفون تابعون' },

  // Documents
  documentsTitle: { en: 'Documents & compliance', ar: 'الوثائق والامتثال' },
  nationalIdCard: { en: 'National ID (Saudi Citizen)', ar: 'الهوية الوطنية (مواطن سعودي)' },
  iqamaCard: { en: 'Resident Identity (Iqama)', ar: 'هوية مقيم (إقامة)' },
  verifiedGosi: { en: 'GOSI registered', ar: 'مسجل في التأمينات' },
  activeInsurance: { en: 'Health insurance (Class A)', ar: 'التأمين الطبي (الفئة أ)' },
  validDoc: { en: 'Valid', ar: 'سارية' },
  expiringSoon: { en: 'Expiring soon', ar: 'تقارب الانتهاء' },
  expired: { en: 'Expired', ar: 'منتهية' },
}
