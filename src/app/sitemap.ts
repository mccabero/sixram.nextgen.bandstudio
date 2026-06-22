import type { MetadataRoute } from 'next'

import { getAbsoluteSiteUrl } from '@/lib/seo'
import { getGalleryProfilesData } from '@/lib/site-data'

const publicRoutes = ['/', '/schedule', '/rates', '/gallery', '/featured-bands', '/promos', '/contact']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const galleryProfiles = await getGalleryProfilesData()

  return [
    ...publicRoutes.map((route) => ({
      lastModified,
      url: getAbsoluteSiteUrl(route),
    })),
    ...galleryProfiles.map((profile) => ({
      lastModified,
      url: getAbsoluteSiteUrl(`/gallery/${profile.slug}`),
    })),
  ]
}
