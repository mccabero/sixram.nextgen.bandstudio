import type { Metadata } from 'next'
import { Bebas_Neue, Space_Grotesk } from 'next/font/google'
import type { ReactNode } from 'react'

import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { buildBusinessStructuredData, buildPageMetadata, resolveMetadataBase } from '@/lib/seo'
import { getContactInfoData, getSiteSettingsData } from '@/lib/site-data'
import { getPrimaryCtaHref } from '@/lib/utils'

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

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, contactInfo] = await Promise.all([getSiteSettingsData(), getContactInfoData()])
  const homeMetadata = buildPageMetadata({
    contactInfo,
    description: siteSettings.seoDescription,
    path: '/',
    siteSettings,
    title: siteSettings.seoTitle,
    useAbsoluteTitle: true,
  })

  return {
    ...homeMetadata,
    applicationName: contactInfo.studioName,
    description: siteSettings.seoDescription,
    metadataBase: resolveMetadataBase(),
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
  const ctaHref = getPrimaryCtaHref(siteSettings.mainCtaLink)
  const businessStructuredData = buildBusinessStructuredData({ contactInfo, siteSettings })

  return (
    <html
      className={`${bodyFont.variable} ${displayFont.variable} dark`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessStructuredData),
          }}
          id="structured-data-local-business"
          type="application/ld+json"
        />
        <div className="flex min-h-screen flex-col">
          <Header
            ctaHref={ctaHref}
            ctaLabel={siteSettings.mainCtaText}
            logo={siteSettings.logo}
            siteName={contactInfo.studioName}
          />
          <main className="flex-1">{children}</main>
          <Footer
            contactInfo={contactInfo}
            ctaHref={ctaHref}
            ctaLabel={siteSettings.mainCtaText}
            logo={siteSettings.logo}
          />
        </div>
      </body>
    </html>
  )
}
