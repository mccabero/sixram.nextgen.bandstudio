import type { Metadata } from 'next'

import { placeholderContactInfo, placeholderSiteSettings } from '@/lib/placeholders'
import { getMediaSrc, hasMeaningfulExternalUrl, isExternalUrl } from '@/lib/utils'
import type { ContactInfoData, SiteSettingsData } from '@/types/content'

const fallbackSiteUrl = 'http://localhost:3000'

export const defaultSiteName = placeholderContactInfo.studioName
export const defaultSeoTitle = placeholderSiteSettings.seoTitle
export const defaultSeoDescription = placeholderSiteSettings.seoDescription

function sanitizeSiteUrl(value?: string | null) {
  if (!value) {
    return null
  }

  try {
    return new URL(value.trim())
  } catch {
    return null
  }
}

function toAbsoluteUrl(value: string) {
  if (isExternalUrl(value)) {
    return value
  }

  return new URL(value, resolveMetadataBase()).toString()
}

function isFallbackPreviewAsset(src: string) {
  return src.startsWith('/placeholders/')
}

function resolveSeoImage(siteSettings?: SiteSettingsData | null) {
  const heroSrc = getMediaSrc(siteSettings?.heroImage, '/placeholders/studio-hero.svg')

  if (siteSettings?.heroImage && !isFallbackPreviewAsset(heroSrc)) {
    return {
      alt: siteSettings.heroImage.alt || `${defaultSiteName} hero image`,
      url: toAbsoluteUrl(heroSrc),
    }
  }

  const logoSrc = getMediaSrc(siteSettings?.logo, '/branding/sixram-logo.png')

  return {
    alt: siteSettings?.logo?.alt || `${defaultSiteName} logo`,
    url: toAbsoluteUrl(logoSrc),
  }
}

function getBusinessName(contactInfo?: ContactInfoData | null) {
  return contactInfo?.studioName || defaultSiteName
}

function getMeaningfulAddress(contactInfo?: ContactInfoData | null) {
  const address = contactInfo?.address?.trim()

  if (!address || address === placeholderContactInfo.address) {
    return null
  }

  return address
}

function getMeaningfulPhone(contactInfo?: ContactInfoData | null) {
  const phone = contactInfo?.contactNumber?.trim()

  if (!phone || phone === placeholderContactInfo.contactNumber) {
    return null
  }

  return phone
}

function getMeaningfulFacebook(contactInfo?: ContactInfoData | null) {
  return hasMeaningfulExternalUrl(contactInfo?.facebookPage) ? contactInfo?.facebookPage?.trim() : null
}

function getFullPageTitle(pageTitle: string, siteName: string, useAbsoluteTitle: boolean) {
  if (useAbsoluteTitle || pageTitle.includes(siteName)) {
    return pageTitle
  }

  return `${pageTitle} | ${siteName}`
}

export function resolveMetadataBase() {
  return sanitizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? new URL(fallbackSiteUrl)
}

export function getAbsoluteSiteUrl(path = '/') {
  return new URL(path, resolveMetadataBase()).toString()
}

type BuildPageMetadataArgs = {
  contactInfo?: ContactInfoData | null
  description?: string | null
  path: string
  siteSettings?: SiteSettingsData | null
  title?: string | null
  useAbsoluteTitle?: boolean
}

export function buildPageMetadata({
  contactInfo,
  description,
  path,
  siteSettings,
  title,
  useAbsoluteTitle = false,
}: BuildPageMetadataArgs): Metadata {
  const siteName = getBusinessName(contactInfo)
  const pageTitle = title?.trim() || siteSettings?.seoTitle || defaultSeoTitle
  const pageDescription = description?.trim() || siteSettings?.seoDescription || defaultSeoDescription
  const canonical = getAbsoluteSiteUrl(path)
  const socialImage = resolveSeoImage(siteSettings)
  const fullTitle = getFullPageTitle(pageTitle, siteName, useAbsoluteTitle)

  return {
    alternates: {
      canonical,
    },
    description: pageDescription,
    openGraph: {
      description: pageDescription,
      images: [
        {
          alt: socialImage.alt,
          url: socialImage.url,
        },
      ],
      siteName,
      title: fullTitle,
      type: 'website',
      url: canonical,
    },
    title: useAbsoluteTitle ? { absolute: fullTitle } : pageTitle,
    twitter: {
      card: 'summary_large_image',
      description: pageDescription,
      images: [socialImage.url],
      title: fullTitle,
    },
  }
}

export function buildBusinessStructuredData({
  contactInfo,
  siteSettings,
}: {
  contactInfo?: ContactInfoData | null
  siteSettings?: SiteSettingsData | null
}) {
  const siteName = getBusinessName(contactInfo)
  const logoUrl = toAbsoluteUrl(getMediaSrc(siteSettings?.logo, '/branding/sixram-logo.png'))
  const imageUrl = resolveSeoImage(siteSettings).url
  const description = siteSettings?.heroSubtitle || siteSettings?.seoDescription || defaultSeoDescription
  const telephone = getMeaningfulPhone(contactInfo)
  const address = getMeaningfulAddress(contactInfo)
  const facebookPage = getMeaningfulFacebook(contactInfo)

  return {
    '@context': 'https://schema.org',
    '@id': `${getAbsoluteSiteUrl('/')}#business`,
    '@type': 'LocalBusiness',
    description,
    image: imageUrl,
    logo: logoUrl,
    name: siteName,
    url: getAbsoluteSiteUrl('/'),
    ...(telephone
      ? {
          telephone,
        }
      : {}),
    ...(address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: address,
          },
        }
      : {}),
    ...(facebookPage
      ? {
          sameAs: [facebookPage],
        }
      : {}),
  }
}
