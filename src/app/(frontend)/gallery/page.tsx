import type { Metadata } from 'next'

import { BookNowButton } from '@/components/site/book-now-button'
import { EmptyState } from '@/components/site/empty-state'
import { GalleryProfileCard } from '@/components/site/gallery-profile-card'
import { PageHeading } from '@/components/site/page-heading'
import { PageShell } from '@/components/site/page-shell'
import { SectionContainer } from '@/components/site/section-container'
import { buildPageMetadata } from '@/lib/seo'
import { getContactInfoData, getGalleryProfilesData, getSiteSettingsData } from '@/lib/site-data'
import { getPrimaryCtaHref } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, contactInfo] = await Promise.all([getSiteSettingsData(), getContactInfoData()])

  return buildPageMetadata({
    contactInfo,
    description: 'View studio photos, band rehearsal sessions, and live recording moments at Sixram Band Studio.',
    ogPage: 'gallery',
    path: '/gallery',
    siteSettings,
    title: 'Gallery',
  })
}

export default async function GalleryPage() {
  const [profiles, siteSettings] = await Promise.all([getGalleryProfilesData(), getSiteSettingsData()])

  const ctaHref = getPrimaryCtaHref(siteSettings.mainCtaLink)

  return (
    <PageShell>
      <SectionContainer className="space-y-8">
        <PageHeading
          actions={<BookNowButton href={ctaHref} label={siteSettings.mainCtaText} />}
          description="Browse approved client and band profiles first, then open each profile to view its session images and highlights in one place."
          eyebrow="Public Page"
          title="Gallery"
        />

        {profiles.length ? (
          <div className="grid gap-6">
            {profiles.map((profile) => (
              <GalleryProfileCard key={profile.slug} profile={profile} />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Add or approve gallery content in Payload CMS and it will show here once the item is marked ready for posting."
            title="Gallery content is coming soon"
          />
        )}
      </SectionContainer>
    </PageShell>
  )
}
