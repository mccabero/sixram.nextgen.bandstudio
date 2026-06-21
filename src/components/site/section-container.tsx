import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SectionContainerProps = ComponentPropsWithoutRef<'section'> & {
  children: ReactNode
}

export function SectionContainer({
  children,
  className,
  ...props
}: SectionContainerProps) {
  return (
    <section className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </section>
  )
}
