import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PayslipRoute } from './payslip-route'

export const metadata: Metadata = {
  title: 'Payslip — iHR Platform concept demo',
}

export default function PayslipPage() {
  return (
    <Suspense fallback={null}>
      <PayslipRoute />
    </Suspense>
  )
}
