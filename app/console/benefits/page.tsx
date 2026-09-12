'use client'

import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  HelpCircle,
  Info,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'
import { useHr } from '@/lib/hr/store'
import type { Employee, InsuranceTier, SeparationReason } from '@/lib/hr/types'
import { calculateEosb } from '@/lib/hr/eosb'
import { formatDate, formatNumber, formatSAR } from '@/lib/hr/format'
import { startOfToday, toISODate } from '@/lib/hr/dates'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function BenefitsPage() {
  const { t, tx, lang } = useI18n()
  const { employees, benefits } = useHr()

  const [activeTab, setActiveTab] = useState<'eosb' | 'insurance'>('eosb')

  // EOSB Calculator state
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id ?? 'e01')
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [customYears, setCustomYears] = useState(6.5)
  const [customBasic, setCustomBasic] = useState(15000)
  const [customHousing, setCustomHousing] = useState(3750)
  const [separationReason, setSeparationReason] = useState<SeparationReason>('resignation')

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === selectedEmpId) ?? employees[0],
    [employees, selectedEmpId],
  )

  const eosbResult = useMemo(() => {
    if (isCustomMode) {
      const basic = Math.max(0, customBasic)
      const housing = Math.max(0, customHousing)
      const monthlyWage = basic + housing
      const first5 = Math.min(5, customYears)
      const tier1 = first5 * (monthlyWage * 0.5)
      const beyond5 = Math.max(0, customYears - 5)
      const tier2 = beyond5 * monthlyWage
      const gross = tier1 + tier2

      let mult = 1
      if (separationReason === 'resignation') {
        if (customYears < 2) mult = 0
        else if (customYears < 5) mult = 1 / 3
        else if (customYears < 10) mult = 2 / 3
        else mult = 1
      }
      const net = Math.round(gross * mult)

      return {
        serviceYears: Math.floor(customYears),
        serviceMonths: Math.floor((customYears % 1) * 12),
        serviceDays: 0,
        totalYearsFraction: Math.round(customYears * 10) / 10,
        monthlyWage,
        tier1Amount: Math.round(tier1),
        tier2Amount: Math.round(tier2),
        grossEosb: Math.round(gross),
        resignationMultiplier: Math.round(mult * 100) / 100,
        separationReason,
        netEosb: net,
        isIllustrative: true,
      }
    }

    if (!selectedEmployee) {
      return {
        serviceYears: 0,
        serviceMonths: 0,
        serviceDays: 0,
        totalYearsFraction: 0,
        monthlyWage: 0,
        tier1Amount: 0,
        tier2Amount: 0,
        grossEosb: 0,
        resignationMultiplier: 1,
        separationReason,
        netEosb: 0,
        isIllustrative: true,
      }
    }

    return calculateEosb({
      hireDate: selectedEmployee.hireDate,
      endDate: startOfToday(),
      basicSalary: selectedEmployee.salary.basic,
      housingAllowance: selectedEmployee.salary.housing,
      separationReason,
    })
  }, [
    isCustomMode,
    customYears,
    customBasic,
    customHousing,
    selectedEmployee,
    separationReason,
  ])

  // CCHI Insurance Tier stats
  const tierCounts = useMemo(() => {
    const counts: Record<InsuranceTier, number> = {
      vip: 0,
      class_a: 0,
      class_b: 0,
      class_c: 0,
    }
    Object.values(benefits).forEach((b) => {
      if (b.insuranceTier in counts) {
        counts[b.insuranceTier]++
      }
    })
    return counts
  }, [benefits])

  const CCHI_TIERS_CONFIG: {
    tier: InsuranceTier
    name: { en: string; ar: string }
    network: { en: string; ar: string }
    maxCoverage: number
    deductible: number
    badgeColor: string
  }[] = [
    {
      tier: 'vip',
      name: { en: 'VIP Executive', ar: 'فئة كبار التنفيذيين (VIP)' },
      network: {
        en: 'Tawuniya Gold Plus (King Faisal Specialist & VIP Medical Centers)',
        ar: 'التعاونية بلس الذهبية (مستشفى الملك فيصل التخصصي والمراكز الممتازة)',
      },
      maxCoverage: 1000000,
      deductible: 0,
      badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    },
    {
      tier: 'class_a',
      name: { en: 'Class A Premier', ar: 'الفئة أ (Class A Premier)' },
      network: {
        en: 'Bupa Corporate Premier (Dr. Sulaiman Al-Habib & Kingdom Hospital)',
        ar: 'بوبا بريمير (مستشفيات د. سليمان الحبيب ومستشفى المملكة)',
      },
      maxCoverage: 500000,
      deductible: 10,
      badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
    },
    {
      tier: 'class_b',
      name: { en: 'Class B Standard', ar: 'الفئة ب (Class B Standard)' },
      network: {
        en: 'Bupa Classic Care (Al-Hammadi, Dallah, Mouwasat Hospitals)',
        ar: 'بوبا كلاسيك (مستشفيات الحمادي ودله والمواساة)',
      },
      maxCoverage: 250000,
      deductible: 20,
      badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    },
    {
      tier: 'class_c',
      name: { en: 'Class C Essential', ar: 'الفئة ج (Class C Essential)' },
      network: {
        en: 'Tawuniya Essential Network (Al-Jazeera, Aster Sanad, Care Clinics)',
        ar: 'التعاونية الأساسية (مستشفى الجزيرة وأستر سند ومجمعات الرعاية)',
      },
      maxCoverage: 150000,
      deductible: 20,
      badgeColor: 'bg-success/10 text-success border-success/20',
    },
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('benefitsTitle')}
            </h1>
            <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success border border-success/20">
              {t('illustrativeNotice')}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('benefitsSubtitle')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('eosb')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition',
            activeTab === 'eosb'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
          )}
        >
          <Scale className="h-4 w-4" />
          <span>{t('eosbCalcTitle')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('insurance')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition',
            activeTab === 'insurance'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
          )}
        >
          <HeartPulse className="h-4 w-4" />
          <span>{t('cchiTiersTitle')}</span>
        </button>
      </div>

      {/* TAB 1: EOSB STATUTORY CALCULATOR */}
      {activeTab === 'eosb' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column: Calculator Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h2 className="text-sm font-bold text-foreground">
                    {lang === 'ar' ? 'إعدادات الاحتساب' : 'Calculation Parameters'}
                  </h2>
                  <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setIsCustomMode(false)}
                      className={cn(
                        'px-2.5 py-1 rounded-md transition font-medium',
                        !isCustomMode ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground',
                      )}
                    >
                      {lang === 'ar' ? 'سجل الموظف' : 'Employee'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCustomMode(true)}
                      className={cn(
                        'px-2.5 py-1 rounded-md transition font-medium',
                        isCustomMode ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground',
                      )}
                    >
                      {t('customCalculation')}
                    </button>
                  </div>
                </div>

                {!isCustomMode ? (
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      {t('selectEmployee')}
                    </label>
                    <select
                      value={selectedEmpId}
                      onChange={(e) => setSelectedEmpId(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {tx(emp.name)} — {tx(emp.title)}
                        </option>
                      ))}
                    </select>

                    {selectedEmployee && (
                      <div className="mt-3 rounded-xl bg-muted/30 p-3 space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>{lang === 'ar' ? 'تاريخ المباشرة' : 'Hire Date'}:</span>
                          <span className="font-semibold text-foreground">{formatDate(selectedEmployee.hireDate, lang)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'ar' ? 'الراتب الأساسي' : 'Basic Salary'}:</span>
                          <span className="font-semibold text-foreground">{formatSAR(selectedEmployee.salary.basic, lang)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'ar' ? 'بدل السكن' : 'Housing Allowance'}:</span>
                          <span className="font-semibold text-foreground">{formatSAR(selectedEmployee.salary.housing, lang)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <label className="font-semibold text-foreground">
                          {t('tenureDuration')} ({customYears} {t('yearsLabel')})
                        </label>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="25"
                        step="0.5"
                        value={customYears}
                        onChange={(e) => setCustomYears(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        {lang === 'ar' ? 'الراتب الأساسي (ريال)' : 'Basic Salary (SAR)'}
                      </label>
                      <input
                        type="number"
                        step="500"
                        value={customBasic}
                        onChange={(e) => setCustomBasic(parseInt(e.target.value) || 0)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        {lang === 'ar' ? 'بدل السكن (ريال)' : 'Housing Allowance (SAR)'}
                      </label>
                      <input
                        type="number"
                        step="250"
                        value={customHousing}
                        onChange={(e) => setCustomHousing(parseInt(e.target.value) || 0)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Separation Reason Selector */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    {t('separationReason')}
                  </label>
                  <select
                    value={separationReason}
                    onChange={(e) => setSeparationReason(e.target.value as SeparationReason)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="resignation">{t('reasonResignation')}</option>
                    <option value="contract_expiry">{t('reasonContractExpiry')}</option>
                    <option value="termination">{t('reasonTermination')}</option>
                    <option value="force_majeure">{t('reasonForceMajeure')}</option>
                  </select>
                </div>
              </div>

              {/* Statutory Disclosure Alert */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>{lang === 'ar' ? 'سند مواد نظام العمل السعودي' : 'Statutory Articles'}</span>
                </div>
                <p className="leading-relaxed">
                  {t('eosbLegalNotice')}
                </p>
              </div>
            </div>

            {/* Right Column: Result Card & Mathematical Breakdown */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {lang === 'ar' ? 'النتيجة النظامية التقديرية' : 'Estimated Statutory Result'}
                    </span>
                    <h3 className="text-xl font-bold text-foreground">
                      {t('payableEosbAmount')}
                    </h3>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-success">
                    {formatSAR(eosbResult.netEosb, lang)}
                  </div>
                </div>

                {/* Service Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-muted/40 p-3">
                    <span className="text-xs text-muted-foreground block">{t('tenureDuration')}:</span>
                    <span className="text-sm font-bold text-foreground">
                      {eosbResult.serviceYears} {t('yearsLabel')}, {eosbResult.serviceMonths} {t('monthsLabel')}
                    </span>
                  </div>

                  <div className="rounded-xl bg-muted/40 p-3">
                    <span className="text-xs text-muted-foreground block">{t('monthlyWageBase')}:</span>
                    <span className="text-sm font-bold text-foreground">
                      {formatSAR(eosbResult.monthlyWage, lang)}
                    </span>
                  </div>

                  <div className="rounded-xl bg-muted/40 p-3 col-span-2 sm:col-span-1">
                    <span className="text-xs text-muted-foreground block">{t('article85Multiplier')}:</span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {Math.round(eosbResult.resignationMultiplier * 100)}%
                    </span>
                  </div>
                </div>

                {/* Step-by-Step Breakdown Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {lang === 'ar' ? 'تفصيل استحقاق المادة ٨٤ (الأساس)' : 'Article 84 Base Calculation'}
                  </h4>

                  <div className="divide-y divide-border rounded-xl border border-border bg-background text-xs sm:text-sm">
                    <div className="flex items-center justify-between p-3">
                      <div>
                        <div className="font-semibold text-foreground">{t('article84Tier1')}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.min(5, eosbResult.totalYearsFraction)} {t('yearsLabel')} × 0.5 × {formatSAR(eosbResult.monthlyWage, lang)}
                        </div>
                      </div>
                      <span className="font-bold text-foreground">
                        {formatSAR(eosbResult.tier1Amount, lang)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3">
                      <div>
                        <div className="font-semibold text-foreground">{t('article84Tier2')}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.max(0, Math.round((eosbResult.totalYearsFraction - 5) * 10) / 10)} {t('yearsLabel')} × 1.0 × {formatSAR(eosbResult.monthlyWage, lang)}
                        </div>
                      </div>
                      <span className="font-bold text-foreground">
                        {formatSAR(eosbResult.tier2Amount, lang)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/20 font-semibold">
                      <span>{t('article84BaseAward')}</span>
                      <span className="font-bold text-foreground">{formatSAR(eosbResult.grossEosb, lang)}</span>
                    </div>
                  </div>
                </div>

                {/* Article 85 Resignation Reduction Step */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {lang === 'ar' ? 'أثر سبب الانتهاء (المادة ٨٥)' : 'Article 85 Resignation Adjustment'}
                  </h4>

                  <div className="rounded-xl border border-border bg-background p-3.5 text-xs sm:text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{lang === 'ar' ? 'النسبة المستحقة بعد تطبيق المادة ٨٥:' : 'Entitled Ratio under Art. 85:'}</span>
                      <span className="font-bold text-foreground">
                        {Math.round(eosbResult.resignationMultiplier * 100)}%
                        {eosbResult.separationReason === 'resignation' && (
                          <span className="text-xs text-muted-foreground font-normal mx-1">
                            ({eosbResult.totalYearsFraction < 2 ? (lang === 'ar' ? 'أقل من سنتين' : '< 2 yrs') :
                              eosbResult.totalYearsFraction < 5 ? (lang === 'ar' ? 'ثلث المكافأة' : '1/3 award') :
                              eosbResult.totalYearsFraction < 10 ? (lang === 'ar' ? 'ثلثا المكافأة' : '2/3 award') :
                              (lang === 'ar' ? 'المكافأة كاملة' : 'Full award')})
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-2 text-sm font-bold">
                      <span className="text-foreground">{t('payableEosbAmount')}</span>
                      <span className="text-success text-base">
                        {formatSAR(eosbResult.netEosb, lang)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CCHI MEDICAL INSURANCE TIERS */}
      {activeTab === 'insurance' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CCHI_TIERS_CONFIG.map((tierCfg) => {
              const count = tierCounts[tierCfg.tier]
              return (
                <div
                  key={tierCfg.tier}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-semibold border',
                          tierCfg.badgeColor,
                        )}
                      >
                        {tx(tierCfg.name)}
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {count} {lang === 'ar' ? 'موظف' : 'staff'}
                      </span>
                    </div>

                    <div className="pt-2 text-xs text-muted-foreground space-y-1.5">
                      <div>
                        <span className="block font-medium text-foreground">{t('networkHospital')}:</span>
                        <p className="leading-snug">{tx(tierCfg.network)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('maxCoverageLimit')}:</span>
                      <span className="font-bold text-foreground">{formatSAR(tierCfg.maxCoverage, lang)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('copayDeductible')}:</span>
                      <span className="font-bold text-foreground">{tierCfg.deductible}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Employee Directory Insurance Table */}
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                {lang === 'ar' ? 'سجل تأمين موظفي المنشأة' : 'Employee Insurance Register'}
              </h3>
              <span className="text-xs text-muted-foreground">
                {employees.length} {lang === 'ar' ? 'وثيقة نشطة' : 'active policies'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs sm:text-sm">
                <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4 text-start font-medium">{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                    <th className="py-3 px-4 text-start font-medium">{lang === 'ar' ? 'فئة التأمين (CCHI)' : 'Insurance Tier'}</th>
                    <th className="py-3 px-4 text-start font-medium">{lang === 'ar' ? 'رقم الوثيقة' : 'Policy #'}</th>
                    <th className="py-3 px-4 text-start font-medium">{t('networkHospital')}</th>
                    <th className="py-3 px-4 text-start font-medium">{lang === 'ar' ? 'المعالون' : 'Dependents'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {employees.map((emp) => {
                    const benefit = benefits[emp.id]
                    return (
                      <tr key={emp.id} className="hover:bg-muted/30 transition">
                        <td className="py-3 px-4">
                          <div className="font-medium text-foreground">{tx(emp.name)}</div>
                          <div className="text-xs text-muted-foreground">{tx(emp.title)}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase',
                              benefit?.insuranceTier === 'vip' && 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
                              benefit?.insuranceTier === 'class_a' && 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
                              benefit?.insuranceTier === 'class_b' && 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
                              benefit?.insuranceTier === 'class_c' && 'bg-success/10 text-success',
                            )}
                          >
                            {benefit?.insuranceTier.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                          {benefit?.policyNumber ?? '—'}
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate">
                          {benefit?.network ?? 'Standard CCHI'}
                        </td>
                        <td className="py-3 px-4 font-semibold text-foreground">
                          {benefit?.dependentsCount ?? 0}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
