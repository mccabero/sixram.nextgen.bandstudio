import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type PageHeadingProps = {
  actions?: ReactNode
  className?: string
  description: string
  eyebrow?: string
  title: string
}

export function PageHeading({
  actions,
  className,
  description,
  eyebrow,
  title,
}: PageHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-6 border-b border-white/8 pb-8 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div className="max-w-3xl space-y-4">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-3">
          <h1 className="font-display text-4xl uppercase tracking-[0.1em] text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  )
}
