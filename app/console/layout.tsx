import type { Metadata } from 'next'
import { ConsoleShell } from '@/components/console/console-shell'

export const metadata: Metadata = {
  title: 'Console — iHR Platform concept demo',
}

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ConsoleShell>{children}</ConsoleShell>
}
