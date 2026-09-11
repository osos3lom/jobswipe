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
  { key: 'navTimeOff', icon: CalendarDays },
  { key: 'navHiring', icon: UserPlus, href: '/console/hiring' },
  { key: 'navOnboarding', icon: ClipboardCheck },
  { key: 'navCompliance', icon: ShieldCheck },
  { key: 'navBenefits', icon: HeartPulse },
  { key: 'navPerformance', icon: Target },
  { key: 'navReports', icon: BarChart3 },
]
