import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Camera, FolderKanban } from 'lucide-react'
import { notFound } from 'next/navigation'

import { BookNowButton } from '@/components/site/book-now-button'
import { EmptyState } from '@/components/site/empty-state'
import { GalleryProfileCarousel } from '@/components/site/gallery-profile-carousel'
import { PageShell } from '@/components/site/page-shell'
import { SectionContainer } from '@/components/site/section-container'
import { Button } from '@/components/ui/button'
import { buildPageMetadata } from '@/lib/seo'
import {
  getContactInfoData,
  getGalleryProfileBySlug,
  getGalleryProfilesData,
  getSiteSettingsData,
} from '@/lib/site-data'
import { formatDate, getPrimaryCtaHref } from '@/lib/utils'

type GalleryProfilePageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const profiles = await getGalleryProfilesData()

  return profiles.map((profile) => ({
    slug: profile.slug,
  }))
}

export async function generateMetadata({ params }: GalleryProfilePageProps): Promise<Metadata> {
  const { slug } = await params
  const [siteSettings, contactInfo, profile] = await Promise.all([
    getSiteSettingsData(),
    getContactInfoData(),
    getGalleryProfileBySlug(slug),
  ])

  if (!profile) {
    return buildPageMetadata({
      contactInfo,
      description: 'View approved band and client sessions from Sixram Band Studio.',
      ogPage: 'gallery',
      path: '/gallery',
      siteSettings,
      title: 'Gallery',
    })
  }

  return buildPageMetadata({
    contactInfo,
    description:
      profile.summary ||
      `Browse approved session images and highlights for ${profile.name} at Sixram Band Studio.`,
    ogPage: 'gallery',
    path: `/gallery/${profile.slug}`,
    siteSettings,
    title: `${profile.name} Gallery`,
  })
}

export default async function GalleryProfilePage({ params }: GalleryProfilePageProps) {
  const { slug } = await params
  const [profile, siteSettings] = await Promise.all([
    getGalleryProfileBySlug(slug),
    getSiteSettingsData(),
  ])

  if (!profile) {
    notFound()
  }

  const ctaHref = getPrimaryCtaHref(siteSettings.mainCtaLink)
  const latestSessionDate = formatDate(profile.latestSessionDate)

  return (
    <PageShell>
      <SectionContainer className="space-y-8">
        <div className="space-y-6 border-b border-white/8 pb-8">
          <Button asChild className="w-fit" variant="outline">
            <Link href="/gallery">
              <ArrowLeft className="size-4" />
              Back to Gallery
            </Link>
          </Button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                Band / Client Profile
              </p>
              <div className="space-y-3">
                <h1 className="font-display text-4xl uppercase tracking-[0.1em] text-white sm:text-5xl lg:text-6xl">
                  {profile.name}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {profile.summary || 'Approved gallery moments collected from Sixram Band Studio sessions.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <BookNowButton href={ctaHref} label={siteSettings.mainCtaText} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.6rem] border border-white/8 bg-card/85 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              <FolderKanban className="size-4" />
              Sessions
            </p>
            <p className="mt-4 text-3xl font-semibold text-white">{profile.sessionCount}</p>
          </div>

          <div className="rounded-[1.6rem] border border-white/8 bg-card/85 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              <Camera className="size-4" />
              Images
            </p>
            <p className="mt-4 text-3xl font-semibold text-white">{profile.imageCount}</p>
          </div>

          <div className="rounded-[1.6rem] border border-white/8 bg-card/85 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              <CalendarDays className="size-4" />
              Latest Session
            </p>
            <p className="mt-4 text-lg font-semibold text-white">
              {latestSessionDate || 'Date not available'}
            </p>
          </div>
        </div>

        {profile.carouselImages.length ? (
          <GalleryProfileCarousel images={profile.carouselImages} profileName={profile.name} />
        ) : (
          <EmptyState
            description="This profile does not have approved session images yet. Add or approve more images in Payload CMS and they will appear here automatically."
            title="No approved images yet"
          />
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Session Notes
            </p>
            <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-white sm:text-4xl">
              Session Highlights
            </h2>
          </div>

          <div className="grid gap-4">
            {profile.sessions.map((session) => (
              <article
                className="rounded-[1.7rem] border border-white/8 bg-card/85 p-5 shadow-[0_24px_70px_-52px_rgba(0,0,0,0.88)]"
                key={session.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {session.isFeatured ? (
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                          Featured session
                        </span>
                      ) : null}
                      {session.sessionDate ? (
                        <span className="rounded-full border border-white/10 px-3 py-1">
                          {formatDate(session.sessionDate)}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{session.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {session.caption || 'Approved session gallery from Sixram Band Studio.'}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-white/82">
                    <Camera className="size-4 text-primary" />
                    {session.imageCount} image{session.imageCount === 1 ? '' : 's'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionContainer>
    </PageShell>
  )
}
