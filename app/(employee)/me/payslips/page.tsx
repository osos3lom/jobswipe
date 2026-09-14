'use client'

import { useMemo, useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  Printer,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react'
import { useActiveEmployee } from '@/lib/employee/employee-context'
import { useHr } from '@/lib/hr/store'
import type { PayrollLine, PayrollRun } from '@/lib/hr/types'
import { formatDate, formatNumber, formatSAR } from '@/lib/hr/format'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function EmployeePayslipsPage() {
  const { t, tx, lang } = useI18n()
  const { currentEmployee } = useActiveEmployee()
  const { payrollRuns, company } = useHr()

  const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null)

  // Find all runs that contain a line for this employee
  const employeePayslips = useMemo(() => {
    if (!currentEmployee) return []
    return payrollRuns
      .map((run) => {
        const line = run.lines.find((l) => l.employeeId === currentEmployee.id)
        if (!line) return null
        return { run, line }
      })
      .filter((item): item is { run: PayrollRun; line: PayrollLine } => item !== null)
  }, [payrollRuns, currentEmployee])

  if (!currentEmployee) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {t('payslipsTitle')}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('payslipsSubtitle')}
        </p>
      </div>

      {/* Payslips List */}
      {employeePayslips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground">
          <Wallet className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
          <p>{t('noPayslipsYet')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {employeePayslips.map(({ run, line }) => (
            <div
              key={run.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3 transition hover:border-primary/40"
            >
              <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
                <div>
                  <span className="text-xs font-bold text-foreground">
                    {run.periodMonth}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {lang === 'ar' ? 'تاريخ الصرف:' : 'Pay Date:'} {formatDate(run.payDate, lang)}
                  </span>
                </div>
                <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] font-bold text-success">
                  {t('approved')}
                </span>
              </div>

              {/* Quick Summary Numbers */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-muted/40 p-2.5">
                  <span className="text-muted-foreground block text-[11px]">
                    {lang === 'ar' ? 'إجمالي الراتب' : 'Gross'}:
                  </span>
                  <span className="font-bold text-foreground">
                    {formatSAR(line.gross, lang)}
                  </span>
                </div>
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <span className="text-primary block text-[11px] font-semibold">
                    {t('netTakeHome')}:
                  </span>
                  <span className="font-bold text-primary text-sm">
                    {formatSAR(line.net, lang)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>
                  {t('gosiDeductions')}: <strong className="text-foreground">{formatSAR(line.gosiEmployee, lang)}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedRun(run)}
                  className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>{t('viewPayslip')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILED PAYSLIP MODAL / PRINT VIEW */}
      {selectedRun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {lang === 'ar' ? 'كشف الراتب الشهري' : 'Monthly Payslip'} — {selectedRun.periodMonth}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {tx(company.name)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRun(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Printable Payslip Card */}
            {(() => {
              const line = selectedRun.lines.find((l) => l.employeeId === currentEmployee.id)!
              return (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="rounded-xl border border-border bg-background p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === 'ar' ? 'الموظف' : 'Employee'}:</span>
                      <span className="font-bold text-foreground">{tx(currentEmployee.name)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === 'ar' ? 'المسمى' : 'Title'}:</span>
                      <span className="font-semibold text-foreground">{tx(currentEmployee.title)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{lang === 'ar' ? 'الآيبان' : 'IBAN'}:</span>
                      <span className="font-mono text-xs text-muted-foreground">{currentEmployee.iban}</span>
                    </div>
                  </div>

                  {/* Earnings Breakdown */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {lang === 'ar' ? 'تفاصيل الاستحقاقات' : 'Earnings'}
                    </div>
                    <div className="divide-y divide-border rounded-xl border border-border bg-background">
                      <div className="flex justify-between p-2.5">
                        <span>{lang === 'ar' ? 'الراتب الأساسي' : 'Basic Salary'}</span>
                        <span className="font-semibold text-foreground">{formatSAR(line.basic, lang)}</span>
                      </div>
                      <div className="flex justify-between p-2.5">
                        <span>{lang === 'ar' ? 'بدل السكن' : 'Housing Allowance'}</span>
                        <span className="font-semibold text-foreground">{formatSAR(line.housing, lang)}</span>
                      </div>
                      <div className="flex justify-between p-2.5">
                        <span>{lang === 'ar' ? 'بدل النقل' : 'Transport Allowance'}</span>
                        <span className="font-semibold text-foreground">{formatSAR(line.transport, lang)}</span>
                      </div>
                      {line.additions.map((adj) => (
                        <div key={adj.id} className="flex justify-between p-2.5 text-success">
                          <span>{tx(adj.label)}</span>
                          <span className="font-semibold">+{formatSAR(adj.amount, lang)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deductions Breakdown */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {lang === 'ar' ? 'الاستقطاعات النظامية' : 'Deductions'}
                    </div>
                    <div className="divide-y divide-border rounded-xl border border-border bg-background">
                      <div className="flex justify-between p-2.5 text-destructive">
                        <span>{t('gosiDeductions')}</span>
                        <span className="font-semibold">-{formatSAR(line.gosiEmployee, lang)}</span>
                      </div>
                      {line.deductions.map((adj) => (
                        <div key={adj.id} className="flex justify-between p-2.5 text-destructive">
                          <span>{tx(adj.label)}</span>
                          <span className="font-semibold">-{formatSAR(adj.amount, lang)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Net */}
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-3.5 flex justify-between items-center text-sm font-bold">
                    <span className="text-primary">{t('netTakeHome')}</span>
                    <span className="text-primary text-base">{formatSAR(line.net, lang)}</span>
                  </div>
                </div>
              )
            })()}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>{t('downloadPayslip')}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRun(null)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
