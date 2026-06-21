import { BookNowButton } from '@/components/site/book-now-button'
import { EmptyState } from '@/components/site/empty-state'
import { PageHeading } from '@/components/site/page-heading'
import { PageShell } from '@/components/site/page-shell'
import { PromoCard } from '@/components/site/promo-card'
import { SectionContainer } from '@/components/site/section-container'
import { getPromosData, getSiteSettingsData } from '@/lib/site-data'
import { getPrimaryCtaHref } from '@/lib/utils'

export const metadata = {
  title: 'Promos',
}

export default async function PromosPage() {
  const [promos, siteSettings] = await Promise.all([getPromosData(), getSiteSettingsData()])

  const ctaHref = getPrimaryCtaHref(siteSettings.mainCtaLink)

  return (
    <PageShell>
      <SectionContainer className="space-y-8">
        <PageHeading
          actions={<BookNowButton href={ctaHref} label={siteSettings.mainCtaText} />}
          description="Only active promos with a valid date window appear here. Inactive and expired offers stay hidden automatically."
          eyebrow="Public Page"
          title="Promos"
        />

        {promos.length ? (
          <div className="grid gap-6">
            {promos.map((promo) => (
              <PromoCard
                bookingHref={ctaHref}
                bookingLabel="Message us to book this promo"
                key={promo.id}
                promo={promo}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Create an active promo in Payload CMS and it will appear here as soon as its date window is valid."
            title="There are no live promos right now"
          />
        )}
      </SectionContainer>
    </PageShell>
  )
}
