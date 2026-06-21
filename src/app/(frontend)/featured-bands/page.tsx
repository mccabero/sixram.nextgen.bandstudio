import { BandCard } from '@/components/site/band-card'
import { BookNowButton } from '@/components/site/book-now-button'
import { EmptyState } from '@/components/site/empty-state'
import { PageHeading } from '@/components/site/page-heading'
import { PageShell } from '@/components/site/page-shell'
import { SectionContainer } from '@/components/site/section-container'
import { getContactInfoData, getFeaturedBandsData, getSiteSettingsData } from '@/lib/site-data'

export const metadata = {
  title: 'Featured Bands',
}

export default async function FeaturedBandsPage() {
  const [bands, siteSettings, contactInfo] = await Promise.all([
    getFeaturedBandsData(),
    getSiteSettingsData(),
    getContactInfoData(),
  ])

  const ctaHref = siteSettings.mainCtaLink || contactInfo.facebookPage

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
