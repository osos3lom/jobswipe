import { daysFromToday, startOfToday, toISODate } from './dates'
import { createHiringSeed } from './hiring-seed'
import { DEFAULT_PAYROLL_SETTINGS, calculatePayrollLine, calculateRunTotals } from './payroll'
import type {
  Company,
  ContractStatus,
  Department,
  Employee,
  EmployeeBenefit,
  HrState,
  InsuranceTier,
  OnboardingTask,
  PayrollAdjustment,
  PayrollRun,
  PerformanceReview,
  TimeOffRequest,
} from './types'

// A fictional company for the demo. Every person, salary and email here is
// made up. Dates are stored as offsets from "today" so alerts (an Iqama that
// expires in 12 days, a hire who started last week) stay meaningful whenever
// the demo is opened.

export const departments: Department[] = [
  { id: 'exec', name: { en: 'Executive', ar: 'الإدارة التنفيذية' } },
  { id: 'hr', name: { en: 'Human Resources', ar: 'الموارد البشرية' } },
  { id: 'finance', name: { en: 'Finance', ar: 'المالية' } },
  { id: 'sales', name: { en: 'Sales', ar: 'المبيعات' } },
  { id: 'ops', name: { en: 'Operations & Logistics', ar: 'العمليات والخدمات اللوجستية' } },
  { id: 'it', name: { en: 'IT', ar: 'تقنية المعلومات' } },
  { id: 'cs', name: { en: 'Customer Service', ar: 'خدمة العملاء' } },
]

export type SeedRow = Omit<
  Employee,
  'hireDate' | 'iqamaExpiry' | 'email' | 'iban' | 'passportExpiry' | 'contractStatus' | 'contractExpiry'
> & {
  hiredDaysAgo: number
  iqamaInDays?: number
  passportInDays?: number
  contractStatus?: ContractStatus
  contractInDays?: number
}

