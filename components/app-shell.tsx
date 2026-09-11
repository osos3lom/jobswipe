'use client'

import { BottomNav } from './bottom-nav'
import { DemoMenu } from './demo-menu'
import { LanguageToggle } from './language-toggle'
import { Logo } from './logo'

export function AppShell({
  title,
  children,
  action,
}: {
  title?: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col bg-background">
      <header className="glass sticky top-0 z-40 flex items-center justify-between px-4 py-3">
        {title ? (
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
        ) : (
          <Logo />
        )}
        <div className="flex items-center gap-2">
          {action}
          <DemoMenu />
          <LanguageToggle />
        </div>
      </header>

      <main className="flex-1 px-4 pb-32 pt-4">{children}</main>

      <BottomNav />
    </div>
  )
}
