import type {
  ContactInfoData,
  FeaturedBandItem,
  GalleryItem,
  NavLink,
  PromoItem,
  RateItem,
  SiteSettingsData,
} from '@/types/content'

export const siteNavigation: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/rates', label: 'Rates' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/featured-bands', label: 'Featured Bands' },
  { href: '/promos', label: 'Promos' },
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
    'Dark, loud, and production-ready rehearsal space for bands that want to practice tight and leave with something worth replaying.',
  heroTitle: 'Rehearse hard. Capture the moment. Sound ready for the next set.',
  logo: {
    alt: 'Sixram Band Studio official logo',
    url: '/branding/sixram-logo.png',
  },
  mainCtaLink: '/contact#booking',
  mainCtaText: 'Book Now',
  seoDescription:
    'Sixram Band Studio is a modern rehearsal space with optional multitrack live recording, active promos, and reservation-based booking.',
  seoTitle: 'Sixram Band Studio | Rehearsal Room and Live Recording Promos',
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
    originalPrice: 900,
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