export const rows: SeedRow[] = [
  { id: 'e01', name: { en: 'Abdulrahman Al-Qahtani', ar: 'عبدالرحمن القحطاني' }, title: { en: 'Chief Executive Officer', ar: 'الرئيس التنفيذي' }, department: 'exec', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 2900, salary: { basic: 38000, housing: 9500, transport: 3000 } },
  { id: 'e02', name: { en: 'Noura Al-Harbi', ar: 'نورة الحربي' }, title: { en: 'HR Director', ar: 'مديرة الموارد البشرية' }, department: 'hr', managerId: 'e01', nationality: 'SA', gender: 'female', city: 'riyadh', status: 'active', hiredDaysAgo: 2100, contractInDays: 25, salary: { basic: 22000, housing: 5500, transport: 2000 } },
  { id: 'e03', name: { en: 'Faisal Al-Otaibi', ar: 'فيصل العتيبي' }, title: { en: 'Finance Manager', ar: 'مدير المالية' }, department: 'finance', managerId: 'e01', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 1800, salary: { basic: 21000, housing: 5250, transport: 2000 } },
  { id: 'e04', name: { en: 'Khalid Al-Shehri', ar: 'خالد الشهري' }, title: { en: 'Sales Director', ar: 'مدير المبيعات' }, department: 'sales', managerId: 'e01', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 1650, salary: { basic: 24000, housing: 6000, transport: 2000 } },
  { id: 'e05', name: { en: 'Ahmed Hassan', ar: 'أحمد حسن' }, title: { en: 'Operations Manager', ar: 'مدير العمليات' }, department: 'ops', managerId: 'e01', nationality: 'EG', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 1500, iqamaInDays: 210, salary: { basic: 18000, housing: 4500, transport: 1500 } },
  { id: 'e06', name: { en: 'Rajesh Kumar', ar: 'راجيش كومار' }, title: { en: 'IT Manager', ar: 'مدير تقنية المعلومات' }, department: 'it', managerId: 'e01', nationality: 'IN', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 1200, iqamaInDays: 25, passportInDays: 45, salary: { basic: 19000, housing: 4750, transport: 1500 } },
  { id: 'e07', name: { en: 'Sara Al-Dosari', ar: 'سارة الدوسري' }, title: { en: 'HR Specialist', ar: 'أخصائية موارد بشرية' }, department: 'hr', managerId: 'e02', nationality: 'SA', gender: 'female', city: 'riyadh', status: 'active', hiredDaysAgo: 900, salary: { basic: 9500, housing: 2375, transport: 1000 } },
  { id: 'e08', name: { en: 'Mohammed Al-Ghamdi', ar: 'محمد الغامدي' }, title: { en: 'Payroll Accountant', ar: 'محاسب رواتب' }, department: 'finance', managerId: 'e03', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 1100, salary: { basic: 10500, housing: 2625, transport: 1000 } },
  { id: 'e09', name: { en: 'Omar Khalil', ar: 'عمر خليل' }, title: { en: 'Senior Accountant', ar: 'محاسب أول' }, department: 'finance', managerId: 'e03', nationality: 'JO', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 700, iqamaInDays: 140, salary: { basic: 12000, housing: 3000, transport: 1000 } },
  { id: 'e10', name: { en: 'Reem Al-Mutairi', ar: 'ريم المطيري' }, title: { en: 'Key Account Manager', ar: 'مديرة حسابات رئيسية' }, department: 'sales', managerId: 'e04', nationality: 'SA', gender: 'female', city: 'jeddah', status: 'active', hiredDaysAgo: 820, salary: { basic: 13000, housing: 3250, transport: 1200 } },
  { id: 'e11', name: { en: 'Turki Al-Zahrani', ar: 'تركي الزهراني' }, title: { en: 'Sales Executive', ar: 'تنفيذي مبيعات' }, department: 'sales', managerId: 'e04', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'onboarding', hiredDaysAgo: 12, contractStatus: 'pending', salary: { basic: 8500, housing: 2125, transport: 900 } },
  { id: 'e12', name: { en: 'Bilal Ahmed', ar: 'بلال أحمد' }, title: { en: 'Sales Executive', ar: 'تنفيذي مبيعات' }, department: 'sales', managerId: 'e04', nationality: 'PK', gender: 'male', city: 'dammam', status: 'active', hiredDaysAgo: 400, iqamaInDays: 58, salary: { basic: 7500, housing: 1875, transport: 900 } },
  { id: 'e13', name: { en: 'Maria Santos', ar: 'ماريا سانتوس' }, title: { en: 'Customer Service Lead', ar: 'قائدة فريق خدمة العملاء' }, department: 'cs', managerId: 'e04', nationality: 'PH', gender: 'female', city: 'riyadh', status: 'active', hiredDaysAgo: 1300, iqamaInDays: 12, salary: { basic: 8000, housing: 2000, transport: 800 } },
  { id: 'e14', name: { en: 'Hessa Al-Subaie', ar: 'حصة السبيعي' }, title: { en: 'Customer Service Agent', ar: 'موظفة خدمة عملاء' }, department: 'cs', managerId: 'e13', nationality: 'SA', gender: 'female', city: 'riyadh', status: 'active', hiredDaysAgo: 350, passportInDays: 18, salary: { basic: 6500, housing: 1625, transport: 700 } },
  { id: 'e15', name: { en: 'Yousef Al-Anazi', ar: 'يوسف العنزي' }, title: { en: 'Customer Service Agent', ar: 'موظف خدمة عملاء' }, department: 'cs', managerId: 'e13', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'on_leave', hiredDaysAgo: 600, salary: { basic: 6200, housing: 1550, transport: 700 } },
  { id: 'e16', name: { en: 'Lama Al-Rashid', ar: 'لمى الراشد' }, title: { en: 'Customer Service Agent', ar: 'موظفة خدمة عملاء' }, department: 'cs', managerId: 'e13', nationality: 'SA', gender: 'female', city: 'riyadh', status: 'active', hiredDaysAgo: 200, contractStatus: 'expired', contractInDays: -5, salary: { basic: 6200, housing: 1550, transport: 700 } },
  { id: 'e17', name: { en: 'Tariq Mahmoud', ar: 'طارق محمود' }, title: { en: 'Logistics Supervisor', ar: 'مشرف الخدمات اللوجستية' }, department: 'ops', managerId: 'e05', nationality: 'EG', gender: 'male', city: 'jeddah', status: 'active', hiredDaysAgo: 980, iqamaInDays: 95, salary: { basic: 9000, housing: 2250, transport: 1000 } },
  { id: 'e18', name: { en: 'Saad Al-Qarni', ar: 'سعد القرني' }, title: { en: 'Warehouse Coordinator', ar: 'منسق المستودع' }, department: 'ops', managerId: 'e05', nationality: 'SA', gender: 'male', city: 'jeddah', status: 'active', hiredDaysAgo: 450, passportInDays: -10, salary: { basic: 7000, housing: 1750, transport: 800 } },
  { id: 'e19', name: { en: 'Imran Sheikh', ar: 'عمران شيخ' }, title: { en: 'Delivery Driver', ar: 'سائق توصيل' }, department: 'ops', managerId: 'e17', nationality: 'PK', gender: 'male', city: 'jeddah', status: 'active', hiredDaysAgo: 1400, iqamaInDays: 180, salary: { basic: 4000, housing: 1000, transport: 500 } },
  { id: 'e20', name: { en: 'Vikram Nair', ar: 'فيكرام ناير' }, title: { en: 'Delivery Driver', ar: 'سائق توصيل' }, department: 'ops', managerId: 'e17', nationality: 'IN', gender: 'male', city: 'dammam', status: 'active', hiredDaysAgo: 760, iqamaInDays: -5, salary: { basic: 4000, housing: 1000, transport: 500 } },
  { id: 'e21', name: { en: 'Abdullah Al-Malki', ar: 'عبدالله المالكي' }, title: { en: 'Systems Administrator', ar: 'مسؤول أنظمة' }, department: 'it', managerId: 'e06', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 540, salary: { basic: 11000, housing: 2750, transport: 1000 } },
  { id: 'e22', name: { en: 'Priya Menon', ar: 'بريا مينون' }, title: { en: 'Software Developer', ar: 'مطورة برمجيات' }, department: 'it', managerId: 'e06', nationality: 'IN', gender: 'female', city: 'riyadh', status: 'active', hiredDaysAgo: 300, iqamaInDays: 300, salary: { basic: 12500, housing: 3125, transport: 1000 } },
  { id: 'e23', name: { en: 'Fahad Al-Juhani', ar: 'فهد الجهني' }, title: { en: 'Procurement Officer', ar: 'مسؤول مشتريات' }, department: 'ops', managerId: 'e05', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 260, salary: { basic: 8800, housing: 2200, transport: 900 } },
  { id: 'e24', name: { en: 'Dana Al-Shammari', ar: 'دانة الشمري' }, title: { en: 'Recruitment Specialist', ar: 'أخصائية توظيف' }, department: 'hr', managerId: 'e02', nationality: 'SA', gender: 'female', city: 'riyadh', status: 'active', hiredDaysAgo: 160, salary: { basic: 9000, housing: 2250, transport: 900 } },
  { id: 'e25', name: { en: 'Hassan Ali', ar: 'حسن علي' }, title: { en: 'Accountant', ar: 'محاسب' }, department: 'finance', managerId: 'e03', nationality: 'SY', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 480, iqamaInDays: 45, salary: { basic: 8500, housing: 2125, transport: 900 } },
]

