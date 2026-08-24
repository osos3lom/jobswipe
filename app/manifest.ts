import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Masari — AI Job Matching',
    short_name: 'Masari',
    description:
      'Swipe your way to the right job in Saudi Arabia. AI-matched roles based on your skills, location, salary and career goals.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f7fbf9',
    theme_color: '#1f7a5c',
    lang: 'en',
    dir: 'auto',
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
