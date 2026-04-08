import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Dra. Vanessa Jalles | Odontologia & Harmonização Orofacial',
  description:
    'Especialista em Harmonização Orofacial e Odontologia Estética Avançada. CRO 15191. Arquitetura Facial em Harmonia — resultados naturais que preservam sua identidade.',
  keywords: [
    'harmonização orofacial',
    'odontologia estética',
    'bioestimulação',
    'arquitetura facial',
    'Dra. Vanessa Jalles',
    'CRO 15191',
  ],
  openGraph: {
    title: 'Dra. Vanessa Jalles | Odontologia & Harmonização Orofacial',
    description: 'Arquitetura Facial em Harmonia — resultados naturais que preservam sua identidade.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
