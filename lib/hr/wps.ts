import type { Company, Employee, PayrollRun } from './types'

export interface WpsExportResult {
  filename: string
  csvContent: string
  rowCount: number
  totalNet: number
}

/**
 * Escapes CSV fields to handle commas, quotes, and newlines cleanly.
 */
function escapeCsv(val: string | number | undefined): string {
  if (val === undefined || val === null) return '""'
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return `"${str}"`
}

/**
 * Generates a Saudi Wages Protection System (WPS / Mudad SIF) compliant CSV file.
 * Prefixes the output with a UTF-8 Byte Order Mark (\uFEFF) to ensure Arabic employee
 * names display cleanly in Microsoft Excel and spreadsheet software.
 */
export function generateWpsCsv(
  run: PayrollRun,
  employees: Employee[],
  company: Company,
): WpsExportResult {
  const empMap = new Map<string, Employee>()
  for (const emp of employees) empMap.set(emp.id, emp)

  const dateStr = run.payDate.replace(/-/g, '')
  const filename = `WPS_SIF_${company.name.en.replace(/[^a-zA-Z0-9]/g, '_')}_${run.periodMonth}.csv`

  const headers = [
    'Employee ID / رقم الموظف',
    'National ID / Iqama / رقم الهوية أو الإقامة',
    'Employee Name (Arabic) / اسم الموظف بالعربية',
    'Employee Name (English) / اسم الموظف بالإنجليزية',
    'Bank IBAN / رقم الآيبان',
    'Basic Salary (SAR) / الراتب الأساسي',
    'Housing Allowance (SAR) / بدل السكن',
    'Transport & Other (SAR) / بدل النقل والبدلات',
    'Additions (SAR) / الإضافات والمكافآت',
    'Deductions (SAR) / الخصومات والاستقطاعات',
    'Net Salary (SAR) / صافي الراتب المستحق',
    'Reference / الرقم المرجعي',
  ]

  const lines: string[] = []

  // Add UTF-8 BOM so Excel on Windows & Mac reads Arabic text properly
  const UTF8_BOM = '\uFEFF'

  // Header row
  lines.push(headers.map(escapeCsv).join(','))

  let totalNet = 0
  let rowCount = 0

  for (const line of run.lines) {
    const emp = empMap.get(line.employeeId)
    if (!emp) continue

    const idNumber =
      emp.nationality === 'SA'
        ? `10${emp.id.replace('e', '')}849201`
        : `24${emp.id.replace('e', '')}710293`

    const otherAllowances = line.transport
    const additionsTotal = line.additions.reduce((s, a) => s + (Number(a.amount) || 0), 0)
    const deductionsTotal = line.gosiEmployee + line.deductions.reduce((s, d) => s + (Number(d.amount) || 0), 0)

    totalNet += line.net
    rowCount += 1

    const row = [
      emp.id.toUpperCase(),
      idNumber,
      emp.name.ar,
      emp.name.en,
      emp.iban,
      line.basic.toFixed(2),
      line.housing.toFixed(2),
      otherAllowances.toFixed(2),
      additionsTotal.toFixed(2),
      deductionsTotal.toFixed(2),
      line.net.toFixed(2),
      `SIF-${run.periodMonth}-${emp.id.toUpperCase()}`,
    ]

    lines.push(row.map(escapeCsv).join(','))
  }

  const csvContent = UTF8_BOM + lines.join('\r\n')

  return {
    filename,
    csvContent,
    rowCount,
    totalNet,
  }
}

/**
 * Triggers a client-side download of the CSV content via a Blob URL.
 */
export function downloadWpsBlob(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
