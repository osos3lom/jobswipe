import type { Employee, PayrollAdjustment, PayrollLine, PayrollRunTotals, PayrollSettings } from './types'

export const DEFAULT_PAYROLL_SETTINGS: PayrollSettings = {
  gosiSaudiEmployee: 0.0975, // 9.75% illustrative rate
  gosiSaudiEmployer: 0.1175,  // 11.75% illustrative rate
  gosiExpatEmployee: 0,       // 0% for non-Saudi employees
  gosiExpatEmployer: 0.02,    // 2.0% occupational hazard rate
  gosiCap: 45_000,            // Illustrative maximum contributory wage cap in SAR
}

/**
 * Calculates contributory wage and employee/employer GOSI amounts.
 * Under Saudi social insurance rules, contributory wage is basic salary + housing allowance,
 * capped at the statutory limit.
 */
export function calculateGosi(
  employee: Pick<Employee, 'nationality'>,
  basic: number,
  housing: number,
  settings: PayrollSettings = DEFAULT_PAYROLL_SETTINGS,
): { contributoryWage: number; gosiEmployee: number; gosiEmployer: number } {
  const cap = settings.gosiCap || 45_000
  const contributoryWage = Math.min(Math.max(0, basic + housing), cap)

  const isSaudi = employee.nationality === 'SA'
  const empRate = isSaudi ? settings.gosiSaudiEmployee : settings.gosiExpatEmployee
  const emplyrRate = isSaudi ? settings.gosiSaudiEmployer : settings.gosiExpatEmployer

  const gosiEmployee = Math.round(contributoryWage * empRate * 100) / 100
  const gosiEmployer = Math.round(contributoryWage * emplyrRate * 100) / 100

  return { contributoryWage, gosiEmployee, gosiEmployer }
}

/**
 * Calculates a single employee's payroll line item for a pay period.
 */
export function calculatePayrollLine(
  employee: Employee,
  additions: PayrollAdjustment[] = [],
  deductions: PayrollAdjustment[] = [],
  settings: PayrollSettings = DEFAULT_PAYROLL_SETTINGS,
): PayrollLine {
  const basic = employee.salary.basic
  const housing = employee.salary.housing
  const transport = employee.salary.transport

  const totalAdditions = additions.reduce((sum, a) => sum + (Number(a.amount) || 0), 0)
  const totalDeductions = deductions.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)

  const gross = basic + housing + transport + totalAdditions

  const { gosiEmployee, gosiEmployer } = calculateGosi(employee, basic, housing, settings)

  const net = Math.max(0, gross - totalDeductions - gosiEmployee)
  const employerCost = gross + gosiEmployer

  return {
    employeeId: employee.id,
    basic,
    housing,
    transport,
    additions,
    deductions,
    gosiEmployee,
    gosiEmployer,
    gross,
    net,
    employerCost,
  }
}

/**
 * Aggregates all employee payroll lines into summary totals.
 */
export function calculateRunTotals(lines: PayrollLine[]): PayrollRunTotals {
  return lines.reduce<PayrollRunTotals>(
    (acc, line) => {
      acc.totalGross += line.gross
      acc.totalNet += line.net
      acc.totalAdditions += line.additions.reduce((s, a) => s + (Number(a.amount) || 0), 0)
      acc.totalDeductions += line.deductions.reduce((s, d) => s + (Number(d.amount) || 0), 0)
      acc.totalEmployeeGosi += line.gosiEmployee
      acc.totalEmployerGosi += line.gosiEmployer
      acc.totalEmployerCost += line.employerCost
      acc.employeeCount += 1
      return acc
    },
    {
      totalGross: 0,
      totalNet: 0,
      totalAdditions: 0,
      totalDeductions: 0,
      totalEmployeeGosi: 0,
      totalEmployerGosi: 0,
      totalEmployerCost: 0,
      employeeCount: 0,
    },
  )
}

/**
 * Calculates projected monthly payroll for active employees under current settings.
 * Pure function used by the dashboard KPI and initial run drafting.
 */
export function calculateMonthlyPayroll(
  employees: Employee[],
  settings: PayrollSettings = DEFAULT_PAYROLL_SETTINGS,
) {
  // Everyone on the books is paid: annual leave is paid leave under Saudi
  // labour law, and unpaid leave is entered as a deduction on the run instead.
  const lines = employees.map((e) => calculatePayrollLine(e, [], [], settings))
  const totals = calculateRunTotals(lines)
  return { lines, totals }
}
