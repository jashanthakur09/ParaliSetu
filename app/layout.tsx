import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Noto_Sans_Devanagari, Noto_Sans_Gurmukhi, Public_Sans } from 'next/font/google'
import './globals.css'

const publicSans = Public_Sans({ subsets: ['latin'], variable: '--font-public-sans' })
const gurmukhi = Noto_Sans_Gurmukhi({ subsets: ['gurmukhi'], variable: '--font-gurmukhi' })
const devanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-devanagari' })

export const metadata: Metadata = {
  title: 'ParaliSetu — Satellite-guided stubble aggregation for Punjab & Haryana',
  description:
    'ParaliSetu turns paddy stubble (parali) into income: NASA FIRMS hotspot radar, 20-acre baler dispatch, moisture-safe pickup and B2B biomass logistics for Punjab and Haryana.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#143628',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} ${gurmukhi.variable} ${devanagari.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
