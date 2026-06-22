import type {
  ContactInfoData,
  FeaturedBandItem,
  GalleryItem,
  NavLink,
  PromoItem,
  RateItem,
  TodayScheduleData,
  SiteSettingsData,
} from '@/types/content'
import {
  formatScheduleRange,
  formatStudioDateLabel,
  getCurrentStudioDateKey,
} from '@/lib/utils'

export const siteNavigation: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/rates', label: 'Rates' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export const footerNavigation: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/featured-bands', label: 'Featured Bands' },
  { href: '/promos', label: 'Promos' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/contact', label: 'Contact' },
]

export const studioInclusions = [
  'Fender Champion 100W and Laney LV300 120W guitar amplification',
  'Hartke HD500 bass support with full-band monitoring',
  'Pearl Roadshow drums, Alto active speakers, and quality microphones',
  'Optional multitrack live recording for selected sessions',
  'Reservation-first workflow with guided booking support',
]

export const bookingNotes = [
  'By reservation only.',
  'No walk-ins.',
  'Schedule is always subject to availability.',
]

export const placeholderSiteSettings: SiteSettingsData = {
  heroImage: {
    alt: 'Sixram Band Studio rehearsal room illustration',
    url: '/placeholders/studio-hero.svg',
  },
  heroSubtitle:
    'Band rehearsal studio with quality gear, live session energy, and optional multitrack recording.',
  heroTitle: 'Sixram Band Studio',
  logo: {
    alt: 'Sixram Band Studio official logo',
    url: '/branding/sixram-logo.png',
  },
  mainCtaLink: '/contact',
  mainCtaText: 'Book Your Session',
  seoDescription:
    'Book band rehearsals at Sixram Band Studio with quality amps, drums, microphones, speakers, and optional multitrack live recording. By reservation only.',
  seoTitle: 'Sixram Band Studio | Rehearsal & Live Recording Studio',
}

export const placeholderContactInfo: ContactInfoData = {
  address: 'Update your exact studio address in Payload CMS before launch.',
  bookingInstructions:
    'Send your preferred date, time, and package through Facebook or your contact number. We will confirm the slot once availability is checked.',
  businessHours: 'Monday to Sunday | 1:00 PM to 11:00 PM',
  contactNumber: '0917 000 0000',
  facebookPage: 'https://www.facebook.com/',
  googleMapsLink: 'https://maps.google.com/',
  studioName: 'Sixram Band Studio',
}

export const placeholderRates: RateItem[] = [
  {
    description: 'A focused rehearsal session for bands that want a reliable room, ready backline, and a clean setup for productive practice.',
    displayOrder: 1,
    duration: '1 hour',
    id: 1,
    inclusions: ['Fender Champion 100W and Laney LV300 120W', 'Pearl Roadshow drums', 'PA system and quality microphones'],
    isActive: true,
    isFeatured: true,
    packageName: 'Rehearsal Only',
    price: 200,
  },
  {
    description: 'A rehearsal block designed for bands who want a stronger session and a take-home multitrack capture of the room.',
    displayOrder: 2,
    duration: '2 hours',
    id: 2,
    inclusions: ['Multitrack live recording', 'Hartke HD500 and Alto active speakers', 'Session-ready microphones and monitoring'],
    isActive: true,
    isFeatured: true,
    packageName: '2 Hours + Free Multitrack Live Recording',
    price: 699,
  },
]

export const placeholderPromos: PromoItem[] = [
  {
    description:
      'Lock in a focused rehearsal block and take home a clean multitrack capture of your live session at a promo-friendly price.',
    displayOrder: 1,
    endDate: '2027-12-31T23:59:59.000Z',
    id: 1,
    isActive: true,
    originalPrice: 899,
    promoImage: {
      alt: 'Promo recording session placeholder',
      url: '/placeholders/promo-recording.svg',
    },
    promoPrice: 699,
    promoTitle: '2 Hours + Free Multitrack Live Recording',
    startDate: '2026-01-01T00:00:00.000Z',
  },
]

export const placeholderFeaturedBands: FeaturedBandItem[] = [
  {
    bandName: 'Crimson Static',
    bandPhoto: {
      alt: 'Featured band placeholder',
      url: '/placeholders/featured-band.svg',
    },
    description:
      'An alt-rock sample feature used to demonstrate how band profiles, descriptions, and social links can look on the public website.',
    displayOrder: 1,
    facebookLink: 'https://www.facebook.com/',
    genre: 'Alternative Rock',
    id: 1,
    instagramLink: 'https://www.instagram.com/',
    isFeatured: true,
    tiktokLink: 'https://www.tiktok.com/',
    youtubeVideoUrl: null,
  },
]

export const placeholderGallery: GalleryItem[] = [
  {
    approvedForPosting: true,
    bandOrClientName: 'Session Placeholder',
    caption: 'Starter gallery content for the Phase 1 build while real studio and client photos are still being prepared.',
    displayOrder: 1,
    id: 1,
    images: [
      {
        alt: 'Gallery placeholder for a live recording session',
        url: '/placeholders/gallery-session.svg',
      },
    ],
    isFeatured: true,
    sessionDate: '2026-06-01T00:00:00.000Z',
    title: 'Live Recording Session Placeholder',
  },
]

export function getPlaceholderSchedule(dateKey = getCurrentStudioDateKey()): TodayScheduleData {

  return {
    dateKey,
    dayStatus: 'limited',
    dayStatusLabel: 'Limited Availability',
    displayDate: formatStudioDateLabel(dateKey) || 'Today',
    publicNote: bookingNotes.join(' '),
    slots: [
      {
        endTime: '15:00',
        hasVisibleBandName: false,
        id: 'slot-1',
        label: 'Available',
        startTime: '13:00',
        status: 'available',
        timeLabel: formatScheduleRange('13:00', '15:00') || '1:00 PM - 3:00 PM',
      },
      {
        endTime: '17:00',
        hasVisibleBandName: false,
        id: 'slot-2',
        label: 'Reserved',
        startTime: '15:00',
        status: 'reserved',
        timeLabel: formatScheduleRange('15:00', '17:00') || '3:00 PM - 5:00 PM',
      },
      {
        endTime: '18:00',
        hasVisibleBandName: false,
        id: 'slot-3',
        label: 'Blocked',
        startTime: '17:00',
        status: 'blocked',
        timeLabel: formatScheduleRange('17:00', '18:00') || '5:00 PM - 6:00 PM',
      },
      {
        endTime: '20:00',
        hasVisibleBandName: true,
        id: 'slot-4',
        label: 'Midnight Echoes',
        startTime: '18:00',
        status: 'reserved',
        timeLabel: formatScheduleRange('18:00', '20:00') || '6:00 PM - 8:00 PM',
      },
      {
        endTime: '22:00',
        hasVisibleBandName: false,
        id: 'slot-5',
        label: 'Fully Booked',
        startTime: '20:00',
        status: 'fully-booked',
        timeLabel: formatScheduleRange('20:00', '22:00') || '8:00 PM - 10:00 PM',
      },
    ],
  }
}
