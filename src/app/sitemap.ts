import type { MetadataRoute } from 'next'

import { getAbsoluteSiteUrl } from '@/lib/seo'

const publicRoutes = ['/', '/schedule', '/rates', '/gallery', '/featured-bands', '/promos', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return publicRoutes.map((route) => ({
    lastModified,
    url: getAbsoluteSiteUrl(route),
  }))
}
