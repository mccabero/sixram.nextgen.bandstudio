import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

import { BookNowButton } from '@/components/site/book-now-button'
import { EmptyState } from '@/components/site/empty-state'
import { MediaFrame } from '@/components/site/media-frame'
import { PageShell } from '@/components/site/page-shell'
import { SectionContainer } from '@/components/site/section-container'
import { SectionIntro } from '@/components/site/section-intro'
import { Button } from '@/components/ui/button'
import {
  getContactInfoData,
  getFeaturedBandsData,
  getGalleryData,
  getPromosData,
  getRatesData,
  getSiteSettingsData,
} from '@/lib/site-data'
import { buildPageMetadata } from '@/lib/seo'
import { formatCurrency, formatPromoWindow, getMediaSrc, getPrimaryCtaHref } from '@/lib/utils'

function pickPreviewItems<T extends { id: number; isFeatured?: boolean | null }>(items: T[], limit: number) {
  const featuredItems = items.filter((item) => Boolean(item.isFeatured))
  const remainingItems = items.filter((item) => !featuredItems.some((featured) => featured.id === item.id))

  return [...featuredItems, ...remainingItems].slice(0, limit)
}

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, contactInfo] = await Promise.all([getSiteSettingsData(), getContactInfoData()])

  return buildPageMetadata({
    contactInfo,
    description: siteSettings.seoDescription,
    ogPage: 'home',
    path: '/',
    siteSettings,
    title: siteSettings.seoTitle,
    useAbsoluteTitle: true,
  })
}

