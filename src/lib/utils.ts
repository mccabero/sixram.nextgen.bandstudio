import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { MediaAsset } from '@/types/content'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    currency: 'PHP',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

export function formatDate(value?: string | null) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat('en-PH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatPromoWindow(startDate?: string | null, endDate?: string | null) {
  const start = formatDate(startDate)
  const end = formatDate(endDate)

  if (start && end) {
    return `${start} to ${end}`
  }

  if (end) {
    return `Valid until ${end}`
  }

  if (start) {
    return `Starts ${start}`
  }

  return 'Ongoing promo'
}

export function isExternalUrl(url?: string | null) {
  return Boolean(url && /^https?:\/\//i.test(url))
}

export function getPrimaryCtaHref(url?: string | null) {
  return url?.trim() || '/contact'
}

export function getPhoneHref(phone?: string | null) {
  if (!phone) {
    return null
  }

  const trimmed = phone.trim()
  const prefix = trimmed.startsWith('+') ? '+' : ''
  const digits = trimmed.replace(/\D/g, '')

  if (!digits) {
    return null
  }

  return `tel:${prefix}${digits}`
}

export function getMediaSrc(asset: MediaAsset | null | undefined, fallback: string) {
  return asset?.url || asset?.thumbnailUrl || fallback
}

function getYouTubeVideoId(url?: string | null) {
  if (!url) {
    return null
  }

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]

      return id || null
    }

    if (!host.endsWith('youtube.com')) {
      return null
    }

    if (parsed.pathname === '/watch') {
      const id = parsed.searchParams.get('v')

      return id || null
    }

    const [, firstSegment, secondSegment] = parsed.pathname.split('/')

    if (['embed', 'live', 'shorts'].includes(firstSegment) && secondSegment) {
      return secondSegment
    }
  } catch {
    return null
  }

  return null
}

export function getYouTubeEmbedUrl(url?: string | null) {
  const videoId = getYouTubeVideoId(url)

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

function getComparableTimestamp(value?: string | null) {
  if (!value) {
    return 0
  }

  const timestamp = new Date(value).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

function compareNewestFirst(
  leftCreatedAt?: string | null,
  rightCreatedAt?: string | null,
) {
  return getComparableTimestamp(rightCreatedAt) - getComparableTimestamp(leftCreatedAt)
}

export function sortByDisplayOrder<T extends { createdAt?: string | null; displayOrder?: number | null }>(
  items: T[],
) {
  return [...items].sort((left, right) => {
    const displayOrderDifference = (left.displayOrder ?? 100) - (right.displayOrder ?? 100)

    if (displayOrderDifference !== 0) {
      return displayOrderDifference
    }

    return compareNewestFirst(left.createdAt, right.createdAt)
  })
}

export function sortFeaturedFirst<
  T extends {
    createdAt?: string | null
    displayOrder?: number | null
    isFeatured?: boolean | null
  },
>(
  items: T[],
) {
  return [...items].sort((left, right) => {
    if (Boolean(left.isFeatured) !== Boolean(right.isFeatured)) {
      return left.isFeatured ? -1 : 1
    }

    const displayOrderDifference = (left.displayOrder ?? 100) - (right.displayOrder ?? 100)

    if (displayOrderDifference !== 0) {
      return displayOrderDifference
    }

    return compareNewestFirst(left.createdAt, right.createdAt)
  })
}

export function isPromoActive({
  endDate,
  isActive,
  startDate,
}: {
  endDate?: string | null
  isActive?: boolean | null
  startDate?: string | null
}) {
  if (!isActive) {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (startDate) {
    const starts = new Date(startDate)
    starts.setHours(0, 0, 0, 0)

    if (!Number.isNaN(starts.getTime()) && starts > today) {
      return false
    }
  }

  if (endDate) {
    const ends = new Date(endDate)
    ends.setHours(23, 59, 59, 999)

    if (!Number.isNaN(ends.getTime()) && ends < today) {
      return false
    }
  }

  return true
}
