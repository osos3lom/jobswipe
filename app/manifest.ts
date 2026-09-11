import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'iHR Platform — Concept Demo',
    short_name: 'iHR Platform',
    description:
      'A concept demo of an HR platform for Saudi companies: people, payroll, hiring and compliance, plus a swipe-to-apply job app.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fcfafa',
    theme_color: '#7a0c0c',
    lang: 'ar',
    dir: 'rtl',
    categories: ['business', 'productivity'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
