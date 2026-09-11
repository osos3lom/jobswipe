'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { useStore } from '@/lib/store'
import { AppShell } from '@/components/app-shell'
import { CompanyAvatar } from '@/components/company-avatar'

export default function ChatListPage() {
  const { t, tx } = useI18n()
  const { threads } = useStore()

  return (
    <AppShell title={t('messages')}>
      {threads.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 pt-24 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <MessageCircle className="h-9 w-9" />
          </span>
          <p className="max-w-xs text-sm text-muted-foreground text-pretty">
            {t('noChats')}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {threads.map((thread) => {
            const last = thread.messages[thread.messages.length - 1]
            return (
              <li key={thread.jobId}>
                <Link
                  href={`/chat/${thread.jobId}`}
                  className="flex items-center gap-3 rounded-3xl border border-border bg-card p-3.5 transition-colors hover:bg-secondary/50"
                >
                  <CompanyAvatar name={tx(thread.companyName)} size={52} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="truncate font-semibold leading-tight">
                        {tx(thread.companyName)}
                      </h3>
                    </div>
                    <p className="truncate text-xs text-primary">{tx(thread.jobTitle)}</p>
                    {last && (
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {tx(last.text)}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </AppShell>
  )
}
