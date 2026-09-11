'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Building2,
  Calendar,
  Filter,
  MapPin,
  Search,
  Users,
  X,
} from 'lucide-react'
import { departments } from '@/lib/hr/seed'
import { useHr } from '@/lib/hr/store'
import type { DepartmentId, Employee, EmployeeStatus, Nationality, WorkCity } from '@/lib/hr/types'
import { formatDate, formatNumber } from '@/lib/hr/format'
import { fill, useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function PeoplePage() {
  const { t, tx, lang } = useI18n()
  const { employees } = useHr()

  const [query, setQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedNat, setSelectedNat] = useState<string>('all')
  const [selectedCity, setSelectedCity] = useState<string>('all')

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Query search on name, title, email
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        const matchesName =
          emp.name.en.toLowerCase().includes(q) || emp.name.ar.toLowerCase().includes(q)
        const matchesTitle =
          emp.title.en.toLowerCase().includes(q) || emp.title.ar.toLowerCase().includes(q)
        const matchesEmail = emp.email.toLowerCase().includes(q)
        if (!matchesName && !matchesTitle && !matchesEmail) return false
      }

      // Department filter
      if (selectedDept !== 'all' && emp.department !== selectedDept) {
        return false
      }

      // Status filter
      if (selectedStatus !== 'all' && emp.status !== selectedStatus) {
        return false
      }

      // Nationality filter
      if (selectedNat === 'saudi' && emp.nationality !== 'SA') return false
      if (selectedNat === 'non-saudi' && emp.nationality === 'SA') return false
      if (
        selectedNat !== 'all' &&
        selectedNat !== 'saudi' &&
        selectedNat !== 'non-saudi' &&
        emp.nationality !== selectedNat
      ) {
        return false
      }

      // City filter
      if (selectedCity !== 'all' && emp.city !== selectedCity) {
        return false
      }

      return true
    })
  }, [employees, query, selectedDept, selectedStatus, selectedNat, selectedCity])

  const hasActiveFilters =
    query.trim() !== '' ||
    selectedDept !== 'all' ||
    selectedStatus !== 'all' ||
    selectedNat !== 'all' ||
    selectedCity !== 'all'

  const clearFilters = () => {
    setQuery('')
    setSelectedDept('all')
    setSelectedStatus('all')
    setSelectedNat('all')
    setSelectedCity('all')
  }

  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t('statusActive')}
          </span>
        )
      case 'on_leave':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {t('statusOnLeave')}
          </span>
        )
      case 'onboarding':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {t('statusOnboarding')}
          </span>
        )
    }
  }

  const getCityLabel = (city: WorkCity) => {
    switch (city) {
      case 'riyadh':
        return t('cityRiyadh')
      case 'jeddah':
        return t('cityJeddah')
      case 'dammam':
        return t('cityDammam')
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {t('peopleTitle')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('peopleSubtitle')}</p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-2xl border border-border bg-card px-3.5 py-2 sm:self-auto">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">
            {fill(t('showingCount'), {
              count: formatNumber(filteredEmployees.length, lang),
              total: formatNumber(employees.length, lang),
            })}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-3xl border border-border bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="h-10 w-full rounded-2xl border border-border bg-background pe-4 ps-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Select dropdown filters */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            {/* Department */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              aria-label={t('filterDepartment')}
              className="h-10 rounded-2xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="all">{t('allDepartments')}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {tx(dept.name)}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label={t('filterStatus')}
              className="h-10 rounded-2xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="all">{t('allStatuses')}</option>
              <option value="active">{t('statusActive')}</option>
              <option value="on_leave">{t('statusOnLeave')}</option>
              <option value="onboarding">{t('statusOnboarding')}</option>
            </select>

            {/* Nationality */}
            <select
              value={selectedNat}
              onChange={(e) => setSelectedNat(e.target.value)}
              aria-label={t('filterNationality')}
              className="h-10 rounded-2xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="all">{t('allNationalities')}</option>
              <option value="saudi">{t('filterSaudi')}</option>
              <option value="non-saudi">{t('filterNonSaudi')}</option>
            </select>

            {/* City */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label={t('filterCity')}
              className="h-10 rounded-2xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="all">{t('allCities')}</option>
              <option value="riyadh">{t('cityRiyadh')}</option>
              <option value="jeddah">{t('cityJeddah')}</option>
              <option value="dammam">{t('cityDammam')}</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="col-span-2 flex h-10 items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive sm:col-span-1"
              >
                <X className="h-3.5 w-3.5" />
                <span>{t('clearFilters')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Directory Table (Desktop) & Cards (Mobile) */}
      {filteredEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold">{t('noPeopleFound')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t('noPeopleFoundHint')}</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {t('clearFilters')}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-3xl border border-border bg-card shadow-xs md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/35 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3.5 text-start">{t('colPerson')}</th>
                    <th className="px-5 py-3.5 text-start">{t('colTitle')}</th>
                    <th className="px-5 py-3.5 text-start">{t('colDepartment')}</th>
                    <th className="px-5 py-3.5 text-start">{t('colHireDate')}</th>
                    <th className="px-5 py-3.5 text-start">{t('colStatus')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredEmployees.map((emp) => {
                    const dept = departments.find((d) => d.id === emp.department)
                    const [firstWord] = tx(emp.name).split(' ')
                    const initials = firstWord ? firstWord[0] : 'U'
                    return (
                      <tr
                        key={emp.id}
                        className="group transition-colors hover:bg-muted/40 cursor-pointer"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/console/people/${emp.id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary transition-transform group-hover:scale-105">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {tx(emp.name)}
                              </p>
                              <p className="text-xs text-muted-foreground">{emp.email}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/console/people/${emp.id}`} className="block">
                            <span className="font-medium text-foreground">{tx(emp.title)}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {getCityLabel(emp.city)}
                            </span>
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          <Link href={`/console/people/${emp.id}`} className="block">
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground">
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                              {dept ? tx(dept.name) : emp.department}
                            </span>
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          <Link href={`/console/people/${emp.id}`} className="block text-xs">
                            {formatDate(new Date(emp.hireDate), lang)}
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/console/people/${emp.id}`} className="block">
                            {getStatusBadge(emp.status)}
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List (works on 375px) */}
          <div className="space-y-3 md:hidden">
            {filteredEmployees.map((emp) => {
              const dept = departments.find((d) => d.id === emp.department)
              const [firstWord] = tx(emp.name).split(' ')
              const initials = firstWord ? firstWord[0] : 'U'

              return (
                <Link
                  key={emp.id}
                  href={`/console/people/${emp.id}`}
                  className="block rounded-2xl border border-border bg-card p-4 transition-colors active:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{tx(emp.name)}</h3>
                        <p className="text-xs text-muted-foreground">{tx(emp.title)}</p>
                      </div>
                    </div>
                    {getStatusBadge(emp.status)}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {dept ? tx(dept.name) : emp.department}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {getCityLabel(emp.city)}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(new Date(emp.hireDate), lang)}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
