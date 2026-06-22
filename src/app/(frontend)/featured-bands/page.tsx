import type { Metadata } from 'next'

import { BandCard } from '@/components/site/band-card'
import { BookNowButton } from '@/components/site/book-now-button'
import { EmptyState } from '@/components/site/empty-state'
import { PageHeading } from '@/components/site/page-heading'
import { PageShell } from '@/components/site/page-shell'
import { SectionContainer } from '@/components/site/section-container'
import { buildPageMetadata } from '@/lib/seo'
import { getContactInfoData, getFeaturedBandsData, getSiteSettingsData } from '@/lib/site-data'
import { getPrimaryCtaHref } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, contactInfo] = await Promise.all([getSiteSettingsData(), getContactInfoData()])

  return buildPageMetadata({
    contactInfo,
    description: 'Discover featured bands and artists who rehearsed or recorded at Sixram Band Studio.',
    path: '/featured-bands',
    siteSettings,
    title: 'Featured Bands',
  })
}

export default async function FeaturedBandsPage() {
  const [bands, siteSettings] = await Promise.all([getFeaturedBandsData(), getSiteSettingsData()])

  const ctaHref = getPrimaryCtaHref(siteSettings.mainCtaLink)

  return (
    <PageShell>
      <SectionContainer className="space-y-8">
        <PageHeading
          actions={<BookNowButton href={ctaHref} label={siteSettings.mainCtaText} />}
          description="Featured bands are surfaced first and paired with photos, profile details, social links, and embedded YouTube performances when available."
          eyebrow="Public Page"
          title="Featured Bands"
        />

        {bands.length ? (
          <div className="grid gap-6">
            {bands.map((band) => (
              <BandCard band={band} key={band.id} />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Create a featured band profile in Payload CMS to start spotlighting artists who use the studio."
            title="No bands are featured yet"
          />
        )}
      </SectionContainer>
    </PageShell>
  )
}
