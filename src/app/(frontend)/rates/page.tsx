import type { Metadata } from 'next'

import { BookNowButton } from '@/components/site/book-now-button'
import { EmptyState } from '@/components/site/empty-state'
import { PageHeading } from '@/components/site/page-heading'
import { PageShell } from '@/components/site/page-shell'
import { PromoCard } from '@/components/site/promo-card'
import { RateCard } from '@/components/site/rate-card'
import { SectionContainer } from '@/components/site/section-container'
import { bookingNotes } from '@/lib/placeholders'
import { buildPageMetadata } from '@/lib/seo'
import { getContactInfoData, getPromosData, getRatesData, getSiteSettingsData } from '@/lib/site-data'
import { getPrimaryCtaHref } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, contactInfo] = await Promise.all([getSiteSettingsData(), getContactInfoData()])

  return buildPageMetadata({
    contactInfo,
    description: 'View Sixram Band Studio rehearsal rates, promo packages, inclusions, and booking notes.',
    ogPage: 'rates',
    path: '/rates',
    siteSettings,
    title: 'Rates',
  })
}

export default async function RatesPage() {
  const [rates, promos, siteSettings] = await Promise.all([
    getRatesData(),
    getPromosData(),
    getSiteSettingsData(),
  ])

  const ctaHref = getPrimaryCtaHref(siteSettings.mainCtaLink)

  return (
    <PageShell>
      <SectionContainer className="space-y-8">
        <PageHeading
          actions={<BookNowButton href={ctaHref} label={siteSettings.mainCtaText} />}
          description="Active rehearsal packages and promo bundles are listed here, ordered for clear public browsing and quick booking decisions."
          eyebrow="Public Page"
          title="Rates"
        />

        <div className="rounded-[1.85rem] border border-white/8 bg-card/75 p-5 shadow-[0_24px_70px_-48px_rgba(0,0,0,0.82)]">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">Booking Notes</p>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {bookingNotes.map((note) => (
              <div className="rounded-[1.25rem] border border-white/8 bg-black/25 p-4" key={note}>
                {note}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">Rehearsal Packages</p>
            <h2 className="font-display text-3xl uppercase tracking-[0.1em] text-white sm:text-4xl">
              Core room rates
            </h2>
          </div>

          {rates.length ? (
            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {rates.map((rate) => (
                <RateCard key={rate.id} rate={rate} />
              ))}
            </div>
          ) : (
            <EmptyState
              description="Create an active rate document in the Rates collection and it will appear here automatically."
              title="Rates are waiting for content"
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">Promo Packages</p>
            <h2 className="font-display text-3xl uppercase tracking-[0.1em] text-white sm:text-4xl">
              Limited bundles with extra value
            </h2>
          </div>

          {promos.length ? (
            <div className="grid gap-6">
              {promos.map((promo) => (
                <PromoCard
                  bookingHref={ctaHref}
                  bookingLabel="Book this promo"
                  key={promo.id}
                  promo={promo}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              description="Activate a promo in Payload CMS and it will appear in the promo packages section automatically."
              title="Promo packages are waiting for content"
            />
          )}
        </div>
      </SectionContainer>
    </PageShell>
  )
}
