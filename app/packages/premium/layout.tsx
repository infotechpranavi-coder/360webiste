import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Poppins } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SkyGo | Customized & Luxury Travel Experiences',
  description: 'Discover the world with SkyGo. Enjoy personalized travel experiences tailored to your preferences. Book now for reliable, premium tours.',
}

export default function PremiumPackagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${playfair.variable} ${cormorant.variable} ${poppins.variable}`}>
      {children}
    </div>
  )
}

