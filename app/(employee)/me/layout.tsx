'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Award,
  CalendarDays,
  FileCheck2,
  FileText,
  Home,
  MessageSquare,
  Sparkles,
  User,
  Users,
  Wallet,
} from 'lucide-react'
import { DemoMenu } from '@/components/demo-menu'
import { LanguageToggle } from '@/components/language-toggle'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { EmployeeProvider, useActiveEmployee } from '@/lib/employee/employee-context'
import { useI18n } from '@/lib/i18n'
import { useHrLoaded } from '@/lib/hr/store'
import { cn } from '@/lib/utils'

function EmployeeLayoutContent({ children }: { children: React.ReactNode }) {
  const { t, tx, lang } = useI18n()
  const pathname = usePathname()
  const loaded = useHrLoaded()
  const { currentEmployee, setCurrentEmployeeId, availableEmployees } = useActiveEmployee()

  const navItems = [
    { href: '/me', labelKey: 'empNavHome', icon: Home },
    { href: '/me/payslips', labelKey: 'empNavPayslips', icon: Wallet },
    { href: '/me/leave', labelKey: 'empNavLeave', icon: CalendarDays },
    { href: '/me/letters', labelKey: 'empNavLetters', icon: FileCheck2 },
    { href: '/me/assistant', labelKey: 'empNavAssistant', icon: Sparkles },
  ]

  return (
    <div className="flex min-h-[100dvh] justify-center bg-muted/30">
      {/* Mobile-first centered frame */}
      <div className="relative flex w-full max-w-md flex-col border-x border-border bg-background shadow-lg">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <Logo product="platform" withName={false} />
            <div className="leading-none">
              <div className="text-xs font-bold tracking-tight text-primary">
                iHR
              </div>
              <div className="text-[10px] font-semibold text-muted-foreground">
                {t('employeePortal')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Employee Switcher */}
            {currentEmployee && (
              <select
                aria-label={t('switchEmployeeUser')}
                value={currentEmployee.id}
                onChange={(e) => setCurrentEmployeeId(e.target.value)}
                className="max-w-[110px] truncate rounded-lg border border-border bg-muted/40 px-1.5 py-1 text-[11px] font-semibold text-foreground focus:outline-none"
              >
                {availableEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {tx(emp.name)}
                  </option>
                ))}
              </select>
            )}
            <DemoMenu />
            <LanguageToggle />
            <ThemeToggle compact />
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 px-4 py-5 pb-24 overflow-y-auto">
          {loaded && currentEmployee ? (
            children
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              {t('loading')}
            </p>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav
          aria-label={t('employeePortal')}
          className="fixed bottom-0 z-40 w-full max-w-md border-t border-border bg-background/95 backdrop-blur shadow-lg"
        >
          <ul className="grid grid-cols-5 py-2">
            {navItems.map(({ href, labelKey, icon: Icon }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'flex flex-col items-center justify-center gap-1 py-1 text-center transition',
                      active
                        ? 'text-primary font-bold'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <Icon className={cn('h-5 w-5', active && 'stroke-[2.5px]')} />
                    <span className="text-[10px] leading-none truncate max-w-[64px]">
                      {t(labelKey)}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <EmployeeProvider>
      <EmployeeLayoutContent>{children}</EmployeeLayoutContent>
    </EmployeeProvider>
  )
}
