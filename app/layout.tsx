import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Zain } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

// Zain is the typeface ihr.sa uses, and it covers both Arabic and Latin.
const zain = Zain({
  variable: '--font-zain',
  subsets: ['arabic', 'latin'],
  weight: ['400', '700', '800'],
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'iHR Platform — HR, payroll & hiring for Saudi companies | concept demo',
  description:
    'Concept demo of an HR platform for Saudi companies: people, payroll, hiring and compliance, plus a swipe-to-apply job app. Unofficial, not affiliated with iHR.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#7a0c0c' },
    { media: '(prefers-color-scheme: dark)', color: '#140b0c' },
  ],
  width: 'device-width',
  initialScale: 1,
}

// Applies the saved theme and language before paint, so dark mode never
// flashes and the layout never flips direction after load.
const bootScript = `try{var d=document.documentElement;if(localStorage.getItem('masari.theme')==='dark'){d.classList.add('dark');d.style.colorScheme='dark'}if(localStorage.getItem('masari.lang')==='en'){d.lang='en';d.dir='ltr'}}catch(e){}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${zain.variable} ${geistMono.variable} bg-background overflow-x-hidden`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-sans antialiased overflow-x-hidden w-full max-w-full">
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
