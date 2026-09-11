import { daysFromToday } from './dates'
import { createHiringSeed } from './hiring-seed'
import { DEFAULT_PAYROLL_SETTINGS, calculatePayrollLine, calculateRunTotals } from './payroll'
import type { Company, Department, Employee, HrState, PayrollAdjustment, PayrollRun } from './types'

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

export type SeedRow = Omit<Employee, 'hireDate' | 'iqamaExpiry' | 'email'> & {
  hiredDaysAgo: number
  iqamaInDays?: number
}

export const rows: SeedRow[] = [
  { id: 'e01', name: { en: 'Abdulrahman Al-Qahtani', ar: 'عبدالرحمن القحطاني' }, title: { en: 'Chief Executive Officer', ar: 'الرئيس التنفيذي' }, department: 'exec', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 2900, salary: { basic: 38000, housing: 9500, transport: 3000 } },
  { id: 'e02', name: { en: 'Noura Al-Harbi', ar: 'نورة الحربي' }, title: { en: 'HR Director', ar: 'مديرة الموارد البشرية' }, department: 'hr', managerId: 'e01', nationality: 'SA', gender: 'female', city: 'riyadh', status: 'active', hiredDaysAgo: 2100, salary: { basic: 22000, housing: 5500, transport: 2000 } },
  { id: 'e03', name: { en: 'Faisal Al-Otaibi', ar: 'فيصل العتيبي' }, title: { en: 'Finance Manager', ar: 'مدير المالية' }, department: 'finance', managerId: 'e01', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 1800, salary: { basic: 21000, housing: 5250, transport: 2000 } },
  { id: 'e04', name: { en: 'Khalid Al-Shehri', ar: 'خالد الشهري' }, title: { en: 'Sales Director', ar: 'مدير المبيعات' }, department: 'sales', managerId: 'e01', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 1650, salary: { basic: 24000, housing: 6000, transport: 2000 } },
  { id: 'e05', name: { en: 'Ahmed Hassan', ar: 'أحمد حسن' }, title: { en: 'Operations Manager', ar: 'مدير العمليات' }, department: 'ops', managerId: 'e01', nationality: 'EG', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 1500, iqamaInDays: 210, salary: { basic: 18000, housing: 4500, transport: 1500 } },
  { id: 'e06', name: { en: 'Rajesh Kumar', ar: 'راجيش كومار' }, title: { en: 'IT Manager', ar: 'مدير تقنية المعلومات' }, department: 'it', managerId: 'e01', nationality: 'IN', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 1200, iqamaInDays: 25, salary: { basic: 19000, housing: 4750, transport: 1500 } },
  { id: 'e07', name: { en: 'Sara Al-Dosari', ar: 'سارة الدوسري' }, title: { en: 'HR Specialist', ar: 'أخصائية موارد بشرية' }, department: 'hr', managerId: 'e02', nationality: 'SA', gender: 'female', city: 'riyadh', status: 'active', hiredDaysAgo: 900, salary: { basic: 9500, housing: 2375, transport: 1000 } },
  { id: 'e08', name: { en: 'Mohammed Al-Ghamdi', ar: 'محمد الغامدي' }, title: { en: 'Payroll Accountant', ar: 'محاسب رواتب' }, department: 'finance', managerId: 'e03', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 1100, salary: { basic: 10500, housing: 2625, transport: 1000 } },
  { id: 'e09', name: { en: 'Omar Khalil', ar: 'عمر خليل' }, title: { en: 'Senior Accountant', ar: 'محاسب أول' }, department: 'finance', managerId: 'e03', nationality: 'JO', gender: 'male', city: 'riyadh', status: 'active', hiredDaysAgo: 700, iqamaInDays: 140, salary: { basic: 12000, housing: 3000, transport: 1000 } },
  { id: 'e10', name: { en: 'Reem Al-Mutairi', ar: 'ريم المطيري' }, title: { en: 'Key Account Manager', ar: 'مديرة حسابات رئيسية' }, department: 'sales', managerId: 'e04', nationality: 'SA', gender: 'female', city: 'jeddah', status: 'active', hiredDaysAgo: 820, salary: { basic: 13000, housing: 3250, transport: 1200 } },
  { id: 'e11', name: { en: 'Turki Al-Zahrani', ar: 'تركي الزهراني' }, title: { en: 'Sales Executive', ar: 'تنفيذي مبيعات' }, department: 'sales', managerId: 'e04', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'onboarding', hiredDaysAgo: 12, salary: { basic: 8500, housing: 2125, transport: 900 } },
  { id: 'e12', name: { en: 'Bilal Ahmed', ar: 'بلال أحمد' }, title: { en: 'Sales Executive', ar: 'تنفيذي مبيعات' }, department: 'sales', managerId: 'e04', nationality: 'PK', gender: 'male', city: 'dammam', status: 'active', hiredDaysAgo: 400, iqamaInDays: 58, salary: { basic: 7500, housing: 1875, transport: 900 } },
  { id: 'e13', name: { en: 'Maria Santos', ar: 'ماريا سانتوس' }, title: { en: 'Customer Service Lead', ar: 'قائدة فريق خدمة العملاء' }, department: 'cs', managerId: 'e04', nationality: 'PH', gender: 'female', city: 'riyadh', status: 'active', hiredDaysAgo: 1300, iqamaInDays: 12, salary: { basic: 8000, housing: 2000, transport: 800 } },
  { id: 'e14', name: { en: 'Hessa Al-Subaie', ar: 'حصة السبيعي' }, title: { en: 'Customer Service Agent', ar: 'موظفة خدمة عملاء' }, department: 'cs', managerId: 'e13', nationality: 'SA', gender: 'female', city: 'riyadh', status: 'active', hiredDaysAgo: 350, salary: { basic: 6500, housing: 1625, transport: 700 } },
  { id: 'e15', name: { en: 'Yousef Al-Anazi', ar: 'يوسف العنزي' }, title: { en: 'Customer Service Agent', ar: 'موظف خدمة عملاء' }, department: 'cs', managerId: 'e13', nationality: 'SA', gender: 'male', city: 'riyadh', status: 'on_leave', hiredDaysAgo: 600, salary: { basic: 6200, housing: 1550, transport: 700 } },
  { id: 'e16', name: { en: 'Lama Al-Rashid', ar: 'لمى الراشد' }, title: { en: 'Customer Service Agent', ar: 'موظفة خدمة عملاء' }, department: 'cs', managerId: 'e13', nationality: 'SA', gender: 'female', city: 'riyadh', status: 'active', hiredDaysAgo: 200, salary: { basic: 6200, housing: 1550, transport: 700 } },
  { id: 'e17', name: { en: 'Tariq Mahmoud', ar: 'طارق محمود' }, title: { en: 'Logistics Supervisor', ar: 'مشرف الخدمات اللوجستية' }, department: 'ops', managerId: 'e05', nationality: 'EG', gender: 'male', city: 'jeddah', status: 'active', hiredDaysAgo: 980, iqamaInDays: 95, salary: { basic: 9000, housing: 2250, transport: 1000 } },
  { id: 'e18', name: { en: 'Saad Al-Qarni', ar: 'سعد القرني' }, title: { en: 'Warehouse Coordinator', ar: 'منسق المستودع' }, department: 'ops', managerId: 'e05', nationality: 'SA', gender: 'male', city: 'jeddah', status: 'active', hiredDaysAgo: 450, salary: { basic: 7000, housing: 1750, transport: 800 } },
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

export function createSeed(): HrState {
  const employees = rows.map(({ hiredDaysAgo, iqamaInDays, ...row }) => ({
    ...row,
    email: emailFor(row.name.en),
    hireDate: daysFromToday(-hiredDaysAgo),
    ...(iqamaInDays !== undefined && { iqamaExpiry: daysFromToday(iqamaInDays) }),
  }))

  const payrollSettings = { ...DEFAULT_PAYROLL_SETTINGS }

  // Seed historical run for August 2026
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
  const augRun: PayrollRun = {
    id: 'run-2026-08',
    periodMonth: '2026-08',
    payDate: '2026-08-27',
    status: 'submitted',
    submittedAt: '2026-08-27T10:15:00Z',
    lines: augLines,
    totals: augTotals,
  }

  // Seed historical run for July 2026
  const julLines = employees.map((emp) => {
    return calculatePayrollLine(emp, [], [], payrollSettings)
  })
  const julTotals = calculateRunTotals(julLines)
  const julRun: PayrollRun = {
    id: 'run-2026-07',
    periodMonth: '2026-07',
    payDate: '2026-07-27',
    status: 'submitted',
    submittedAt: '2026-07-27T09:45:00Z',
    lines: julLines,
    totals: julTotals,
  }

  return {
    company: {
      name: { en: 'Wadi Al-Noor Trading Co.', ar: 'شركة وادي النور التجارية' },
      industry: { en: 'Wholesale & distribution', ar: 'تجارة الجملة والتوزيع' },
      city: 'riyadh',
      payDay: 27,
      adminId: 'e02',
    },
    employees,
    payrollRuns: [augRun, julRun],
    payrollSettings,
    applicants: createHiringSeed(),
  }
}
