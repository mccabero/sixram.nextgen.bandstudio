import { BadgeCheck, Clock3, Music4, ShieldCheck } from 'lucide-react'

import { formatCurrency } from '@/lib/utils'
import type { RateItem } from '@/types/content'

type RateCardProps = {
  rate: RateItem
}

const signatureRates = new Set([
  'Rehearsal Only',
  '2 Hours + Free Multitrack Live Recording',
])

export function RateCard({ rate }: RateCardProps) {
  const isSignatureRate = signatureRates.has(rate.packageName)

  return (
    <article className="flex h-full flex-col rounded-[1.85rem] border border-white/8 bg-card/85 p-6 shadow-[0_28px_70px_-42px_rgba(0,0,0,0.82)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {rate.isFeatured ? (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                Featured
              </span>
            ) : null}
            {isSignatureRate ? (
              <span className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-white/80">
                Studio default
              </span>
            ) : null}
            <span className="rounded-full border border-white/10 px-3 py-1">{rate.duration}</span>
          </div>

          <h3 className="font-display text-3xl uppercase tracking-[0.08em] text-white">
            {rate.packageName}
          </h3>
        </div>

        <div className="rounded-[1.2rem] border border-primary/20 bg-primary/10 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">Rate</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(rate.price)}</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-muted-foreground">{rate.description}</p>

      <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-black/25 p-5">
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
          <Clock3 className="size-4 text-primary" />
          Duration and inclusions
        </div>

        <ul className="grid gap-3 text-sm text-white/82">
          <li className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{rate.duration}</span>
          </li>
          {rate.inclusions.length ? (
            rate.inclusions.map((inclusion) => (
              <li className="flex items-start gap-3" key={inclusion}>
                <Music4 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{inclusion}</span>
              </li>
            ))
          ) : (
            <li className="flex items-start gap-3">
              <Music4 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>Package inclusions will be added soon.</span>
            </li>
          )}
        </ul>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-white/72">
        <ShieldCheck className="size-4 text-primary" />
        Reservation only. No walk-ins.
      </div>
    </article>
  )
}
