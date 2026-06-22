import 'dotenv/config'

import path from 'node:path'

import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

import {
  getPlaceholderSchedule,
  placeholderContactInfo,
  placeholderFeaturedBands,
  placeholderGallery,
  placeholderPromos,
  placeholderRates,
  placeholderSiteSettings,
} from '@/lib/placeholders'

type CollectionSlug = 'daily-schedules' | 'featured-bands' | 'gallery' | 'promos' | 'rates'
type RelationId = number

const placeholderMediaFiles = {
  bandPhoto: {
    alt: 'Featured band placeholder',
    caption: 'Sample featured band image placeholder for Phase 1.',
    filePath: path.resolve(process.cwd(), 'public/placeholders/featured-band.svg'),
  },
  galleryImage: {
    alt: 'Gallery placeholder for a live recording session',
    caption: 'Starter gallery placeholder image for live recording sessions.',
    filePath: path.resolve(process.cwd(), 'public/placeholders/gallery-session.svg'),
  },
  heroImage: {
    alt: 'Sixram Band Studio rehearsal room illustration',
    caption: 'Starter hero illustration for Sixram Band Studio.',
    filePath: path.resolve(process.cwd(), 'public/placeholders/studio-hero.svg'),
  },
  logo: {
    alt: 'Sixram Band Studio official logo',
    caption: 'Official Sixram Band Studio logo for the public site and admin branding.',
    filePath: path.resolve(process.cwd(), 'public/branding/sixram-logo.png'),
  },
  promoImage: {
    alt: 'Promo recording session placeholder',
    caption: 'Starter promo artwork for multitrack recording bundles.',
    filePath: path.resolve(process.cwd(), 'public/placeholders/promo-recording.svg'),
  },
} as const

type SeededMediaIds = {
  bandPhoto: RelationId
  galleryImage: RelationId
  heroImage: RelationId
  logo: RelationId
  promoImage: RelationId
}

async function upsertCollectionItem({
  collection,
  data,
  field,
  payload,
  value,
}: {
  collection: CollectionSlug
  data: Record<string, unknown>
  field: string
  payload: Payload
  value: string
}) {
  const existing = await payload.find({
    collection,
    limit: 1,
    where: {
      [field]: {
        equals: value,
      },
    } as never,
  })

  if (existing.docs.length) {
    return payload.update({
      collection,
      data,
      id: existing.docs[0].id,
    })
  }

  return payload.create({
    collection,
    data,
  } as never)
}

async function ensureMediaAsset(
  payload: Payload,
  {
    alt,
    caption,
    filePath,
  }: {
    alt: string
    caption: string
    filePath: string
  },
) {
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: {
      alt: {
        equals: alt,
      },
    },
  })

  if (existing.docs.length) {
    await payload.update({
      collection: 'media',
      data: {
        alt,
        caption,
      },
      id: existing.docs[0].id,
    })

    return Number(existing.docs[0].id)
  }

  const media = await payload.create({
    collection: 'media',
    data: {
      alt,
      caption,
    },
    filePath,
  })

  return Number(media.id)
}

async function seedMedia(payload: Payload): Promise<SeededMediaIds> {
  return {
    bandPhoto: await ensureMediaAsset(payload, placeholderMediaFiles.bandPhoto),
    galleryImage: await ensureMediaAsset(payload, placeholderMediaFiles.galleryImage),
    heroImage: await ensureMediaAsset(payload, placeholderMediaFiles.heroImage),
    logo: await ensureMediaAsset(payload, placeholderMediaFiles.logo),
    promoImage: await ensureMediaAsset(payload, placeholderMediaFiles.promoImage),
  }
}

async function seedRates(payload: Payload) {
  for (const rate of placeholderRates) {
    await upsertCollectionItem({
      collection: 'rates',
      data: {
        description: rate.description,
        displayOrder: rate.displayOrder,
        duration: rate.duration,
        inclusions: rate.inclusions.map((item) => ({ item })),
        isActive: rate.isActive,
        isFeatured: rate.isFeatured,
        packageName: rate.packageName,
        price: rate.price,
      },
      field: 'packageName',
      payload,
      value: rate.packageName,
    })
  }
}

