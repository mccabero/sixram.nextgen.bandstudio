import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock3, MapPin, MessageSquareMore, PhoneCall, Radio } from 'lucide-react'

import { BookNowButton } from '@/components/site/book-now-button'
import { PageHeading } from '@/components/site/page-heading'
import { PageShell } from '@/components/site/page-shell'
import { SectionContainer } from '@/components/site/section-container'
import { Button } from '@/components/ui/button'
import { buildPageMetadata } from '@/lib/seo'
import { getContactInfoData, getSiteSettingsData } from '@/lib/site-data'
import { getPhoneHref, getPrimaryCtaHref, isExternalUrl } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, contactInfo] = await Promise.all([getSiteSettingsData(), getContactInfoData()])

  return buildPageMetadata({
    contactInfo,
    description: 'Contact Sixram Band Studio to book your next rehearsal or live recording session.',
    path: '/contact',
    siteSettings,
    title: 'Contact',
  })
}

export default async function ContactPage() {
  const [contactInfo, siteSettings] = await Promise.all([getContactInfoData(), getSiteSettingsData()])
  const ctaHref = getPrimaryCtaHref(siteSettings.mainCtaLink)
  const phoneHref = getPhoneHref(contactInfo.contactNumber)

  return (
    <PageShell>
      <SectionContainer className="space-y-8">
        <PageHeading
          actions={<BookNowButton href={ctaHref} label={siteSettings.mainCtaText} />}
          description="Everything here is managed through the Contact Info global in Payload CMS, so the public contact details stay easy to update and safe to publish."
          eyebrow="Public Page"
          title="Contact"
        />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div
            className="space-y-5 rounded-[1.95rem] border border-white/8 bg-card/85 p-6 shadow-[0_32px_90px_-56px_rgba(0,0,0,0.88)] lg:p-8"
            id="booking"
          >
            <div className="space-y-4">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                <MessageSquareMore className="size-4" />
                Booking Instructions
              </p>
              <h2 className="font-display text-4xl uppercase tracking-[0.1em] text-white sm:text-5xl">
                Reserve first, rehearse smoother.
              </h2>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                {contactInfo.bookingInstructions}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/8 bg-black/25 p-5 text-sm text-white/80">
              <p>
                <span className="font-semibold text-white">Public note:</span> By reservation only. No walk-ins. Final scheduling is always based on availability.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <BookNowButton href={ctaHref} label={siteSettings.mainCtaText} size="lg" />

              {contactInfo.facebookPage ? (
                <Button asChild size="lg" variant="outline">
                  <Link
                    href={contactInfo.facebookPage}
                    rel={isExternalUrl(contactInfo.facebookPage) ? 'noreferrer' : undefined}
                    target={isExternalUrl(contactInfo.facebookPage) ? '_blank' : undefined}
                  >
                    Message on Facebook
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/8 bg-card/85 p-5">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                <Radio className="size-4" />
                Studio Name
              </p>
              <p className="mt-4 text-xl font-semibold text-white">{contactInfo.studioName}</p>
            </div>

            <div className="rounded-[1.75rem] border border-white/8 bg-card/85 p-5">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                <PhoneCall className="size-4" />
                Contact Number
              </p>
              {phoneHref ? (
                <a className="mt-4 block text-xl font-semibold text-white transition hover:text-primary" href={phoneHref}>
                  {contactInfo.contactNumber}
                </a>
              ) : contactInfo.contactNumber ? (
                <p className="mt-4 text-xl font-semibold text-white">{contactInfo.contactNumber}</p>
              ) : (
                <p className="mt-4 text-base text-muted-foreground">Add a contact number in Payload CMS to show it here.</p>
              )}
            </div>

            <div className="rounded-[1.75rem] border border-white/8 bg-card/85 p-5">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                <Clock3 className="size-4" />
                Business Hours
              </p>
              <p className="mt-4 text-base leading-7 text-white/82">{contactInfo.businessHours}</p>
            </div>

            <div className="rounded-[1.75rem] border border-white/8 bg-card/85 p-5">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                <MessageSquareMore className="size-4" />
                Facebook Page
              </p>
              {contactInfo.facebookPage ? (
                <Link
                  className="mt-4 inline-flex text-base font-semibold text-white transition hover:text-primary"
                  href={contactInfo.facebookPage}
                  rel={isExternalUrl(contactInfo.facebookPage) ? 'noreferrer' : undefined}
                  target={isExternalUrl(contactInfo.facebookPage) ? '_blank' : undefined}
                >
                  Open Facebook
                </Link>
              ) : (
                <p className="mt-4 text-base text-muted-foreground">No Facebook page added yet.</p>
              )}
            </div>

            <div className="rounded-[1.75rem] border border-white/8 bg-card/85 p-5 sm:col-span-2">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                <MapPin className="size-4" />
                Address
              </p>
              <p className="mt-4 text-base leading-7 text-white/82">{contactInfo.address}</p>

              {contactInfo.googleMapsLink ? (
                <Button asChild className="mt-5" variant="outline">
                  <Link
                    href={contactInfo.googleMapsLink}
                    rel={isExternalUrl(contactInfo.googleMapsLink) ? 'noreferrer' : undefined}
                    target={isExternalUrl(contactInfo.googleMapsLink) ? '_blank' : undefined}
                  >
                    Open Google Maps
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </SectionContainer>
    </PageShell>
  )
}
