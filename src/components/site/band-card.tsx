import { Globe, ImageIcon, Music2, PlayCircle } from 'lucide-react'
import Link from 'next/link'

import { MediaFrame } from '@/components/site/media-frame'
import { getMediaSrc, getYouTubeEmbedUrl, isExternalUrl } from '@/lib/utils'
import type { FeaturedBandItem } from '@/types/content'

type BandCardProps = {
  band: FeaturedBandItem
}

type SocialLink = {
  href: string
  icon: typeof Globe
  label: string
}

export function BandCard({ band }: BandCardProps) {
  const socialLinks = [
    { href: band.facebookLink, icon: Globe, label: 'Facebook' },
    { href: band.instagramLink, icon: ImageIcon, label: 'Instagram' },
    { href: band.tiktokLink, icon: Music2, label: 'TikTok' },
  ].filter((entry): entry is SocialLink => Boolean(entry.href))

  const embedUrl = getYouTubeEmbedUrl(band.youtubeVideoUrl)

  return (
    <article className="overflow-hidden rounded-[1.9rem] border border-white/8 bg-card/85 shadow-[0_28px_80px_-44px_rgba(0,0,0,0.84)]">
      <div className="grid xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-5 p-5 sm:p-6">
          <MediaFrame
            alt={band.bandPhoto?.alt || band.bandName}
            className="aspect-[4/3] min-h-[18rem] rounded-[1.5rem]"
            sizes="(min-width: 1280px) 28vw, 100vw"
            src={getMediaSrc(band.bandPhoto, '/placeholders/featured-band.svg')}
          />

          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {band.isFeatured ? (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                Featured band
              </span>
            ) : null}
            <span className="rounded-full border border-white/10 px-3 py-1">{band.genre}</span>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-3xl uppercase tracking-[0.08em] text-white">
              {band.bandName}
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">{band.description}</p>
          </div>

          {socialLinks.length ? (
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground transition hover:border-white/18 hover:text-white"
                  href={href}
                  rel={isExternalUrl(href) ? 'noreferrer' : undefined}
                  target={isExternalUrl(href) ? '_blank' : undefined}
                >
                  <Icon className="size-4 text-primary" />
                  {label}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No social links added yet.</p>
          )}
        </div>

        <div className="border-t border-white/8 p-5 sm:p-6 xl:border-l xl:border-t-0">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Performance Video
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Valid YouTube links are embedded automatically for a cleaner showcase.
            </p>
          </div>

          {embedUrl ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/35 shadow-[0_18px_48px_-28px_rgba(0,0,0,0.8)]">
              <div className="aspect-video">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                  src={embedUrl}
                  title={`${band.bandName} YouTube performance`}
                />
              </div>
            </div>
          ) : (
            <div className="flex min-h-[16rem] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/12 bg-white/[0.03] p-6 text-center">
              <PlayCircle className="size-8 text-primary" />
              <p className="mt-4 text-lg font-semibold text-white">No video added yet</p>
              <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
                Add a valid YouTube link in Payload CMS to show an embedded live performance or studio video here.
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
