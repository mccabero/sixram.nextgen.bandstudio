import type { Metadata } from 'next'
import { Bebas_Neue, Space_Grotesk } from 'next/font/google'
import type { ReactNode } from 'react'

import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { getContactInfoData, getSiteSettingsData } from '@/lib/site-data'

import '../globals.css'

const displayFont = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  weight: '400',
})

const bodyFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const metadataBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, contactInfo] = await Promise.all([getSiteSettingsData(), getContactInfoData()])

  return {
    description: siteSettings.seoDescription,
    metadataBase: new URL(metadataBase),
    title: {
      default: siteSettings.seoTitle,
      template: `%s | ${contactInfo.studioName}`,
    },
  }
}

type FrontendLayoutProps = {
  children: ReactNode
}

export default async function FrontendLayout({ children }: FrontendLayoutProps) {
  const [siteSettings, contactInfo] = await Promise.all([getSiteSettingsData(), getContactInfoData()])

  return (
    <html
      className={`${bodyFont.variable} ${displayFont.variable} dark`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
          <Header
            ctaHref={siteSettings.mainCtaLink || contactInfo.facebookPage}
            ctaLabel={siteSettings.mainCtaText}
            logo={siteSettings.logo}
            siteName={contactInfo.studioName}
          />
          <main className="flex-1">{children}</main>
          <Footer
            contactInfo={contactInfo}
            ctaHref={siteSettings.mainCtaLink || contactInfo.facebookPage}
            ctaLabel={siteSettings.mainCtaText}
            logo={siteSettings.logo}
          />
        </div>
      </body>
    </html>
  )
}
