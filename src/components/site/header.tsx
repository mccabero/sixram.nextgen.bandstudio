import Image from 'next/image'
import Link from 'next/link'

import { BookNowButton } from '@/components/site/book-now-button'
import { NavigationMenu } from '@/components/site/navigation-menu'
import { SectionContainer } from '@/components/site/section-container'
import { siteNavigation } from '@/lib/placeholders'
import { getMediaSrc } from '@/lib/utils'
import type { MediaAsset } from '@/types/content'

type HeaderProps = {
  ctaHref?: string | null
  ctaLabel?: string
  logo?: MediaAsset | null
  siteName: string
}

export function Header({ ctaHref, ctaLabel, logo, siteName }: HeaderProps) {
  const logoSrc = getMediaSrc(logo, '/branding/sixram-mark.png')

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(4,4,4,0.72)] backdrop-blur-2xl">
      <SectionContainer className="relative">
        <div className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6">
          <Link className="group flex items-center gap-3" href="/">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-[1.15rem] border border-white/10 bg-white/95 p-2 shadow-[0_18px_45px_-24px_rgba(255,255,255,0.32)] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_24px_56px_-28px_rgba(209,31,42,0.5)] sm:size-14">
              <Image
                alt={logo?.alt || `${siteName} logo`}
                className="object-contain"
                fill
                priority
                sizes="(min-width: 640px) 56px, 48px"
                src={logoSrc}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate font-display text-2xl uppercase tracking-[0.08em] text-white sm:text-3xl">
                {siteName}
              </p>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">
                Rehearsal + Live Recording
              </p>
            </div>
          </Link>

          <div className="justify-self-end lg:justify-self-center">
            <NavigationMenu
              ctaHref={ctaHref}
              ctaLabel={ctaLabel}
              links={siteNavigation}
              showDesktopCta={false}
            />
          </div>

          <BookNowButton
            className="hidden lg:inline-flex lg:justify-self-end"
            href={ctaHref}
            label={ctaLabel}
            size="sm"
          />
        </div>
      </SectionContainer>
    </header>
  )
}
