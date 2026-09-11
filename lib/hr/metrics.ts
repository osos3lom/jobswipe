import { daysUntil } from './dates'
import type { DepartmentId, Employee, EmployeeStatus, SalaryPackage } from './types'

export function grossPay(s: SalaryPackage): number {
  return s.basic + s.housing + s.transport
}

export function monthlyPayroll(employees: Employee[]): number {
  return employees.reduce((sum, e) => sum + grossPay(e.salary), 0)
}

export function countByStatus(employees: Employee[], status: EmployeeStatus): number {
  return employees.filter((e) => e.status === status).length
}

export function saudization(employees: Employee[]) {
  const saudi = employees.filter((e) => e.nationality === 'SA').length
  return {
    saudi,
    nonSaudi: employees.length - saudi,
    rate: employees.length ? saudi / employees.length : 0,
  }
}

export interface IqamaAlert {
  employee: Employee
  daysLeft: number // negative once expired
}

// Iqamas that are expired or expire within `withinDays`, most urgent first.
export function iqamaAlerts(employees: Employee[], withinDays = 60): IqamaAlert[] {
  return employees
    .flatMap((employee) =>
      employee.iqamaExpiry
        ? [{ employee, daysLeft: daysUntil(employee.iqamaExpiry) }]
        : [],
    )
    .filter((a) => a.daysLeft <= withinDays)
    .sort((a, b) => a.daysLeft - b.daysLeft)
}

export function headcountByDepartment(employees: Employee[]) {
  const counts = new Map<DepartmentId, number>()
  for (const e of employees) counts.set(e.department, (counts.get(e.department) ?? 0) + 1)
  return [...counts.entries()]
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count)
}
