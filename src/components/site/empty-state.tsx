import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type EmptyStateProps = {
  action?: ReactNode
  className?: string
  description: string
  title: string
}

export function EmptyState({ action, className, description, title }: EmptyStateProps) {
  return (
    <div className={cn('rounded-[1.9rem] border border-dashed border-white/12 bg-white/[0.03] p-8 text-center shadow-[0_24px_70px_-56px_rgba(0,0,0,0.8)]', className)}>
      <div className="mx-auto max-w-xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">
          Nothing live yet
        </p>
        <h2 className="font-display text-3xl uppercase tracking-[0.1em] text-white">
          {title}
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  )
}
