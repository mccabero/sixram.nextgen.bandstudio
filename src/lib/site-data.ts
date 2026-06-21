import type {
  ContactInfo as PayloadContactInfo,
  FeaturedBand as PayloadFeaturedBand,
  Gallery as PayloadGallery,
  Media,
  Promo as PayloadPromo,
  Rate as PayloadRate,
  SiteSetting as PayloadSiteSetting,
} from '@/payload-types'
import type {
  ContactInfoData,
  FeaturedBandItem,
  GalleryItem,
  MediaAsset,
  PromoItem,
  RateItem,
  SiteSettingsData,
} from '@/types/content'

import { getPayloadClient, hasCmsEnvironment } from '@/lib/payload'
import {
  placeholderContactInfo,
  placeholderFeaturedBands,
  placeholderGallery,
  placeholderPromos,
  placeholderRates,
  placeholderSiteSettings,
} from '@/lib/placeholders'
import { isPromoActive, sortByDisplayOrder, sortFeaturedFirst } from '@/lib/utils'

function optionalText(value: string | null | undefined) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : null
}

function requiredText(value: string | null | undefined, fallback: string) {
  return optionalText(value) ?? fallback
}

function mediaToAsset(media?: Media | number | null): MediaAsset | null {
  if (!media || typeof media === 'number') {
    return null
  }

  return {
    alt: requiredText(media.alt, 'Sixram Band Studio media item'),
    thumbnailUrl: media.thumbnailURL,
    url: media.url,
  }
}

function mapRate(rate: PayloadRate): RateItem {
  return {
    description: requiredText(rate.description, 'Rate details will be added soon.'),
    displayOrder: rate.displayOrder ?? 100,
    duration: rate.duration,
    id: rate.id,
    inclusions: rate.inclusions?.map((entry) => entry.item) ?? [],
    isActive: Boolean(rate.isActive),
    isFeatured: Boolean(rate.isFeatured),
    packageName: rate.packageName,
    price: rate.price,
  }
}

function mapGalleryItem(item: PayloadGallery): GalleryItem {
  return {
    approvedForPosting: Boolean(item.approvedForPosting),
    bandOrClientName: optionalText(item.bandOrClientName),
    caption: optionalText(item.caption),
    displayOrder: item.displayOrder ?? 100,
    id: item.id,
    images: (item.images ?? []).map((image) => mediaToAsset(image)).filter(Boolean) as MediaAsset[],
    isFeatured: Boolean(item.isFeatured),
    sessionDate: item.sessionDate,
    title: requiredText(item.title, 'Gallery Item'),
  }
}

function mapFeaturedBand(band: PayloadFeaturedBand): FeaturedBandItem {
  return {
    bandName: requiredText(band.bandName, 'Featured Band'),
    bandPhoto: mediaToAsset(band.bandPhoto),
    description: requiredText(
      band.description,
      'Band profile details will appear here once they are added in Payload CMS.',
    ),
    displayOrder: band.displayOrder ?? 100,
    facebookLink: optionalText(band.facebookLink),
    genre: requiredText(band.genre, 'Band'),
    id: band.id,
    instagramLink: optionalText(band.instagramLink),
    isFeatured: Boolean(band.isFeatured),
    tiktokLink: optionalText(band.tiktokLink),
    youtubeVideoUrl: optionalText(band.youtubeVideoUrl),
  }
}

function mapPromo(promo: PayloadPromo): PromoItem {
  return {
    description: requiredText(promo.description, 'Promo details will be added soon.'),
    displayOrder: promo.displayOrder ?? 100,
    endDate: promo.endDate,
    id: promo.id,
    isActive: Boolean(promo.isActive),
    originalPrice: promo.originalPrice,
    promoImage: mediaToAsset(promo.promoImage),
    promoPrice: promo.promoPrice,
    promoTitle: requiredText(promo.promoTitle, 'Studio Promo'),
    startDate: promo.startDate,
  }
}

function mapContactInfo(contactInfo: PayloadContactInfo): ContactInfoData {
  return {
    address: requiredText(contactInfo.address, placeholderContactInfo.address),
    bookingInstructions: requiredText(
      contactInfo.bookingInstructions,
      placeholderContactInfo.bookingInstructions,
    ),
    businessHours: requiredText(contactInfo.businessHours, placeholderContactInfo.businessHours),
    contactNumber: optionalText(contactInfo.contactNumber),
    facebookPage: optionalText(contactInfo.facebookPage),
    googleMapsLink: optionalText(contactInfo.googleMapsLink),
    studioName: requiredText(contactInfo.studioName, placeholderContactInfo.studioName),
  }
}

function mapSiteSettings(settings: PayloadSiteSetting): SiteSettingsData {
  return {
    heroImage: mediaToAsset(settings.heroImage),
    heroSubtitle: requiredText(settings.heroSubtitle, placeholderSiteSettings.heroSubtitle),
    heroTitle: requiredText(settings.heroTitle, placeholderSiteSettings.heroTitle),
    logo: mediaToAsset(settings.logo),
    mainCtaLink: optionalText(settings.mainCtaLink),
    mainCtaText: requiredText(settings.mainCtaText, placeholderSiteSettings.mainCtaText),
    seoDescription: requiredText(settings.seoDescription, placeholderSiteSettings.seoDescription),
    seoTitle: requiredText(settings.seoTitle, placeholderSiteSettings.seoTitle),
  }
}

async function withCmsFallback<T>(fallback: T, loader: () => Promise<T>) {
  if (!hasCmsEnvironment()) {
    return fallback
  }

  try {
    return await loader()
  } catch (error) {
    console.warn('[cms] Falling back to starter content:', error)
    return fallback
  }
}

export async function getRatesData() {
  return withCmsFallback(placeholderRates, async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'rates',
      depth: 1,
      limit: 100,
    })

    return sortByDisplayOrder((result.docs as PayloadRate[]).filter((item) => Boolean(item.isActive))).map(
      mapRate,
    )
  })
}

export async function getGalleryData() {
  return withCmsFallback(placeholderGallery, async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'gallery',
      depth: 1,
      limit: 100,
    })

    return sortFeaturedFirst(
      (result.docs as PayloadGallery[]).filter((item) => Boolean(item.approvedForPosting)),
    ).map(mapGalleryItem)
  })
}

export async function getFeaturedBandsData() {
  return withCmsFallback(placeholderFeaturedBands, async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'featured-bands',
      depth: 1,
      limit: 100,
    })

    return sortFeaturedFirst(result.docs as PayloadFeaturedBand[]).map(mapFeaturedBand)
  })
}

export async function getPromosData() {
  return withCmsFallback(placeholderPromos, async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'promos',
      depth: 1,
      limit: 100,
    })

    return sortByDisplayOrder(
      (result.docs as PayloadPromo[]).filter((promo) =>
        isPromoActive({
          endDate: promo.endDate,
          isActive: promo.isActive,
          startDate: promo.startDate,
        }),
      ),
    ).map(mapPromo)
  })
}

export async function getContactInfoData() {
  return withCmsFallback(placeholderContactInfo, async () => {
    const payload = await getPayloadClient()
    const result = (await payload.findGlobal({
      depth: 1,
      slug: 'contact-info',
    })) as PayloadContactInfo

    return mapContactInfo(result)
  })
}

export async function getSiteSettingsData() {
  return withCmsFallback(placeholderSiteSettings, async () => {
    const payload = await getPayloadClient()
    const result = (await payload.findGlobal({
      depth: 1,
      slug: 'site-settings',
    })) as PayloadSiteSetting

    return mapSiteSettings(result)
  })
}