async function seedPromos(payload: Payload, mediaIds: SeededMediaIds) {
  for (const promo of placeholderPromos) {
    await upsertCollectionItem({
      collection: 'promos',
      data: {
        description: promo.description,
        displayOrder: promo.displayOrder,
        endDate: promo.endDate,
        isActive: promo.isActive,
        originalPrice: promo.originalPrice,
        promoImage: mediaIds.promoImage,
        promoPrice: promo.promoPrice,
        promoTitle: promo.promoTitle,
        startDate: promo.startDate,
      },
      field: 'promoTitle',
      payload,
      value: promo.promoTitle,
    })
  }
}

async function seedFeaturedBands(payload: Payload, mediaIds: SeededMediaIds) {
  for (const band of placeholderFeaturedBands) {
    await upsertCollectionItem({
      collection: 'featured-bands',
      data: {
        bandName: band.bandName,
        bandPhoto: mediaIds.bandPhoto,
        description: band.description,
        displayOrder: band.displayOrder,
        facebookLink: band.facebookLink,
        genre: band.genre,
        instagramLink: band.instagramLink,
        isFeatured: band.isFeatured,
        tiktokLink: band.tiktokLink,
        youtubeVideoUrl: band.youtubeVideoUrl,
      },
      field: 'bandName',
      payload,
      value: band.bandName,
    })
  }
}

async function seedGallery(payload: Payload, mediaIds: SeededMediaIds) {
  for (const item of placeholderGallery) {
    await upsertCollectionItem({
      collection: 'gallery',
      data: {
        approvedForPosting: item.approvedForPosting,
        bandOrClientName: item.bandOrClientName,
        caption: item.caption,
        displayOrder: item.displayOrder,
        images: [mediaIds.galleryImage],
        isFeatured: item.isFeatured,
        sessionDate: item.sessionDate,
        title: item.title,
      },
      field: 'title',
      payload,
      value: item.title,
    })
  }
}

async function seedDailySchedules(payload: Payload) {
  const placeholderTodaySchedule = getPlaceholderSchedule()

  await upsertCollectionItem({
    collection: 'daily-schedules',
    data: {
      dayStatus: placeholderTodaySchedule.dayStatus,
      isPublished: true,
      publicNote: placeholderTodaySchedule.publicNote,
      scheduleDate: `${placeholderTodaySchedule.dateKey}T00:00:00.000Z`,
      scheduleDateKey: placeholderTodaySchedule.dateKey,
      timeSlots: placeholderTodaySchedule.slots.map((slot) => ({
        endTime: slot.endTime,
        internalClientName: slot.hasVisibleBandName ? slot.label : '',
        publicDisplayName: slot.hasVisibleBandName ? slot.label : '',
        showPublicName: slot.hasVisibleBandName,
        startTime: slot.startTime,
        status: slot.status,
      })),
    },
    field: 'scheduleDateKey',
    payload,
    value: placeholderTodaySchedule.dateKey,
  })
}

async function seedGlobals(payload: Payload, mediaIds: SeededMediaIds) {
  await payload.updateGlobal({
    data: {
      address: placeholderContactInfo.address,
      bookingInstructions: placeholderContactInfo.bookingInstructions,
      businessHours: placeholderContactInfo.businessHours,
      contactNumber: placeholderContactInfo.contactNumber,
      facebookPage: placeholderContactInfo.facebookPage,
      googleMapsLink: placeholderContactInfo.googleMapsLink,
      studioName: placeholderContactInfo.studioName,
    },
    slug: 'contact-info',
  })

  await payload.updateGlobal({
    data: {
      heroImage: mediaIds.heroImage,
      heroSubtitle: placeholderSiteSettings.heroSubtitle,
      heroTitle: placeholderSiteSettings.heroTitle,
      logo: mediaIds.logo,
      mainCtaLink: placeholderSiteSettings.mainCtaLink,
      mainCtaText: placeholderSiteSettings.mainCtaText,
      seoDescription: placeholderSiteSettings.seoDescription,
      seoTitle: placeholderSiteSettings.seoTitle,
    },
    slug: 'site-settings',
  })
}

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required before running the seed script.')
  }

  const payload = await getPayload({
    config: configPromise,
  })

  const mediaIds = await seedMedia(payload)

  await seedRates(payload)
  await seedPromos(payload, mediaIds)
  await seedFeaturedBands(payload, mediaIds)
  await seedGallery(payload, mediaIds)
  await seedDailySchedules(payload)
  await seedGlobals(payload, mediaIds)

  console.log('Phase 3 starter content has been seeded.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
