import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SectionIntroProps = {
  action?: ReactNode
  className?: string
  description?: string
  eyebrow?: string
  title: string
}

export function SectionIntro({
  action,
  className,
  description,
  eyebrow,
  title,
}: SectionIntroProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="max-w-2xl space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">{eyebrow}</p>
        ) : null}
        <h2 className="font-display text-3xl uppercase tracking-[0.1em] text-white sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
