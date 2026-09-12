'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  MinusCircle,
  PlusCircle,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react'
import { useHr } from '@/lib/hr/store'
import type { DocumentAlertType, Employee } from '@/lib/hr/types'
import {
  DocTypeFilter,
  ExpiryFilter,
  calculateNitaqat,
  getDocumentAlerts,
} from '@/lib/hr/compliance'
import { downloadWpsBlob, generateWpsCsv } from '@/lib/hr/wps'
import { formatDate, formatDays, formatHijri, formatNumber, formatPercent, formatSAR } from '@/lib/hr/format'
import { fill, useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function CompliancePage() {
  const { t, tx, lang } = useI18n()
  const { company, employees, payrollRuns } = useHr()

  // Nitaqat Analysis
  const nitaqat = useMemo(() => calculateNitaqat(employees), [employees])

  // Simulator state
  const [simExtraSaudis, setSimExtraSaudis] = useState(0)
  const [simExtraExpats, setSimExtraExpats] = useState(0)

  const simulatedNitaqat = useMemo(() => {
    const simSaudi = nitaqat.saudiCount + simExtraSaudis
    const simTotal = nitaqat.totalEmployees + simExtraSaudis + simExtraExpats
    const simRate = simTotal > 0 ? simSaudi / simTotal : 0
    const band =
      nitaqat.thresholds.find((th) => simRate >= th.minRate && simRate <= th.maxRate) ||
      (simRate >= 0.5 ? nitaqat.thresholds[nitaqat.thresholds.length - 1] : nitaqat.thresholds[0])
    return {
      rate: simRate,
      band,
      total: simTotal,
      saudi: simSaudi,
    }
  }, [nitaqat, simExtraSaudis, simExtraExpats])

  // Document Tracker State
  const [expiryFilter, setExpiryFilter] = useState<ExpiryFilter>('all')
  const [docTypeFilter, setDocTypeFilter] = useState<DocTypeFilter>('all')

  const documentAlerts = useMemo(
    () => getDocumentAlerts(employees, expiryFilter, docTypeFilter),
    [employees, expiryFilter, docTypeFilter],
  )

  const allAlerts = useMemo(() => getDocumentAlerts(employees, 'all', 'all'), [employees])
  const expiredCount = allAlerts.filter((a) => a.daysLeft < 0).length
  const expiring60Count = allAlerts.filter((a) => a.daysLeft >= 0 && a.daysLeft <= 60).length

  // Qiwa contracts analysis
  const authenticatedContracts = employees.filter((e) => e.contractStatus === 'authenticated').length
  const pendingContracts = employees.filter((e) => e.contractStatus === 'pending').length
  const expiredContracts = employees.filter((e) => e.contractStatus === 'expired').length
  const authRate = employees.length > 0 ? (authenticatedContracts / employees.length) * 100 : 0

  // WPS Export
  const latestRun = payrollRuns[0]
  const [wpsDownloading, setWpsDownloading] = useState(false)
  const [wpsDownloaded, setWpsDownloaded] = useState(false)
  const [showWpsPreview, setShowWpsPreview] = useState(false)

  const wpsResult = useMemo(() => {
    if (!latestRun) return null
    return generateWpsCsv(latestRun, employees, company)
  }, [latestRun, employees, company])

  const handleDownloadWps = () => {
    if (!wpsResult) return
    setWpsDownloading(true)
    setTimeout(() => {
      downloadWpsBlob(wpsResult.csvContent, wpsResult.filename)
      setWpsDownloading(false)
      setWpsDownloaded(true)
      setTimeout(() => setWpsDownloaded(false), 4000)
    }, 600)
  }

  const getDocTypeBadge = (type: DocumentAlertType) => {
    switch (type) {
      case 'iqama':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
            {t('iqamaCard')}
          </span>
        )
      case 'passport':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-chart-4/10 px-2 py-0.5 text-[11px] font-semibold text-chart-4">
            {t('colDocType')} / Passport
          </span>
        )
      case 'contract':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
            {t('compKpiContracts')}
          </span>
        )
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {t('complianceTitle')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('complianceSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-2xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground sm:self-auto">
          <ShieldCheck className="h-4 w-4 text-success" />
          <span>{tx(nitaqat.currentBand.name)} · {formatPercent(nitaqat.currentRate, lang)}</span>
        </div>
      </div>

      {/* Top 4 KPI Overview Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Saudization */}
        <div className="rounded-3xl border border-border bg-card p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide">
              {t('compKpiSaudization')}
            </span>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-foreground">
            {formatPercent(nitaqat.currentRate, lang)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {fill(t('compKpiSaudizationHint'), {
              rate: `${nitaqat.saudiCount} / ${nitaqat.totalEmployees}`,
              band: tx(nitaqat.currentBand.name),
            })}
          </p>
        </div>

        {/* Document alerts */}
        <div className="rounded-3xl border border-border bg-card p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full',
                expiredCount > 0
                  ? 'bg-destructive/10 text-destructive'
                  : expiring60Count > 0
                    ? 'bg-warning/15 text-warning'
                    : 'bg-success/10 text-success',
              )}
            >
              <AlertTriangle className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide">
              {t('compKpiDocs')}
            </span>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-foreground">
            {formatNumber(expiredCount + expiring60Count, lang)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {fill(t('compKpiDocsHint'), {
              expired: formatNumber(expiredCount, lang),
              expiring: formatNumber(expiring60Count, lang),
            })}
          </p>
        </div>

        {/* WPS Salary File */}
        <div className="rounded-3xl border border-border bg-card p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-4/10 text-chart-4">
              <FileSpreadsheet className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide">{t('compKpiWps')}</span>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-foreground">
            {latestRun ? latestRun.periodMonth : 'Ready'}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {latestRun ? `${formatNumber(latestRun.totals.employeeCount, lang)} ${t('employeesCount').toLowerCase()}` : 'No runs'}
          </p>
        </div>

        {/* Qiwa Contracts */}
        <div className="rounded-3xl border border-border bg-card p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
              <FileCheck className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide">
              {t('compKpiContracts')}
            </span>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-foreground">
            {Math.round(authRate)}%
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {fill(t('compKpiContractsHint'), {
              auth: String(Math.round(authRate)),
              pending: formatNumber(pendingContracts, lang),
            })}
          </p>
        </div>
      </div>

      {/* SECTION 1: NITAQAT BAND METER & SIMULATOR */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">{t('nitaqatTitle')}</h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                {t('nitaqatIllustrativeBadge')}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{t('nitaqatDesc')}</p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-background px-4 py-2.5 text-start sm:text-end">
            <span className="text-[11px] font-semibold text-muted-foreground">{t('currentStanding')}</span>
            <p className="text-base font-black text-primary">{tx(nitaqat.currentBand.name)} ({formatPercent(nitaqat.currentRate, lang)})</p>
          </div>
        </div>

        {/* Visual Multi-Segment Band Bar */}
        <div className="mt-8">
          {/* Segment labels */}
          <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mb-2">
            <span>0%</span>
            <span>26%</span>
            <span>34%</span>
            <span>42%</span>
            <span>50%+</span>
          </div>

          {/* Bar track */}
          <div className="relative h-6 w-full overflow-hidden rounded-2xl bg-muted/60 flex p-1 gap-1">
            {/* Red */}
            <div
              style={{ width: '26%' }}
              className="h-full rounded-l-xl bg-accent/80 flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
              title="Red Band: < 26%"
            >
              <span className="hidden sm:inline">{t('bandRed')}</span>
            </div>
            {/* Low Green */}
            <div
              style={{ width: '8%' }}
              className="h-full bg-success/90 flex items-center justify-center text-[10px] font-bold text-success shadow-xs"
              title="Low Green: 26% - 33.99%"
            />
            {/* Medium Green */}
            <div
              style={{ width: '8%' }}
              className="h-full bg-success/90 flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
              title="Medium Green: 34% - 41.99%"
            />
            {/* High Green */}
            <div
              style={{ width: '8%' }}
              className="h-full bg-success/90 flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
              title="High Green: 42% - 49.99%"
            />
            {/* Platinum */}
            <div
              style={{ width: '50%' }}
              className="h-full rounded-r-xl bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-xs"
              title="Platinum Band: >= 50%"
            >
              <span>{t('bandPlatinum')} (&ge; 50%)</span>
            </div>

            {/* Current Position Pin Indicator */}
            <div
              className="absolute top-0 bottom-0 w-2.5 bg-white border-2 border-primary rounded-full shadow-md -translate-x-1/2 transition-all duration-300"
              style={{
                left: `${Math.min(100, Math.max(0, nitaqat.currentRate * 100))}%`,
              }}
              title={`Current Rate: ${(nitaqat.currentRate * 100).toFixed(1)}%`}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
              {fill(t('hubTitle'), {}).split(',')[0]}: <strong>{formatPercent(nitaqat.currentRate, lang)}</strong> ({nitaqat.saudiCount} SA / {nitaqat.nonSaudiCount} Expat)
            </span>
          </div>
        </div>

        {/* Dynamic Insight Banner */}
        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-foreground">
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <div>
              {nitaqat.currentBand.band === 'platinum' ? (
                <p>
                  {fill(t('platinumStatusMessage'), {
                    buffer: formatNumber(nitaqat.safeExpatHiresBuffer, lang),
                  })}
                </p>
              ) : (
                <p>
                  {fill(t('advanceBandMessage'), {
                    hires: formatNumber(nitaqat.saudiHiresNeededToAdvance, lang),
                    nextBand: nitaqat.nextBand ? tx(nitaqat.nextBand.name) : '',
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Interactive What-If Hire Simulator */}
        <div className="mt-6 border-t border-border/70 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">{t('simulatorTitle')}</h3>
              <p className="text-xs text-muted-foreground">{t('simulatorDesc')}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSimExtraSaudis((p) => p + 1)}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-success hover:bg-muted"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>{t('simAddSaudi')}</span>
              </button>

              <button
                type="button"
                onClick={() => setSimExtraExpats((p) => p + 1)}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>{t('simAddExpat')}</span>
              </button>

              {(simExtraSaudis > 0 || simExtraExpats > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    setSimExtraSaudis(0)
                    setSimExtraExpats(0)
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-dashed border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{t('simReset')}</span>
                </button>
              )}
            </div>
          </div>

          {(simExtraSaudis > 0 || simExtraExpats > 0) && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/40 px-3.5 py-2 text-xs">
              <span className="font-semibold text-foreground">
                {fill(t('simProjectedRate'), {
                  rate: formatPercent(simulatedNitaqat.rate, lang),
                  band: tx(simulatedNitaqat.band.name),
                })}
              </span>
              <span className="text-muted-foreground">
                (+{simExtraSaudis} Saudi, +{simExtraExpats} Expat · Total {simulatedNitaqat.total})
              </span>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: DOCUMENT & CONTRACT EXPIRY TRACKER */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-warning/10 text-warning">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-lg font-bold text-foreground">{t('docTrackerTitle')}</h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t('docTrackerSubtitle')}</p>
            </div>

            {/* Document Type Dropdown */}
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value as DocTypeFilter)}
              aria-label={t('filterDepartment')}
              className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground focus:outline-hidden"
            >
              <option value="all">{t('filterAllTypes')}</option>
              <option value="iqama">{t('filterIqamaOnly')}</option>
              <option value="passport">{t('filterPassportOnly')}</option>
              <option value="contract">{t('filterContractOnly')}</option>
            </select>
          </div>

          {/* Timeframe Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-border/70 pb-3 text-xs">
            {(
              [
                { key: 'all', label: t('filterAll') },
                { key: 'expired', label: `${t('filterExpired')} (${expiredCount})` },
                { key: '30', label: t('filterNext30') },
                { key: '60', label: t('filterNext60') },
                { key: '90', label: t('filterNext90') },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setExpiryFilter(tab.key)}
                className={cn(
                  'rounded-xl px-3 py-1.5 font-semibold transition-colors',
                  expiryFilter === tab.key
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table View (Desktop) & Cards (Mobile) */}
        {documentAlerts.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            {t('noDocsMatching')}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="mt-4 hidden overflow-hidden rounded-2xl border border-border md:block">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 text-start">{t('colPerson')}</th>
                    <th className="px-4 py-3 text-start">{t('colDocType')}</th>
                    <th className="px-4 py-3 text-start">{t('colDocNumber')}</th>
                    <th className="px-4 py-3 text-start">{t('colExpiryDate')}</th>
                    <th className="px-4 py-3 text-start">{t('colDaysLeft')}</th>
                    <th className="px-4 py-3 text-end"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {documentAlerts.map((alert) => {
                    const expiryDateObj = new Date(alert.expiryDate)
                    return (
                      <tr key={alert.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          <Link
                            href={`/console/people/${alert.employee.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            <p className="font-bold">{tx(alert.employee.name)}</p>
                            <span className="text-[11px] font-normal text-muted-foreground">
                              {tx(alert.employee.title)}
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3">{getDocTypeBadge(alert.type)}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                          {alert.documentNumber || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">
                            {formatDate(expiryDateObj, lang)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatHijri(expiryDateObj, lang)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                              alert.daysLeft < 0
                                ? 'bg-destructive/10 text-destructive'
                                : alert.daysLeft <= 30
                                  ? 'bg-warning/15 text-warning'
                                  : alert.daysLeft <= 60
                                    ? 'bg-warning/10 text-warning'
                                    : 'bg-success/10 text-success',
                            )}
                          >
                            {alert.daysLeft < 0 ? (
                              <>
                                <XCircle className="h-3 w-3" />
                                {formatDays(alert.daysLeft, lang)} ({t('expired')})
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3" />
                                {formatDays(alert.daysLeft, lang)}
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <Link
                            href={`/console/people/${alert.employee.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                          >
                            <span>{t('viewProfile')}</span>
                            <ChevronRight className="h-3 w-3 rtl:-scale-x-100" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (375px) */}
            <div className="mt-4 space-y-2.5 md:hidden">
              {documentAlerts.map((alert) => {
                const expiryDateObj = new Date(alert.expiryDate)
                return (
                  <div
                    key={alert.id}
                    className="rounded-2xl border border-border/80 bg-background/50 p-3.5 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/console/people/${alert.employee.id}`}
                          className="font-bold text-sm text-foreground hover:text-primary"
                        >
                          {tx(alert.employee.name)}
                        </Link>
                        <p className="text-xs text-muted-foreground">{tx(alert.employee.title)}</p>
                      </div>
                      {getDocTypeBadge(alert.type)}
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">{t('colExpiryDate')}: </span>
                        <span className="font-semibold text-foreground">
                          {formatDate(expiryDateObj, lang)}
                        </span>
                      </div>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
                          alert.daysLeft < 0
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-warning/15 text-warning',
                        )}
                      >
                        {formatDays(alert.daysLeft, lang)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </section>

      {/* SECTION 3: WPS / MUDAD SALARY FILE EXPORT */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-chart-4/10 text-chart-4">
                <FileSpreadsheet className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">{t('wpsExportTitle')}</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{t('wpsExportSubtitle')}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground/80 italic">{t('wpsDisclaimer')}</p>
          </div>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownloadWps}
            disabled={wpsDownloading || !wpsResult}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold shadow-xs transition-all',
              wpsDownloaded
                ? 'bg-success text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            {wpsDownloaded ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {fill(t('wpsDownloadedBtn'), { count: formatNumber(wpsResult?.rowCount || 0, lang) })}
                </span>
              </>
            ) : wpsDownloading ? (
              <span>{t('wpsDownloadingBtn')}</span>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>{t('wpsDownloadBtn')}</span>
              </>
            )}
          </button>
        </div>

        {/* Latest Run Quick Stats */}
        {latestRun && (
          <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-border/80 bg-background/50 p-4 sm:grid-cols-4 text-xs">
            <div>
              <span className="text-muted-foreground">{t('wpsPayPeriod')}</span>
              <p className="mt-1 font-bold text-foreground">{latestRun.periodMonth}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t('payDateLabel')}</span>
              <p className="mt-1 font-bold text-foreground">{formatDate(new Date(latestRun.payDate), lang)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t('wpsRecordsCount')}</span>
              <p className="mt-1 font-bold text-foreground">{formatNumber(latestRun.totals.employeeCount, lang)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t('wpsTotalNet')}</span>
              <p className="mt-1 font-black text-primary">{formatSAR(latestRun.totals.totalNet, lang)}</p>
            </div>
          </div>
        )}

        {/* SIF Preview Toggle */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setShowWpsPreview((p) => !p)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{t('wpsTogglePreview')}</span>
          </button>
        </div>

        {showWpsPreview && wpsResult && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-border/70 bg-muted/20 p-4">
            <h4 className="text-xs font-bold text-foreground mb-2">{t('wpsPreviewTitle')}</h4>
            <div className="overflow-x-auto text-[11px] font-mono text-muted-foreground">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {wpsResult.csvContent.slice(0, 650)}...
              </pre>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
