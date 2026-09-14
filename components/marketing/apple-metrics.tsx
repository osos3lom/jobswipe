'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

export function AppleMetrics() {
  const { t } = useI18n()

  const metrics = [
    {
      value: t('appleMetric1Num'),
      label: t('appleMetric1Label'),
    },
    {
      value: t('appleMetric2Num'),
      label: t('appleMetric2Label'),
    },
    {
      value: t('appleMetric3Num'),
      label: t('appleMetric3Label'),
    },
    {
      value: t('appleMetric4Num'),
      label: t('appleMetric4Label'),
    },
  ]

  return (
    <section className="border-y border-border/50 bg-muted/30 py-14 sm:py-20 transition-colors overflow-hidden">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-center">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
                {m.value}
              </span>
              <span className="mt-2 text-xs sm:text-sm font-medium text-muted-foreground max-w-[200px] leading-relaxed">
                {m.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
