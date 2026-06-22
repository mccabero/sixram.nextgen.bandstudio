'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { BookNowButton } from '@/components/site/book-now-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { NavLink } from '@/types/content'

type NavigationMenuProps = {
  ctaHref?: string | null
  ctaLabel?: string
  links: NavLink[]
  showDesktopCta?: boolean
}

function isLinkActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname.startsWith(href)
}

export function NavigationMenu({
  ctaHref,
  ctaLabel,
  links,
  showDesktopCta = true,
}: NavigationMenuProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative flex items-center justify-end gap-3 lg:justify-center">
      <nav className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/[0.03] p-1 lg:flex">
        {links.map((link) => {
          const active = isLinkActive(pathname, link.href)

          return (
            <Link
              key={link.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground',
                active && 'bg-white/8 text-foreground shadow-[0_12px_28px_-20px_rgba(255,255,255,0.4)]',
              )}
              href={link.href}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      {showDesktopCta ? (
        <BookNowButton className="hidden lg:inline-flex" href={ctaHref} label={ctaLabel} size="sm" />
      ) : null}

      <Button
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="lg:hidden"
        onClick={() => setIsOpen((value) => !value)}
        size="icon"
        variant="outline"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(22rem,92vw)] rounded-[1.6rem] border border-white/10 bg-[rgba(4,4,4,0.97)] p-4 shadow-[0_32px_90px_-36px_rgba(0,0,0,0.88)] backdrop-blur xl:hidden">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Navigation</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Move through the public pages and jump straight to booking when ready.
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {links.map((link) => {
              const active = isLinkActive(pathname, link.href)

              return (
                <Link
                  key={link.href}
                  className={cn(
                    'rounded-[1.15rem] px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-white/6 hover:text-foreground',
                    active && 'bg-white/8 text-foreground',
                  )}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <BookNowButton
            className="mt-4 w-full justify-center"
            href={ctaHref}
            label={ctaLabel}
            onClick={() => setIsOpen(false)}
          />
        </div>
      ) : null}
    </div>
  )
}
