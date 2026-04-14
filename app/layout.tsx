import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "../components/ui/toaster"
import { Toaster as Sonner } from "../components/ui/sonner"
import { TooltipProvider } from "../components/ui/tooltip"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import FloatingButtons from "../components/FloatingButtons"
import { InquiryFormProvider } from "../contexts/InquiryFormContext"
import ConditionalLayout from "../components/ConditionalLayout"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkyGo | Seamless Flight Bookings & Curated Global Travel Experiences',
  description: 'SkyGo specializes in comprehensive tours, global travel, and ticketing services. Experience seamless flight bookings and expertly curated, personalized travel solutions for all your journey needs.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white`} suppressHydrationWarning>
        <TooltipProvider>
          <InquiryFormProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster />
            <Sonner />
          </InquiryFormProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}

