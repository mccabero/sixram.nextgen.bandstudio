import Image from 'next/image'
import Link from 'next/link'

import { BookNowButton } from '@/components/site/book-now-button'
import { SectionContainer } from '@/components/site/section-container'
import { footerNavigation } from '@/lib/placeholders'
import { getMediaSrc, getPhoneHref, isExternalUrl } from '@/lib/utils'
import type { ContactInfoData, MediaAsset } from '@/types/content'

type FooterProps = {
  contactInfo: ContactInfoData
  ctaHref?: string | null
  ctaLabel?: string
  logo?: MediaAsset | null
}

export function Footer({ contactInfo, ctaHref, ctaLabel, logo }: FooterProps) {
  const logoSrc = getMediaSrc(logo, '/branding/sixram-logo.png')
  const phoneHref = getPhoneHref(contactInfo.contactNumber)

  return (
    <footer className="border-t border-white/8 bg-black/45">
      <SectionContainer className="py-12 sm:py-14">
        <div className="grid gap-10 rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 shadow-[0_28px_90px_-60px_rgba(0,0,0,0.9)] lg:grid-cols-[1.2fr_0.8fr_0.9fr] lg:p-8">
          <div className="space-y-5">
            <Link className="group inline-flex items-center gap-4" href="/">
              <div className="relative h-14 w-32 overflow-hidden rounded-[1.15rem] border border-white/12 bg-white/95 p-2 shadow-[0_18px_40px_-24px_rgba(255,255,255,0.3)] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_24px_52px_-28px_rgba(209,31,42,0.45)]">
                <Image
                  alt={logo?.alt || `${contactInfo.studioName} logo`}
                  className="object-contain"
                  fill
                  sizes="128px"
                  src={logoSrc}
                />
              </div>
              <div>
                <p className="font-display text-3xl uppercase tracking-[0.08em] text-white">
                  {contactInfo.studioName}
                </p>
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">
                  Reservation-Only Sessions
                </p>
              </div>
            </Link>

            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              Modern rehearsal space with optional multitrack live recording, reliable backline, and a cleaner booking flow for bands that want to show up ready.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <BookNowButton
                href={ctaHref || '/contact'}
                label={ctaLabel || 'Book a Session'}
              />

              {contactInfo.facebookPage ? (
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-white"
                  href={contactInfo.facebookPage}
                  rel={isExternalUrl(contactInfo.facebookPage) ? 'noreferrer' : undefined}
                  target={isExternalUrl(contactInfo.facebookPage) ? '_blank' : undefined}
                >
                  Message on Facebook
                </Link>
              ) : null}
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Explore
            </p>
            <div className="grid gap-3 text-sm">
              {footerNavigation.map((link) => (
                <Link
                  key={link.href}
                  className="text-muted-foreground transition hover:text-white"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Contact
              </p>
              {phoneHref ? (
                <a className="transition hover:text-white" href={phoneHref}>
                  {contactInfo.contactNumber}
                </a>
              ) : contactInfo.contactNumber ? (
                <p>{contactInfo.contactNumber}</p>
              ) : (
                <p>Contact number will appear here once it is added.</p>
              )}
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Hours
              </p>
              <p>{contactInfo.businessHours}</p>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Address
              </p>
              <p>{contactInfo.address}</p>
            </div>

            {contactInfo.googleMapsLink ? (
              <Link
                className="inline-flex text-sm font-semibold text-white transition hover:text-primary"
                href={contactInfo.googleMapsLink}
                rel={isExternalUrl(contactInfo.googleMapsLink) ? 'noreferrer' : undefined}
                target={isExternalUrl(contactInfo.googleMapsLink) ? '_blank' : undefined}
              >
                Open Google Maps
              </Link>
            ) : null}
          </div>
        </div>
      </SectionContainer>
    </footer>
  )
}
