import { CalendarDays, Tag } from 'lucide-react'

import { BookNowButton } from '@/components/site/book-now-button'
import { MediaFrame } from '@/components/site/media-frame'
import { formatCurrency, formatPromoWindow, getMediaSrc } from '@/lib/utils'
import type { PromoItem } from '@/types/content'

type PromoCardProps = {
  bookingHref?: string | null
  bookingLabel?: string
  promo: PromoItem
}

export function PromoCard({
  bookingHref,
  bookingLabel = 'Message us to book this promo',
  promo,
}: PromoCardProps) {
  const savings =
    promo.originalPrice && promo.originalPrice > promo.promoPrice
      ? promo.originalPrice - promo.promoPrice
      : null

  return (
    <article className="grid gap-5 rounded-[1.85rem] border border-white/8 bg-card/85 p-5 shadow-[0_32px_90px_-44px_rgba(0,0,0,0.85)] lg:grid-cols-[0.95fr_1.05fr] lg:p-6">
      <MediaFrame
        alt={promo.promoImage?.alt || promo.promoTitle}
        className="aspect-[16/9] min-h-[14rem] bg-black/75 p-3"
        imageClassName="object-contain object-left"
        sizes="(min-width: 1024px) 38vw, 100vw"
        showOverlay={false}
        src={getMediaSrc(promo.promoImage, '/placeholders/promo-recording.svg')}
      />

      <div className="flex flex-col justify-between gap-6">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
              Active promo
            </span>
            {savings ? (
              <span className="rounded-full border border-white/10 px-3 py-1 text-white/75">
                Save {formatCurrency(savings)}
              </span>
            ) : null}
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-4xl uppercase tracking-[0.08em] text-white">
              {promo.promoTitle}
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">{promo.description}</p>
          </div>
        </div>

        <div className="grid gap-4 rounded-[1.5rem] border border-white/8 bg-black/25 p-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              <Tag className="size-4" />
              Promo price
            </p>
            <p className="text-2xl font-semibold text-white">{formatCurrency(promo.promoPrice)}</p>
            {promo.originalPrice ? (
              <p className="text-sm text-muted-foreground line-through">
                {formatCurrency(promo.originalPrice)}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              <CalendarDays className="size-4" />
              Validity
            </p>
            <p className="text-sm leading-6 text-white">{formatPromoWindow(promo.startDate, promo.endDate)}</p>
          </div>
        </div>

        <BookNowButton href={bookingHref} label={bookingLabel} />
      </div>
    </article>
  )
}
