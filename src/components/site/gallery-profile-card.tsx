import Link from 'next/link'
import { ArrowRight, CalendarDays, Camera, FolderKanban } from 'lucide-react'

import { MediaFrame } from '@/components/site/media-frame'
import { formatDate, getMediaSrc } from '@/lib/utils'
import type { GalleryProfileSummary } from '@/types/content'

type GalleryProfileCardProps = {
  profile: GalleryProfileSummary
}

export function GalleryProfileCard({ profile }: GalleryProfileCardProps) {
  const latestSessionDate = formatDate(profile.latestSessionDate)

  return (
    <Link
      className="group grid overflow-hidden rounded-[1.9rem] border border-white/8 bg-card/85 transition hover:border-white/14 hover:bg-card hover:shadow-[0_30px_84px_-48px_rgba(0,0,0,0.85)] lg:grid-cols-[0.92fr_1.08fr]"
      href={`/gallery/${profile.slug}`}
    >
      <MediaFrame
        alt={profile.coverImage?.alt || `${profile.name} gallery cover`}
        className="aspect-[4/3] min-h-[16rem] rounded-none border-0"
        sizes="(min-width: 1024px) 34vw, 100vw"
        src={getMediaSrc(profile.coverImage, '/placeholders/gallery-session.svg')}
      />

      <div className="flex min-w-0 flex-col justify-between gap-5 p-5 sm:p-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {profile.isFeatured ? (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                Featured profile
              </span>
            ) : null}
            {latestSessionDate ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                <CalendarDays className="size-4" />
                {latestSessionDate}
              </span>
            ) : null}
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-white sm:text-4xl">
              {profile.name}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {profile.summary || 'Approved gallery highlights from Sixram Band Studio.'}
            </p>
          </div>

          {profile.featuredSessionTitle ? (
            <p className="text-sm text-white/82">
              Featured session: <span className="font-semibold text-white">{profile.featuredSessionTitle}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-4">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
              <FolderKanban className="size-4 text-primary" />
              {profile.sessionCount} session{profile.sessionCount === 1 ? '' : 's'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
              <Camera className="size-4 text-primary" />
              {profile.imageCount} image{profile.imageCount === 1 ? '' : 's'}
            </span>
          </div>

          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white transition group-hover:text-primary">
            View Profile
            <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