export default async function HomePage() {
  const [siteSettings, contactInfo, rates, promos, gallery, featuredBands] = await Promise.all([
    getSiteSettingsData(),
    getContactInfoData(),
    getRatesData(),
    getPromosData(),
    getGalleryData(),
    getFeaturedBandsData(),
  ])

  const ctaHref = getPrimaryCtaHref(siteSettings.mainCtaLink)
  const currentPromo = promos[0]
  const highlightedRate = rates[0]
  const featuredRates = pickPreviewItems(rates, 3)
  const galleryPreview = pickPreviewItems(gallery, 3)
  const featuredBandsPreview = pickPreviewItems(featuredBands, 3)
  const hasHeroImage = Boolean(siteSettings.heroImage?.url || siteSettings.heroImage?.thumbnailUrl)

  return (
    <PageShell className="space-y-20 sm:space-y-24">
      <SectionContainer>
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {contactInfo.studioName}
            </div>

            <div className="space-y-4">
              <h1 className="max-w-4xl font-display text-5xl uppercase leading-none tracking-[0.08em] text-white sm:text-6xl lg:text-7xl">
                {siteSettings.heroTitle}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg line-clamp-3">
                {siteSettings.heroSubtitle}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <BookNowButton href={ctaHref} label={siteSettings.mainCtaText} size="lg" />
              <Button asChild size="lg" variant="outline">
                <Link href="/rates">
                  View Rates
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {highlightedRate ? (
                <span className="rounded-full border border-white/10 bg-white/4 px-4 py-2">
                  {highlightedRate.packageName} - {formatCurrency(highlightedRate.price)}
                </span>
              ) : (
                <span className="rounded-full border border-white/10 bg-white/4 px-4 py-2">
                  Rates update in progress
                </span>
              )}
              <span className="rounded-full border border-white/10 bg-white/4 px-4 py-2">
                By reservation only
              </span>
              <span className="rounded-full border border-white/10 bg-white/4 px-4 py-2">
                No walk-ins
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-black/35 p-4 shadow-[0_40px_120px_-70px_rgba(209,31,42,0.65)]">
            {hasHeroImage ? (
              <MediaFrame
                alt={siteSettings.heroImage?.alt || 'Sixram Band Studio hero image'}
                className="min-h-[26rem] rounded-[1.6rem] lg:min-h-[34rem]"
                priority
                sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 44vw, 100vw"
                src={getMediaSrc(siteSettings.heroImage, '/placeholders/studio-hero.svg')}
              />
            ) : (
              <div className="flex min-h-[26rem] rounded-[1.6rem] border border-white/8 bg-[radial-gradient(circle_at_top,_rgba(209,31,42,0.24),_transparent_42%),linear-gradient(180deg,rgba(18,18,18,0.96),rgba(5,5,5,1))] p-8 lg:min-h-[34rem]">
                <div className="mt-auto max-w-sm space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    Hero Image Optional
                  </p>
                  <p className="font-display text-3xl uppercase tracking-[0.08em] text-white">
                    {contactInfo.studioName}
                  </p>
                  <p className="text-sm leading-7 text-white/72">
                    Upload a hero image in Site Settings to replace this clean dark studio fallback.
                  </p>
                </div>
              </div>
            )}

            <div className="absolute inset-x-8 bottom-8 max-w-md rounded-[1.5rem] border border-white/10 bg-black/72 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                <Sparkles className="size-4" />
                Studio Setup
              </div>
              <p className="mt-3 text-sm leading-7 text-white/82">
                Fender and Laney guitar amps, Hartke bass support, Pearl Roadshow drums, Alto active speakers, quality microphones, and optional multitrack live recording.
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="space-y-6">
        <SectionIntro
          action={
            <Button asChild variant="outline">
              <Link href="/promos">
                View All Promos
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
          description="One clear highlight from the current studio offers."
          eyebrow="Promo Preview"
          title="Best current promo"
        />

        {currentPromo ? (
          <div className="grid gap-6 rounded-[2rem] border border-white/8 bg-card/80 p-6 shadow-[0_28px_80px_-48px_rgba(0,0,0,0.85)] lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                  Active promo
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {formatPromoWindow(currentPromo.startDate, currentPromo.endDate)}
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-white sm:text-4xl">
                  {currentPromo.promoTitle}
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground line-clamp-3 sm:text-base">
                  {currentPromo.description}
                </p>
              </div>

              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Promo price</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {formatCurrency(currentPromo.promoPrice)}
                  </p>
                </div>
                {currentPromo.originalPrice ? (
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Regular price</p>
                    <p className="mt-2 text-lg text-muted-foreground line-through">
                      {formatCurrency(currentPromo.originalPrice)}
                    </p>
                  </div>
                ) : null}
              </div>

              <BookNowButton href={ctaHref} label={siteSettings.mainCtaText} />
            </div>

            <MediaFrame
              alt={currentPromo.promoImage?.alt || currentPromo.promoTitle}
              className="min-h-[18rem]"
              sizes="(min-width: 1024px) 40vw, 100vw"
              src={getMediaSrc(currentPromo.promoImage, '/placeholders/promo-recording.svg')}
            />
          </div>
        ) : (
          <EmptyState
            description="No promo is currently active right now. Add an active promo in Payload CMS and the homepage highlight will update automatically."
            title="No live promo at the moment"
          />
        )}
      </SectionContainer>

      <SectionContainer className="space-y-6">
        <SectionIntro
          action={
            <Button asChild variant="outline">
              <Link href="/rates">
                View All Rates
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
          description="A short preview of the featured rehearsal packages."
          eyebrow="Rates Preview"
          title="Featured rates"
        />

        {featuredRates.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {featuredRates.map((rate) => (
              <article
                className="rounded-[1.75rem] border border-white/8 bg-card/80 p-5 shadow-[0_24px_70px_-48px_rgba(0,0,0,0.85)]"
                key={rate.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {rate.isFeatured ? (
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                          Featured
                        </span>
                      ) : null}
                      <span className="rounded-full border border-white/10 px-3 py-1">{rate.duration}</span>
                    </div>
                    <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-white">
                      {rate.packageName}
                    </h3>
                  </div>

                  <p className="text-xl font-semibold text-white">{formatCurrency(rate.price)}</p>
                </div>

                <p className="mt-4 text-sm leading-7 text-muted-foreground line-clamp-3">{rate.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            description="Create an active featured rate in Payload CMS and the homepage preview will update automatically."
            title="No featured rates yet"
          />
        )}
      </SectionContainer>

      <SectionContainer className="space-y-6">
        <SectionIntro
          action={
            <Button asChild variant="outline">
              <Link href="/gallery">
                View Gallery
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
          description="A quick look inside the room and recent sessions."
          eyebrow="Gallery Preview"
          title="Inside the studio"
        />

        {galleryPreview.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {galleryPreview.map((item) => (
              <article
                className="overflow-hidden rounded-[1.75rem] border border-white/8 bg-card/70 p-3 shadow-[0_24px_70px_-48px_rgba(0,0,0,0.85)]"
                key={item.id}
              >
                <MediaFrame
                  alt={item.images[0]?.alt || item.title}
                  className="min-h-[18rem] rounded-[1.3rem]"
                  sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 100vw"
                  src={getMediaSrc(item.images[0], '/placeholders/gallery-session.svg')}
                />
                <div className="mt-3 px-1">
                  <p className="text-base font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.bandOrClientName || 'Sixram Band Studio'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            description="Approve and mark gallery items as featured in Payload CMS, and the homepage preview will update automatically."
            title="No featured gallery items yet"
          />
        )}
      </SectionContainer>

      <SectionContainer className="space-y-6">
        <SectionIntro
          action={
            <Button asChild variant="outline">
              <Link href="/featured-bands">
                View Featured Bands
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
          description="A few artists and bands highlighted by the studio."
          eyebrow="Featured Bands"
          title="Bands from the room"
        />

        {featuredBandsPreview.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredBandsPreview.map((band) => (
              <article
                className="overflow-hidden rounded-[1.75rem] border border-white/8 bg-card/80 shadow-[0_24px_70px_-48px_rgba(0,0,0,0.85)]"
                key={band.id}
              >
                <MediaFrame
                  alt={band.bandPhoto?.alt || band.bandName}
                  className="min-h-[18rem] rounded-none border-0"
                  sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 100vw"
                  src={getMediaSrc(band.bandPhoto, '/placeholders/featured-band.svg')}
                />

                <div className="space-y-3 p-5">
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {band.isFeatured ? (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                        Featured
                      </span>
                    ) : null}
                    <span className="rounded-full border border-white/10 px-3 py-1">{band.genre}</span>
                  </div>

                  <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-white">
                    {band.bandName}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground line-clamp-3">{band.description}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            description="Feature a band in Payload CMS and it will appear here automatically."
            title="No featured bands yet"
          />
        )}
      </SectionContainer>

      <SectionContainer>
        <div
          className="rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/18 via-black/45 to-black/75 p-6 shadow-[0_34px_100px_-60px_rgba(209,31,42,0.72)] sm:p-8"
          id="booking"
        >
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary-foreground/80">
              Book Now
            </p>
            <h2 className="font-display text-4xl uppercase tracking-[0.1em] text-white sm:text-5xl">
              Ready for your next rehearsal?
            </h2>
            <p className="text-sm leading-7 text-white/78 sm:text-base">
              {contactInfo.bookingInstructions}
            </p>
            <p className="text-sm text-white/62">
              By reservation only. Schedule is subject to availability.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <BookNowButton href={ctaHref} label={siteSettings.mainCtaText} size="lg" />
            {contactInfo.facebookPage ? (
              <BookNowButton
                href={contactInfo.facebookPage}
                label="Message on Facebook"
                size="lg"
                variant="outline"
              />
            ) : null}
          </div>
        </div>
      </SectionContainer>
    </PageShell>
  )
}
