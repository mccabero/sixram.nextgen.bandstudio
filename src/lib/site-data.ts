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

function mediaToAsset(media?: Media | number | null): MediaAsset | null {
  if (!media || typeof media === 'number') {
    return null
  }

  return {
    alt: media.alt,
    thumbnailUrl: media.thumbnailURL,
    url: media.url,
  }
}

function mapRate(rate: PayloadRate): RateItem {
  return {
    description: rate.description,
    displayOrder: rate.displayOrder ?? 0,
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
    bandOrClientName: item.bandOrClientName,
    caption: item.caption,
    displayOrder: item.displayOrder ?? 0,
    id: item.id,
    images: (item.images ?? []).map((image) => mediaToAsset(image)).filter(Boolean) as MediaAsset[],
    isFeatured: Boolean(item.isFeatured),
    sessionDate: item.sessionDate,
    title: item.title,
  }
}

function mapFeaturedBand(band: PayloadFeaturedBand): FeaturedBandItem {
  return {
    bandName: band.bandName,
    bandPhoto: mediaToAsset(band.bandPhoto),
    description: band.description,
    displayOrder: band.displayOrder ?? 0,
    facebookLink: band.facebookLink,
    genre: band.genre,
    id: band.id,
    instagramLink: band.instagramLink,
    isFeatured: Boolean(band.isFeatured),
    tiktokLink: band.tiktokLink,
    youtubeVideoUrl: band.youtubeVideoUrl,
  }
}

function mapPromo(promo: PayloadPromo): PromoItem {
  return {
    description: promo.description,
    displayOrder: promo.displayOrder ?? 0,
    endDate: promo.endDate,
    id: promo.id,
    isActive: Boolean(promo.isActive),
    originalPrice: promo.originalPrice,
    promoImage: mediaToAsset(promo.promoImage),
    promoPrice: promo.promoPrice,
    promoTitle: promo.promoTitle,
    startDate: promo.startDate,
  }
}

function mapContactInfo(contactInfo: PayloadContactInfo): ContactInfoData {
  return {
    address: contactInfo.address,
    bookingInstructions: contactInfo.bookingInstructions,
    businessHours: contactInfo.businessHours,
    contactNumber: contactInfo.contactNumber,
    facebookPage: contactInfo.facebookPage,
    googleMapsLink: contactInfo.googleMapsLink,
    studioName: contactInfo.studioName,
  }
}

function mapSiteSettings(settings: PayloadSiteSetting): SiteSettingsData {
  return {
    heroImage: mediaToAsset(settings.heroImage),
    heroSubtitle: settings.heroSubtitle,
    heroTitle: settings.heroTitle,
    logo: mediaToAsset(settings.logo),
    mainCtaLink: settings.mainCtaLink,
    mainCtaText: settings.mainCtaText,
    seoDescription: settings.seoDescription,
    seoTitle: settings.seoTitle,
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

    return sortByDisplayOrder((result.docs as PayloadRate[]).map(mapRate).filter((item) => item.isActive))
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
      (result.docs as PayloadGallery[])
        .map(mapGalleryItem)
        .filter((item) => item.approvedForPosting),
    )
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

    return sortFeaturedFirst((result.docs as PayloadFeaturedBand[]).map(mapFeaturedBand))
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
      (result.docs as PayloadPromo[])
        .map(mapPromo)
        .filter((promo) =>
          isPromoActive({
            endDate: promo.endDate,
            isActive: promo.isActive,
            startDate: promo.startDate,
          }),
        ),
    )
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
