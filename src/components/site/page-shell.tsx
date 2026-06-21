import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type PageShellProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode
}

export function PageShell({ children, className, ...props }: PageShellProps) {
  return (
    <div
      className={cn('space-y-12 pb-20 pt-10 sm:space-y-16 sm:pb-28 sm:pt-14', className)}
      {...props}
    >
      {children}
    </div>
  )
}
