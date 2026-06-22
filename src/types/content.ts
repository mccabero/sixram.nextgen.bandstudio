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

export type GalleryProfileSession = {
  caption?: string | null
  id: number
  imageCount: number
  images: MediaAsset[]
  isFeatured: boolean
  sessionDate?: string | null
  title: string
}

export type GalleryProfileImage = {
  alt: string
  id: string
  sessionDate?: string | null
  sessionTitle: string
  src: string
}

export type GalleryProfileSummary = {
  coverImage?: MediaAsset | null
  featuredSessionTitle?: string | null
  imageCount: number
  isFeatured: boolean
  latestSessionDate?: string | null
  name: string
  sessionCount: number
  slug: string
  summary?: string | null
}

export type GalleryProfileData = GalleryProfileSummary & {
  carouselImages: GalleryProfileImage[]
  sessions: GalleryProfileSession[]
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

export type ScheduleDayStatus = 'open' | 'limited' | 'fully-booked' | 'closed'

export type ScheduleSlotStatus = 'available' | 'reserved' | 'blocked' | 'fully-booked'

export type ScheduleSlotItem = {
  endTime: string
  hasVisibleBandName: boolean
  id: string
  label: string
  startTime: string
  status: ScheduleSlotStatus
  timeLabel: string
}

export type TodayScheduleData = {
  dateKey: string
  dayStatus: ScheduleDayStatus
  dayStatusLabel: string
  displayDate: string
  publicNote?: string | null
  slots: ScheduleSlotItem[]
}

export type ScheduleDateOption = {
  dateKey: string
  dayStatus?: ScheduleDayStatus | null
  dayStatusLabel?: string | null
  displayDate: string
  hasSchedule: boolean
  isToday: boolean
  shortDateLabel: string
  weekdayLabel: string
}

export type ScheduleBrowseData = {
  activeDateKey: string
  activeDisplayDate: string
  nextDateKey: string
  previousDateKey: string
  schedule: TodayScheduleData | null
  visibleDates: ScheduleDateOption[]
}

export type ContactInfoData = {
  address: string
  bookingInstructions: string
  businessHours: string
  contactNumber?: string | null
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