// `.example` is a reserved TLD, so these addresses can never reach anyone.
function emailFor(nameEn: string) {
  const [first, ...rest] = nameEn.toLowerCase().replace(/[^a-z ]/g, '').split(' ')
  return `${first}.${rest.join('')}@wadialnoor.example`
}

const PAY_DAY = 27

// Metadata for a completed run N months before the current one.
function previousRunMeta(monthsBack: number) {
  const today = startOfToday()
  const base = new Date(today.getFullYear(), today.getMonth() - monthsBack, 1)
  const year = base.getFullYear()
  const month = base.getMonth()
  const periodMonth = year + '-' + String(month + 1).padStart(2, '0')
  const day = Math.min(PAY_DAY, new Date(year, month + 1, 0).getDate())
  return {
    id: 'run-' + periodMonth,
    periodMonth,
    payDate: toISODate(new Date(year, month, day)),
    submittedAt: new Date(year, month, day, 10, 15).toISOString(),
  }
}

export function createSeed(): HrState {
  const employees: Employee[] = rows.map(
    ({ hiredDaysAgo, iqamaInDays, passportInDays, contractStatus, contractInDays, ...row }, idx) => {
      const num = row.id.replace('e', '').padStart(2, '0')
      const iban = `SA03800000006080101675${num}`
      const pDays = passportInDays ?? (400 + idx * 25)
      const cStatus = contractStatus ?? 'authenticated'
      const cDays = contractInDays ?? (300 + idx * 15)

      return {
        ...row,
        email: emailFor(row.name.en),
        hireDate: daysFromToday(-hiredDaysAgo),
        iban,
        passportExpiry: daysFromToday(pDays),
        contractStatus: cStatus,
        contractExpiry: daysFromToday(cDays),
        ...(iqamaInDays !== undefined && { iqamaExpiry: daysFromToday(iqamaInDays) }),
      }
    },
  )

  const payrollSettings = { ...DEFAULT_PAYROLL_SETTINGS }

  // The most recently completed run
  const augLines = employees.map((emp) => {
    const additions: PayrollAdjustment[] = []
    const deductions: PayrollAdjustment[] = []
    if (emp.id === 'e08') {
      additions.push({
        id: 'adj-aug-01',
        type: 'overtime',
        amount: 1200,
        label: { en: 'Overtime (12 hrs)', ar: 'عمل إضافي (١٢ ساعة)' },
      })
    }
    if (emp.id === 'e19') {
      additions.push({
        id: 'adj-aug-02',
        type: 'bonus',
        amount: 500,
        label: { en: 'On-time delivery bonus', ar: 'مكافأة الالتزام بالمواعيد' },
      })
    }
    return calculatePayrollLine(emp, additions, deductions, payrollSettings)
  })
  const augTotals = calculateRunTotals(augLines)
  const augMeta = previousRunMeta(1)
  const augRun: PayrollRun = {
    id: augMeta.id,
    periodMonth: augMeta.periodMonth,
    payDate: augMeta.payDate,
    status: 'submitted',
    submittedAt: augMeta.submittedAt,
    lines: augLines,
    totals: augTotals,
  }

  // The run before that
  const julLines = employees.map((emp) => {
    return calculatePayrollLine(emp, [], [], payrollSettings)
  })
  const julTotals = calculateRunTotals(julLines)
  const julMeta = previousRunMeta(2)
  const julRun: PayrollRun = {
    id: julMeta.id,
    periodMonth: julMeta.periodMonth,
    payDate: julMeta.payDate,
    status: 'submitted',
    submittedAt: julMeta.submittedAt,
    lines: julLines,
    totals: julTotals,
  }

  // Time Off Requests
  const timeOffRequests: TimeOffRequest[] = [
    {
      id: 'req-01',
      employeeId: 'e07',
      type: 'annual',
      startDate: daysFromToday(5),
      endDate: daysFromToday(9),
      daysCount: 5,
      status: 'pending',
      reason: 'Annual family vacation to Abha and Asir region',
      createdAt: daysFromToday(-2),
    },
    {
      id: 'req-02',
      employeeId: 'e10',
      type: 'maternity',
      startDate: daysFromToday(14),
      endDate: daysFromToday(84),
      daysCount: 70,
      status: 'pending',
      reason: 'Statutory maternity leave (Saudi Labor Law Art. 151)',
      createdAt: daysFromToday(-1),
    },
    {
      id: 'req-03',
      employeeId: 'e15',
      type: 'sick',
      startDate: daysFromToday(-10),
      endDate: daysFromToday(4),
      daysCount: 14,
      status: 'approved',
      reason: 'Medical recovery following outpatient procedure (certified)',
      createdAt: daysFromToday(-12),
      reviewedAt: daysFromToday(-11),
      reviewedBy: 'e02',
    },
    {
      id: 'req-04',
      employeeId: 'e04',
      type: 'annual',
      startDate: daysFromToday(-20),
      endDate: daysFromToday(-11),
      daysCount: 10,
      status: 'approved',
      reason: 'Summer break with family',
      createdAt: daysFromToday(-25),
      reviewedAt: daysFromToday(-24),
      reviewedBy: 'e01',
    },
    {
      id: 'req-05',
      employeeId: 'e21',
      type: 'annual',
      startDate: daysFromToday(-45),
      endDate: daysFromToday(-42),
      daysCount: 4,
      status: 'approved',
      reason: 'Personal leave',
      createdAt: daysFromToday(-50),
      reviewedAt: daysFromToday(-49),
      reviewedBy: 'e06',
    },
    {
      id: 'req-06',
      employeeId: 'e12',
      type: 'marriage',
      startDate: daysFromToday(25),
      endDate: daysFromToday(29),
      daysCount: 5,
      status: 'pending',
      reason: 'Wedding ceremony (Saudi Labor Law Art. 113 statutory leave)',
      createdAt: daysFromToday(-3),
    },
  ]

  // Onboarding Tasks for Turki Al-Zahrani (e11)
  const onboardingTasks: OnboardingTask[] = [
    {
      id: 'ob-01',
      employeeId: 'e11',
      title: { en: 'Authenticate standardized contract on Qiwa platform', ar: 'توثيق العقد الموحد عبر منصة قوى' },
      description: { en: 'Digital authentication required by Ministry of Human Resources (HRSD).', ar: 'التوثيق الرقمي الإلزامي لوزارة الموارد البشرية.' },
      category: 'docs',
      owner: 'Sara Al-Dosari',
      completed: false,
      dueDate: daysFromToday(3),
    },
    {
      id: 'ob-02',
      employeeId: 'e11',
      title: { en: 'Issue medical insurance card via CCHI portal', ar: 'إصدار وثيقة التأمين الصحي عبر مجلس الضمان الصحي' },
      description: { en: 'Class B network enrollment with Tawuniya.', ar: 'إدراج الموظف في شبكة الفئة B لدى التعاونية.' },
      category: 'hr',
      owner: 'Sara Al-Dosari',
      completed: true,
      dueDate: daysFromToday(-1),
      completedAt: daysFromToday(-1),
    },
    {
      id: 'ob-03',
      employeeId: 'e11',
      title: { en: 'Upload national ID and verify salary IBAN certificate', ar: 'رفع الهوية الوطنية والتحقق من الآيبان البنكي' },
      description: { en: 'Ensure IBAN name exactly matches Ministry and GOSI records.', ar: 'التحقق من تطابق الاسم ورقم الآيبان مع سجلات التأمينات.' },
      category: 'docs',
      owner: 'Turki Al-Zahrani',
      completed: true,
      dueDate: daysFromToday(-3),
      completedAt: daysFromToday(-3),
    },
    {
      id: 'ob-04',
      employeeId: 'e11',
      title: { en: 'Setup MacBook, corporate email & sales CRM credentials', ar: 'تسليم جهاز العمل والبريد وصلاحيات نظام المبيعات' },
      description: { en: 'Hardware allocation and Google Workspace account configuration.', ar: 'تسليم العهدة التقنية وتفعيل البريد الإلكتروني ونظام CRM.' },
      category: 'it',
      owner: 'Rajesh Kumar',
      completed: false,
      dueDate: daysFromToday(1),
    },
    {
      id: 'ob-05',
      employeeId: 'e11',
      title: { en: '30-minute introductory sync with Sales Director', ar: 'جلسة تعريفية مع مدير المبيعات' },
      description: { en: 'Welcome session to review wholesale client territory in Riyadh.', ar: 'جلسة ترحيبية لاستعراض العملاء المستهدفين في منطقة الرياض.' },
      category: 'team',
      owner: 'Khalid Al-Shehri',
      completed: true,
      dueDate: daysFromToday(-2),
      completedAt: daysFromToday(-2),
    },
    {
      id: 'ob-06',
      employeeId: 'e11',
      title: { en: 'Review internal bylaws & sign safety policy acknowledgment', ar: 'الاطلاع على لائحة تنظيم العمل وسياسة السلامة' },
      description: { en: 'Complete required compliance reading in the employee portal.', ar: 'إتمام قراءة سياسات المنشأة وتوقيع إقرار الالتزام.' },
      category: 'hr',
      owner: 'Turki Al-Zahrani',
      completed: false,
      dueDate: daysFromToday(4),
    },
  ]

  // Benefits & CCHI Tiers
  const benefits: Record<string, EmployeeBenefit> = {}
  for (const emp of employees) {
    let tier: InsuranceTier = 'class_b'
    let network = 'Bupa Classic Care (Al-Hammadi, Dallah, Mouwasat)'
    let maxCoverageLimit = 250000
    let deductiblePercentage = 20
    let dependentsCount = 2

    if (emp.id === 'e01') {
      tier = 'vip'
      network = 'Tawuniya Gold Plus (King Faisal Specialist & VIP Centers)'
      maxCoverageLimit = 1000000
      deductiblePercentage = 0
      dependentsCount = 4
    } else if (['e02', 'e03', 'e04', 'e05', 'e06'].includes(emp.id)) {
      tier = 'class_a'
      network = 'Bupa Corporate Premier (Dr. Sulaiman Al-Habib, Kingdom Hospital)'
      maxCoverageLimit = 500000
      deductiblePercentage = 10
      dependentsCount = 3
    } else if (['e18', 'e19', 'e20'].includes(emp.id)) {
      tier = 'class_c'
      network = 'Tawuniya Essential Network (Al-Jazeera, Aster Sanad)'
      maxCoverageLimit = 150000
      deductiblePercentage = 20
      dependentsCount = 1
    }

    benefits[emp.id] = {
      employeeId: emp.id,
      insuranceTier: tier,
      network,
      dependentsCount,
      policyNumber: `CCHI-2026-${emp.id.toUpperCase()}-99`,
      deductiblePercentage,
      maxCoverageLimit,
    }
  }

  // Performance Reviews & SMART Goals
  const performanceReviews: PerformanceReview[] = [
    {
      id: 'perf-01',
      employeeId: 'e04',
      cycle: 'Q3 2026 Mid-Year Review',
      rating: 4.6,
      feedback:
        'Outstanding commercial leadership. Expanded key wholesale distribution partnerships across the Central Province by 28% while maintaining strong account margins.',
      reviewerId: 'e01',
      updatedAt: daysFromToday(-15),
      goals: [
        {
          id: 'g-01',
          title: { en: 'Expand wholesale accounts in Riyadh region', ar: 'توسيع شبكة موزعي الجملة في الرياض' },
          targetMetric: '+25% Q3 revenue',
          progress: 88,
          status: 'on_track',
        },
        {
          id: 'g-02',
          title: { en: 'Reduce payment collection cycle for key retailers', ar: 'تقليص دورة التحصيل لكبار عملاء التجزئة' },
          targetMetric: '< 45 days DSO',
          progress: 72,
          status: 'on_track',
        },
      ],
    },
    {
      id: 'perf-02',
      employeeId: 'e08',
      cycle: 'Q3 2026 Mid-Year Review',
      rating: 4.8,
      feedback:
        'Exceptional rigor in monthly payroll processing, zero WPS file rejections with corporate banking, and proactive GOSI contributory audit reconciliation.',
      reviewerId: 'e03',
      updatedAt: daysFromToday(-18),
      goals: [
        {
          id: 'g-03',
          title: { en: 'Achieve 100% on-time WPS SIF bank upload', ar: 'تحقيق التزام تام بنظام حماية الأجور (WPS)' },
          targetMetric: '100% on-time',
          progress: 100,
          status: 'completed',
        },
        {
          id: 'g-04',
          title: { en: 'Automate GOSI deductions reconciliation', ar: 'أتمتة مطابقة استقطاعات التأمينات الاجتماعية' },
          targetMetric: 'Zero discrepancies',
          progress: 90,
          status: 'on_track',
        },
      ],
    },
    {
      id: 'perf-03',
      employeeId: 'e10',
      cycle: 'Q3 2026 Mid-Year Review',
      rating: 4.3,
      feedback:
        'Strong client retention and excellent customer responsiveness across Western Province accounts. Met all key margin milestones for the quarter.',
      reviewerId: 'e04',
      updatedAt: daysFromToday(-10),
      goals: [
        {
          id: 'g-05',
          title: { en: 'Increase repeat order velocity from Jeddah accounts', ar: 'زيادة معدل تكرار طلبات عملاء جدة' },
          targetMetric: '+15% reorders',
          progress: 65,
          status: 'on_track',
        },
      ],
    },
    {
      id: 'perf-04',
      employeeId: 'e21',
      cycle: 'Q3 2026 Mid-Year Review',
      rating: 4.1,
      feedback:
        'Solid maintenance of internal server reliability and fast ticket resolution times for corporate warehouse staff.',
      reviewerId: 'e06',
      updatedAt: daysFromToday(-22),
      goals: [
        {
          id: 'g-06',
          title: { en: 'Maintain 99.9% internal systems uptime', ar: 'الحفاظ على جاهزية الأنظمة الداخلية بنسبة ٩٩.٩٪' },
          targetMetric: '99.9% uptime',
          progress: 99,
          status: 'completed',
        },
      ],
    },
  ]

  return {
    company: {
      name: { en: 'Wadi Al-Noor Trading Co.', ar: 'شركة وادي النور التجارية' },
      industry: { en: 'Wholesale & distribution', ar: 'تجارة الجملة والتوزيع' },
      city: 'riyadh',
      payDay: PAY_DAY,
      adminId: 'e02',
    },
    employees,
    payrollRuns: [augRun, julRun],
    payrollSettings,
    applicants: createHiringSeed(),
    timeOffRequests,
    onboardingTasks,
    benefits,
    performanceReviews,
    ramadanHoursEnabled: false,
  }
}

