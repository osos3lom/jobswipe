import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  HeartPulse,
  LayoutDashboard,
  Target,
  UserPlus,
  Users,
  Wallet,
  ShieldCheck,
} from 'lucide-react'

export interface ConsoleNavItem {
  key: string
  icon: React.ComponentType<{ className?: string }>
  /** Modules without an href are not built yet and render as "Soon". */
  href?: string
}

export const CONSOLE_NAV: ConsoleNavItem[] = [
  { key: 'navDashboard', icon: LayoutDashboard, href: '/console' },
  { key: 'navPeople', icon: Users, href: '/console/people' },
  { key: 'navPayroll', icon: Wallet, href: '/console/payroll' },
  { key: 'navTimeOff', icon: CalendarDays, href: '/console/time-off' },
  { key: 'navHiring', icon: UserPlus, href: '/console/hiring' },
  { key: 'navOnboarding', icon: ClipboardCheck, href: '/console/onboarding' },
  { key: 'navCompliance', icon: ShieldCheck, href: '/console/compliance' },
  { key: 'navBenefits', icon: HeartPulse, href: '/console/benefits' },
  { key: 'navPerformance', icon: Target, href: '/console/performance' },
  { key: 'navReports', icon: BarChart3, href: '/console/reports' },
]
