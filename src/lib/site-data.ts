import type {
  ContactInfo as PayloadContactInfo,
  DailySchedule as PayloadDailySchedule,
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
  ScheduleBrowseData,
  ScheduleDateOption,
  TodayScheduleData,
  SiteSettingsData,
} from '@/types/content'
import { cache } from 'react'

import { getPayloadClient, hasCmsEnvironment } from '@/lib/payload'
import {
  placeholderContactInfo,
  placeholderFeaturedBands,
  placeholderGallery,
  placeholderPromos,
  placeholderRates,
  placeholderSiteSettings,
  getPlaceholderSchedule,
} from '@/lib/placeholders'
import {
  formatStudioDateShortLabel,
  formatScheduleRange,
  formatStudioDateLabel,
  formatStudioWeekdayLabel,
  getDateKeysAround,
  getCurrentStudioDateKey,
  getScheduleDayStatusLabel,
  getScheduleSlotStatusLabel,
  hasMeaningfulExternalUrl,
  getTimeValueInMinutes,
  isPromoActive,
  shiftDateKey,
  sortByDisplayOrder,
  sortFeaturedFirst,
} from '@/lib/utils'

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

function optionalDisplayPhone(value: string | null | undefined) {
  const normalized = optionalText(value)

  if (!normalized || normalized === placeholderContactInfo.contactNumber) {
    return null
  }

  return normalized
}

function optionalPublicUrl(value: string | null | undefined) {
  const normalized = optionalText(value)

  return hasMeaningfulExternalUrl(normalized) ? normalized : null
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
    facebookLink: optionalPublicUrl(band.facebookLink),
    genre: requiredText(band.genre, 'Band'),
    id: band.id,
    instagramLink: optionalPublicUrl(band.instagramLink),
    isFeatured: Boolean(band.isFeatured),
    tiktokLink: optionalPublicUrl(band.tiktokLink),
    youtubeVideoUrl: optionalPublicUrl(band.youtubeVideoUrl),
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

function mapTodaySchedule(schedule: PayloadDailySchedule): TodayScheduleData {
  const dateKey = requiredText(
    schedule.scheduleDateKey,
    getCurrentStudioDateKey(),
  )
  const rawSlots = Array.isArray(schedule.timeSlots) ? schedule.timeSlots : []

  const slots = [...rawSlots]
    .sort((left, right) => {
      const leftMinutes = getTimeValueInMinutes(left.startTime) ?? Number.MAX_SAFE_INTEGER
      const rightMinutes = getTimeValueInMinutes(right.startTime) ?? Number.MAX_SAFE_INTEGER

      return leftMinutes - rightMinutes
    })
    .map((slot, index) => {
      const publicDisplayName =
        slot.status === 'reserved'
          ? optionalText(slot.publicDisplayName)
          : null

      return {
        endTime: requiredText(slot.endTime, '00:00'),
        hasVisibleBandName: Boolean(publicDisplayName),
        id: String(slot.id ?? `${dateKey}-${index}`),
        label:
          publicDisplayName ||
          getScheduleSlotStatusLabel(
            (slot.status as TodayScheduleData['slots'][number]['status']) || 'reserved',
          ),
        startTime: requiredText(slot.startTime, '00:00'),
        status: (slot.status as TodayScheduleData['slots'][number]['status']) || 'reserved',
        timeLabel:
          formatScheduleRange(slot.startTime, slot.endTime) ||
          `${requiredText(slot.startTime, '00:00')} - ${requiredText(slot.endTime, '00:00')}`,
      }
    })

  return {
    dateKey,
    dayStatus: schedule.dayStatus,
    dayStatusLabel: getScheduleDayStatusLabel(schedule.dayStatus),
    displayDate: formatStudioDateLabel(dateKey) || 'Today',
    publicNote: optionalText(schedule.publicNote),
    slots,
  }
}

function createScheduleDateOption({
  dateKey,
  todayKey,
  schedule,
}: {
  dateKey: string
  schedule?: PayloadDailySchedule
  todayKey: string
}): ScheduleDateOption {
  return {
    dateKey,
    dayStatus: schedule?.dayStatus ?? null,
    dayStatusLabel: schedule ? getScheduleDayStatusLabel(schedule.dayStatus) : null,
    displayDate: formatStudioDateLabel(dateKey) || dateKey,
    hasSchedule: Boolean(schedule),
    isToday: dateKey === todayKey,
    shortDateLabel: formatStudioDateShortLabel(dateKey) || dateKey,
    weekdayLabel: formatStudioWeekdayLabel(dateKey) || '',
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
    contactNumber: optionalDisplayPhone(contactInfo.contactNumber),
    facebookPage: optionalPublicUrl(contactInfo.facebookPage),
    googleMapsLink: optionalPublicUrl(contactInfo.googleMapsLink),
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

export const getRatesData = cache(async () => {
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
})

export const getGalleryData = cache(async () => {
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
})

export const getFeaturedBandsData = cache(async () => {
  return withCmsFallback(placeholderFeaturedBands, async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'featured-bands',
      depth: 1,
      limit: 100,
    })

    return sortFeaturedFirst(result.docs as PayloadFeaturedBand[]).map(mapFeaturedBand)
  })
})

