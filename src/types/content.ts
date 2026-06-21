export type NavLink = {
  href: string
  label: string
}

export type MediaAsset = {
  alt: string
  thumbnailUrl?: string | null
  url?: string | null
}

export type RateItem = {
  description: string
  displayOrder: number
  duration: string
  id: number
  inclusions: string[]
  isActive: boolean
  isFeatured: boolean
  packageName: string
  price: number
}

export type GalleryItem = {
  approvedForPosting: boolean
  bandOrClientName?: string | null
  caption?: string | null
  displayOrder: number
  id: number
  images: MediaAsset[]
  isFeatured: boolean
  sessionDate?: string | null
  title: string
}

export type FeaturedBandItem = {
  bandName: string
  bandPhoto?: MediaAsset | null
  description: string
  displayOrder: number
  facebookLink?: string | null
  genre: string
  id: number
  instagramLink?: string | null
  isFeatured: boolean
  tiktokLink?: string | null
  youtubeVideoUrl?: string | null
}

export type PromoItem = {
  description: string
  displayOrder: number
  endDate?: string | null
  id: number
  isActive: boolean
  originalPrice?: number | null
  promoImage?: MediaAsset | null
  promoPrice: number
  promoTitle: string
  startDate?: string | null
}

export type ContactInfoData = {
  address: string
  bookingInstructions: string
  businessHours: string
  contactNumber: string
  facebookPage?: string | null
  googleMapsLink?: string | null
  studioName: string
}

export type SiteSettingsData = {
  heroImage?: MediaAsset | null
  heroSubtitle: string
  heroTitle: string
  logo?: MediaAsset | null
  mainCtaLink?: string | null
  mainCtaText: string
  seoDescription: string
  seoTitle: string
}
