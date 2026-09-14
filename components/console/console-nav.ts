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
  section: 'workspace' | 'people' | 'finance'
}

export const CONSOLE_NAV: ConsoleNavItem[] = [
  { key: 'navDashboard', icon: LayoutDashboard, href: '/console', section: 'workspace' },
  { key: 'navPeople', icon: Users, href: '/console/people', section: 'people' },
  { key: 'navTimeOff', icon: CalendarDays, href: '/console/time-off', section: 'people' },
  { key: 'navHiring', icon: UserPlus, href: '/console/hiring', section: 'people' },
  { key: 'navOnboarding', icon: ClipboardCheck, href: '/console/onboarding', section: 'people' },
  { key: 'navPayroll', icon: Wallet, href: '/console/payroll', section: 'finance' },
  { key: 'navCompliance', icon: ShieldCheck, href: '/console/compliance', section: 'finance' },
  { key: 'navBenefits', icon: HeartPulse, href: '/console/benefits', section: 'finance' },
  { key: 'navPerformance', icon: Target, href: '/console/performance', section: 'finance' },
  { key: 'navReports', icon: BarChart3, href: '/console/reports', section: 'finance' },
]
