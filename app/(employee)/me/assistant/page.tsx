'use client'

import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowUp,
  Bot,
  Calendar,
  Clock,
  HelpCircle,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from 'lucide-react'
import { useActiveEmployee } from '@/lib/employee/employee-context'
import { useHr } from '@/lib/hr/store'
import { calculatePayrollLine } from '@/lib/hr/payroll'
import { calculateEmployeeBalances, getAnnualLeaveEntitlement } from '@/lib/hr/time-off'
import { daysUntil, nextPayday, toISODate } from '@/lib/hr/dates'
import { formatDate, formatDays, formatSAR } from '@/lib/hr/format'
import { fill, useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
}

export default function EmployeeAssistantPage() {
  const { t, tx, lang } = useI18n()
  const { currentEmployee } = useActiveEmployee()
  const { company, payrollSettings, timeOffRequests, ramadanHoursEnabled } = useHr()

  const [inputQuery, setInputQuery] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text:
        lang === 'ar'
          ? `مرحباً بك ${currentEmployee ? tx(currentEmployee.name).split(' ')[0] : ''}! أنا المساعد الذكي لمنسوبي شركة ${tx(company.name)}. يمكنك سؤالي عن رصيد إجازاتك، أو موعد الراتب القادم، أو استقطاعات التأمينات، أو أنظمة العمل.`
          : `Hello ${currentEmployee ? tx(currentEmployee.name).split(' ')[0] : ''}! I am your ${tx(company.name)} HR Assistant. Ask me anything about your leave balance, next payday, GOSI deductions, or company policies.`,
      timestamp: 'Just now',
    },
  ])

  if (!currentEmployee) return null

  // Precomputed employee facts
  const payday = nextPayday(company.payDay)
  const daysToPayday = daysUntil(toISODate(payday))
  const payrollLine = calculatePayrollLine(currentEmployee, [], [], payrollSettings)
  const balances = calculateEmployeeBalances(currentEmployee, timeOffRequests)
  const annualLeave = balances.find((b) => b.type === 'annual')!
  const { isSeniorTenure } = getAnnualLeaveEntitlement(currentEmployee.hireDate)

  const quickPrompts = [
    { key: 'payday', label: t('promptPayday') },
    { key: 'leave', label: t('promptLeave') },
    { key: 'gosi', label: t('promptGosi') },
    { key: 'ramadan', label: t('promptRamadan') },
    { key: 'iqama', label: t('promptIqama') },
  ]

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase()

    if (q.includes('payday') || q.includes('راتب') || q.includes('صرف')) {
      return lang === 'ar'
        ? `موعد صرف الراتب القادم هو يوم ${formatDate(payday, lang)} (خلال ${daysToPayday} يوماً). صافي راتبك المتوقع بعد استقطاع التأمينات هو ${formatSAR(payrollLine.net, lang)}، سيتم إيداعه في حسابك البنكي (${currentEmployee.iban.slice(0, 14)}…).`
        : `Your next payday is scheduled on ${formatDate(payday, lang)} (in ${daysToPayday} days). Your estimated net pay after GOSI deduction is ${formatSAR(payrollLine.net, lang)}, deposited to IBAN ${currentEmployee.iban.slice(0, 14)}…`
    }

    if (q.includes('leave') || q.includes('إجاز') || q.includes('رصيد')) {
      return lang === 'ar'
        ? `رصيد إجازتك السنوية المتاح حالياً هو ${annualLeave.availableDays} يوماً (من إجمالي رصيدك السنوي البالغ ${annualLeave.totalDays} يوماً بموجب المادة ١٠٩ من نظام العمل${isSeniorTenure ? ' — فئة أكثر من ٥ سنوات خدمة' : ''}). لقد استهلكت حتى الآن ${annualLeave.usedDays} يوماً.`
        : `You currently have ${annualLeave.availableDays} days of annual leave available (out of ${annualLeave.totalDays} days statutory entitlement under Saudi Labor Law Art. 109${isSeniorTenure ? ' — senior tenure tier' : ''}). You have used ${annualLeave.usedDays} days so far this year.`
    }

    if (q.includes('gosi') || q.includes('تأمين') || q.includes('استقطاع') || q.includes('social insurance')) {
      return lang === 'ar'
        ? `يتم استقطاع ${formatSAR(payrollLine.gosiEmployee, lang)} شهرياً من راتبك لصالح المؤسسة العامة للتأمينات الاجتماعية (GOSI). كما تساهم المنشأة بدفع ${formatSAR(payrollLine.gosiEmployer, lang)} شهرياً نيابة عنك.`
        : `Your monthly employee GOSI contribution is ${formatSAR(payrollLine.gosiEmployee, lang)}. Additionally, the company contributes ${formatSAR(payrollLine.gosiEmployer, lang)} on your behalf each month.`
    }

    if (q.includes('ramadan') || q.includes('رمضان') || q.includes('ساعات')) {
      return lang === 'ar'
        ? `وفقاً للمادة ٩٨ من نظام العمل السعودي، يتم تخفيض ساعات العمل الفعلية خلال شهر رمضان المبارك للمسلمين إلى ٦ ساعات يومياً (٣٦ ساعة أسبوعياً). حالة الدوام حالياً: ${ramadanHoursEnabled ? 'دوام رمضان الست ساعات مفعّل' : 'الدوام الاعتيادي ٨ ساعات'}.`
        : `Under Saudi Labor Law Article 98, working hours during the holy month of Ramadan are reduced to 6 hours daily (36 hours weekly) for Muslim employees. Current setting: ${ramadanHoursEnabled ? 'Ramadan 6-hour schedule is active' : 'Standard 8-hour schedule'}.`
    }

    if (q.includes('iqama') || q.includes('إقام') || q.includes('هوي')) {
      if (currentEmployee.iqamaExpiry) {
        const days = daysUntil(currentEmployee.iqamaExpiry)
        return lang === 'ar'
          ? `تنتهي صلاحية إقامتك في ${formatDate(currentEmployee.iqamaExpiry, lang)} (خلال ${formatDays(days, lang)}). ستقوم إدارة الموارد البشرية بتجديد الإقامة عبر منصة مقيم قبل موعد الانتهاء بوقت كافٍ.`
          : `Your Iqama expires on ${formatDate(currentEmployee.iqamaExpiry, lang)} (in ${formatDays(days, lang)}). HR will initiate renewal via the Muqeem portal prior to expiry.`
      }
      return lang === 'ar'
        ? 'أنت مواطن سعودي، ولا يلزمك إصدار إقامة؛ هويتك الوطنية معتمدة ومسجلة في التأمينات الاجتماعية.'
        : 'You are a Saudi citizen, so Iqama regulations do not apply; your National ID is authenticated with GOSI.'
    }

    return lang === 'ar'
      ? `شكراً لاستفسارك. بصفتي مساعد الموارد البشرية لشركة ${tx(company.name)}، يمكنك سؤالي عن أرصدة الإجازات، وتواريخ مسيرات الرواتب، واشتراكات التأمينات الاجتماعية (GOSI)، أو طلب شهادات التعريف.`
      : `Thank you for asking. As the ${tx(company.name)} HR assistant, you can ask me about your leave balances, payroll dates, GOSI contributions, or official HR certificates.`
  }

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? inputQuery).trim()
    if (!text) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    }

    const answer = generateAnswer(text)
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-a`,
      sender: 'assistant',
      text: answer,
      timestamp: 'Just now',
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInputQuery('')
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-170px)]">
      {/* Header & Disclaimer */}
      <div className="space-y-2 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {t('assistantTitle')}
          </h1>
          <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-[10px] font-bold text-warning border border-warning/20">
            Scripted Demo Assistant
          </span>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-2.5 text-[11px] text-muted-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <span>{t('assistantDisclaimer')}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'flex gap-2.5 max-w-[88%]',
              m.sender === 'user' ? 'ms-auto flex-row-reverse' : 'me-auto',
            )}
          >
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                m.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground border border-border',
              )}
            >
              {m.sender === 'user' ? 'You' : <Bot className="h-4 w-4 text-primary" />}
            </div>

            <div
              className={cn(
                'rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed',
                m.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-xs'
                  : 'bg-card border border-border text-foreground rounded-tl-xs shadow-xs',
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="pt-2 pb-1.5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => handleSend(p.label)}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground whitespace-nowrap transition"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex items-center gap-2 pt-1 border-t border-border"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={lang === 'ar' ? 'اسأل المساعد الذكي عن إجازتك، الراتب، التأمينات…' : 'Ask about leave, payday, GOSI…'}
          className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim()}
          aria-label={t('send')}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-40 transition"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
