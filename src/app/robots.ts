import type { MetadataRoute } from 'next'

import { getAbsoluteSiteUrl, resolveMetadataBase } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    host: resolveMetadataBase().origin,
    rules: [
      {
        allow: '/',
        disallow: '/admin',
        userAgent: '*',
      },
    ],
    sitemap: getAbsoluteSiteUrl('/sitemap.xml'),
  }
}
