import type { Metadata } from 'next'
import Link from 'next/link'

import { PageShell } from '@/components/site/page-shell'
import { SectionContainer } from '@/components/site/section-container'
import { Button } from '@/components/ui/button'
import { buildPageMetadata } from '@/lib/seo'
import { getContactInfoData, getSiteSettingsData } from '@/lib/site-data'

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, contactInfo] = await Promise.all([getSiteSettingsData(), getContactInfoData()])

  return buildPageMetadata({
    contactInfo,
    description: 'The page you tried to open is not available. Head back to Sixram Band Studio home or contact the studio directly.',
    ogPage: 'not-found',
    path: '/not-found',
    siteSettings,
    title: 'Page Not Found',
  })
}

export default async function FrontendNotFoundPage() {
  const contactInfo = await getContactInfoData()

  return (
    <PageShell>
      <SectionContainer>
        <div className="overflow-hidden rounded-[2.2rem] border border-white/8 bg-[radial-gradient(circle_at_top,_rgba(209,31,42,0.18),_transparent_42%),linear-gradient(180deg,rgba(18,18,18,0.96),rgba(5,5,5,1))] px-6 py-12 shadow-[0_36px_110px_-70px_rgba(209,31,42,0.52)] sm:px-8 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-primary">404</p>
            <h1 className="font-display text-5xl uppercase tracking-[0.1em] text-white sm:text-6xl">
              This page missed the downbeat.
            </h1>
            <p className="text-sm leading-8 text-white/72 sm:text-base">
              The page you are looking for is not live right now. Head back to the main site or contact {contactInfo.studioName} for booking help.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/contact">Contact Studio</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Need a direct handoff instead? Visit the{' '}
              <Link className="font-semibold text-white transition hover:text-primary" href="/contact">
                Contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </SectionContainer>
    </PageShell>
  )
}
