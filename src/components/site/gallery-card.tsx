import { CalendarDays, Camera } from 'lucide-react'

import { MediaFrame } from '@/components/site/media-frame'
import { formatDate, getMediaSrc } from '@/lib/utils'
import type { GalleryItem } from '@/types/content'

type GalleryCardProps = {
  item: GalleryItem
}

export function GalleryCard({ item }: GalleryCardProps) {
  const sessionDate = formatDate(item.sessionDate)

  return (
    <article className="overflow-hidden rounded-[1.85rem] border border-white/8 bg-card/85 shadow-[0_28px_75px_-44px_rgba(0,0,0,0.82)]">
      <MediaFrame
        alt={item.images[0]?.alt || item.title}
        className="aspect-[4/5] min-h-[18rem] rounded-none border-0"
        sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 100vw"
        src={getMediaSrc(item.images[0], '/placeholders/gallery-session.svg')}
      />

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
          {item.isFeatured ? (
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
              Featured
            </span>
          ) : null}

          {sessionDate ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <CalendarDays className="size-4" />
              {sessionDate}
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-3xl uppercase tracking-[0.08em] text-white">
            {item.title}
          </h3>
          <p className="text-sm text-white/82">{item.bandOrClientName || 'Sixram Band Studio'}</p>
          <p className="text-sm leading-7 text-muted-foreground line-clamp-3">
            {item.caption || 'Approved gallery content from the Payload media library.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Camera className="size-4 text-primary" />
          {item.images.length || 1} image{item.images.length === 1 ? '' : 's'} in this gallery item
        </div>
      </div>
    </article>
  )
}
