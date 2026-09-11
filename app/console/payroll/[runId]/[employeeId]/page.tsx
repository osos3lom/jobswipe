import { rows } from '@/lib/hr/seed'
import { PayslipView } from './payslip-view'

export function generateStaticParams() {
  const seededRunIds = ['run-2026-08', 'run-2026-07']
  const params: { runId: string; employeeId: string }[] = []

  for (const runId of seededRunIds) {
    for (const r of rows) {
      params.push({
        runId,
        employeeId: r.id,
      })
    }
  }

  return params
}

export default async function PayslipPage({
  params,
}: {
  params: Promise<{ runId: string; employeeId: string }>
}) {
  const { runId, employeeId } = await params
  return <PayslipView runId={runId} employeeId={employeeId} />
}
