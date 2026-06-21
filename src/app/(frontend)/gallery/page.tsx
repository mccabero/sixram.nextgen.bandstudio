import { BookNowButton } from '@/components/site/book-now-button'
import { EmptyState } from '@/components/site/empty-state'
import { GalleryCard } from '@/components/site/gallery-card'
import { PageHeading } from '@/components/site/page-heading'
import { PageShell } from '@/components/site/page-shell'
import { SectionContainer } from '@/components/site/section-container'
import { getGalleryData, getSiteSettingsData } from '@/lib/site-data'
import { cn, getPrimaryCtaHref } from '@/lib/utils'

export const metadata = {
  title: 'Gallery',
}

export default async function GalleryPage() {
  const [gallery, siteSettings] = await Promise.all([getGalleryData(), getSiteSettingsData()])

  const ctaHref = getPrimaryCtaHref(siteSettings.mainCtaLink)

  return (
    <PageShell>
      <SectionContainer className="space-y-8">
        <PageHeading
          actions={<BookNowButton href={ctaHref} label={siteSettings.mainCtaText} />}
          description="Approved gallery items appear here first, with featured session visuals leading the page and the rest arranged in a responsive image-first grid."
          eyebrow="Public Page"
          title="Gallery"
        />

        {gallery.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {gallery.map((item, index) => (
              <div className={cn(index === 0 ? 'xl:col-span-2' : '')} key={item.id}>
                <GalleryCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            description="Add or approve gallery content in Payload CMS and it will show here once the item is marked ready for posting."
            title="Gallery content is coming soon"
          />
        )}
      </SectionContainer>
    </PageShell>
  )
}
