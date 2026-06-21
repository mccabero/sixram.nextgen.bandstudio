import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { isExternalUrl } from '@/lib/utils'

type BookNowButtonProps = Omit<ButtonProps, 'asChild'> & {
  href?: string | null
  label?: string
}

export function BookNowButton({
  className,
  href,
  label = 'Book Now',
  size = 'default',
  variant = 'default',
  ...props
}: BookNowButtonProps) {
  const targetHref = href || '/contact#booking'
  const external = isExternalUrl(targetHref)

  return (
    <Button asChild className={className} size={size} variant={variant} {...props}>
      <Link href={targetHref} rel={external ? 'noreferrer' : undefined} target={external ? '_blank' : undefined}>
        {label}
        <ArrowRight className="size-4" />
      </Link>
    </Button>
  )
}
