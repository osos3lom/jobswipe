'use client'

import { useSearchParams } from 'next/navigation'
import { PayslipView } from './payslip-view'

// Payslips read the run and employee from the query string rather than from a
// [runId]/[employeeId] segment. Runs are created in the browser, so their ids
// cannot be known at build time, and a static export would 404 on every run a
// reviewer generates.
export function PayslipRoute() {
  const params = useSearchParams()
  return (
    <PayslipView
      runId={params.get('run') ?? ''}
      employeeId={params.get('emp') ?? ''}
    />
  )
}
