import type { Metadata } from 'next'
import { MarketingHeader } from '@/components/marketing/marketing-header'
import { MarketingFooter } from '@/components/marketing/marketing-footer'

export const metadata: Metadata = {
  title: 'iHR Platform — Modern HR, Payroll & Hiring for Saudi Arabia',
  description:
    'All-in-one Saudi HR platform demo: WPS-compliant payroll, GOSI auto-calculations, Iqama tracking, and AI-assisted hiring. Unofficial concept demo with fictional data.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background selection:bg-primary/20">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  )
}
