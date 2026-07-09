'use client'

import { usePathname } from 'next/navigation'
import NavbarTravel from "./NavbarTravel"
import Footer from "./Footer"
import FloatingButtons from "./FloatingButtons"
import HomeInquiryWrapper from "./HomeInquiryWrapper"
import OfferPopup from "./OfferPopup"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <>
      <NavbarTravel />
      <main className="min-h-screen bg-white">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
      <HomeInquiryWrapper />
      <OfferPopup />
    </>
  )
}