export const getPromosData = cache(async () => {
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
})

export const getScheduleBrowseData = cache(async (selectedDateKey?: string | null) => {
  const todayKey = getCurrentStudioDateKey()
  const activeDateKey = selectedDateKey || todayKey
  const visibleDateKeys = getDateKeysAround(activeDateKey, 3, 3)
  const placeholderSchedule = getPlaceholderSchedule(activeDateKey)
  const fallback: ScheduleBrowseData = {
    activeDateKey,
    activeDisplayDate: formatStudioDateLabel(activeDateKey) || 'Selected Day',
    nextDateKey: shiftDateKey(activeDateKey, 1),
    previousDateKey: shiftDateKey(activeDateKey, -1),
    schedule: placeholderSchedule,
    visibleDates: visibleDateKeys.map((dateKey) =>
      createScheduleDateOption({
        dateKey,
        schedule: dateKey === activeDateKey ? ({ dayStatus: placeholderSchedule.dayStatus } as PayloadDailySchedule) : undefined,
        todayKey,
      }),
    ),
  }

  return withCmsFallback<ScheduleBrowseData>(fallback, async () => {
    const payload = await getPayloadClient()
    const [selectedResult, visibleResult] = await Promise.all([
      payload.find({
        collection: 'daily-schedules',
        depth: 0,
        limit: 1,
        where: {
          and: [
            {
              isPublished: {
                equals: true,
              },
            },
            {
              scheduleDateKey: {
                equals: activeDateKey,
              },
            },
          ],
        },
      }),
      payload.find({
        collection: 'daily-schedules',
        depth: 0,
        limit: visibleDateKeys.length,
        sort: 'scheduleDateKey',
        where: {
          and: [
            {
              isPublished: {
                equals: true,
              },
            },
            {
              scheduleDateKey: {
                greater_than_equal: visibleDateKeys[0],
              },
            },
            {
              scheduleDateKey: {
                less_than_equal: visibleDateKeys[visibleDateKeys.length - 1],
              },
            },
          ],
        },
      }),
    ])

    const schedule = selectedResult.docs[0] as PayloadDailySchedule | undefined
    const visibleSchedules = visibleResult.docs as PayloadDailySchedule[]
    const visibleScheduleMap = new Map(
      visibleSchedules
        .map((entry) => [optionalText(entry.scheduleDateKey), entry] as const)
        .filter((entry): entry is [string, PayloadDailySchedule] => Boolean(entry[0])),
    )

    return {
      activeDateKey,
      activeDisplayDate: formatStudioDateLabel(activeDateKey) || 'Selected Day',
      nextDateKey: shiftDateKey(activeDateKey, 1),
      previousDateKey: shiftDateKey(activeDateKey, -1),
      schedule: schedule ? mapTodaySchedule(schedule) : null,
      visibleDates: visibleDateKeys.map((dateKey) =>
        createScheduleDateOption({
          dateKey,
          schedule: visibleScheduleMap.get(dateKey),
          todayKey,
        }),
      ),
    }
  })
})

export const getContactInfoData = cache(async () => {
  return withCmsFallback(placeholderContactInfo, async () => {
    const payload = await getPayloadClient()
    const result = (await payload.findGlobal({
      depth: 1,
      slug: 'contact-info',
    })) as PayloadContactInfo

    return mapContactInfo(result)
  })
})

export const getSiteSettingsData = cache(async () => {
  return withCmsFallback(placeholderSiteSettings, async () => {
    const payload = await getPayloadClient()
    const result = (await payload.findGlobal({
      depth: 1,
      slug: 'site-settings',
    })) as PayloadSiteSetting

    return mapSiteSettings(result)
  })
})
