import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type {
  MediaAsset,
  ScheduleDayStatus,
  ScheduleSlotStatus,
} from '@/types/content'

export const STUDIO_TIME_ZONE = 'Asia/Manila'

const scheduleDayStatusLabels: Record<ScheduleDayStatus, string> = {
  open: 'Open Today',
  limited: 'Limited Availability',
  'fully-booked': 'Fully Booked',
  closed: 'Closed Today',
}

const scheduleSlotStatusLabels: Record<ScheduleSlotStatus, string> = {
  available: 'Available',
  reserved: 'Reserved',
  blocked: 'Blocked',
  'fully-booked': 'Fully Booked',
}

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

export function slugify(value?: string | null) {
  if (!value) {
    return ''
  }

  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

function getDatePartsForTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  return {
    day: parts.find((part) => part.type === 'day')?.value ?? '01',
    month: parts.find((part) => part.type === 'month')?.value ?? '01',
    year: parts.find((part) => part.type === 'year')?.value ?? '1970',
  }
}

export function getDateKeyForTimeZone(date: Date, timeZone = STUDIO_TIME_ZONE) {
  const { day, month, year } = getDatePartsForTimeZone(date, timeZone)

  return `${year}-${month}-${day}`
}

export function getCurrentStudioDateKey(date = new Date()) {
  return getDateKeyForTimeZone(date, STUDIO_TIME_ZONE)
}

export function parseDateKey(value?: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return date
}

export function normalizeDateKey(value?: Date | string | null) {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    const normalized = value.trim()
    const directMatch = normalized.match(/^\d{4}-\d{2}-\d{2}/)

    if (directMatch) {
      return directMatch[0]
    }

    const parsed = new Date(normalized)

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10)
    }

    return null
  }

  return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10)
}

export function shiftDateKey(dateKey: string, days: number) {
  const date = parseDateKey(dateKey)

  if (!date) {
    return getCurrentStudioDateKey()
  }

  date.setUTCDate(date.getUTCDate() + days)

  return date.toISOString().slice(0, 10)
}

export function getDateKeysAround(dateKey: string, daysBefore: number, daysAfter: number) {
  const keys: string[] = []

  for (let offset = -daysBefore; offset <= daysAfter; offset += 1) {
    keys.push(shiftDateKey(dateKey, offset))
  }

  return keys
}

export function formatStudioDateLabel(value?: Date | string | null) {
  const dateKey = normalizeDateKey(value)

  if (!dateKey) {
    return null
  }

  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return new Intl.DateTimeFormat('en-PH', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatStudioDateShortLabel(value?: Date | string | null) {
  const dateKey = normalizeDateKey(value)

  if (!dateKey) {
    return null
  }

  const date = parseDateKey(dateKey)

  if (!date) {
    return null
  }

  return new Intl.DateTimeFormat('en-PH', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatStudioWeekdayLabel(value?: Date | string | null) {
  const dateKey = normalizeDateKey(value)

  if (!dateKey) {
    return null
  }

  const date = parseDateKey(dateKey)

  if (!date) {
    return null
  }

  return new Intl.DateTimeFormat('en-PH', {
    timeZone: 'UTC',
    weekday: 'short',
  }).format(date)
}

export function getTimeValueInMinutes(value?: string | null) {
  if (!value) {
    return null
  }

  const normalized = value.trim().toUpperCase().replace(/\s+/g, ' ')
  const match12Hour = normalized.match(/^([1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/)

  if (match12Hour) {
    const hour = Number(match12Hour[1]) % 12
    const minutes = Number(match12Hour[2])
    const totalHours = match12Hour[3] === 'PM' ? hour + 12 : hour

    return totalHours * 60 + minutes
  }

  const match = normalized.match(/^([01]\d|2[0-3]):([0-5]\d)$/)

  if (!match) {
    return null
  }

  return Number(match[1]) * 60 + Number(match[2])
}

export function normalizeScheduleTimeInput(value?: string | null) {
  const totalMinutes = getTimeValueInMinutes(value)

  if (totalMinutes === null) {
    return value?.trim() || null
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const normalizedHour = hours % 12 || 12

  return `${normalizedHour}:${String(minutes).padStart(2, '0')} ${period}`
}

export function formatScheduleTime(value?: string | null) {
  return normalizeScheduleTimeInput(value)
}

export function formatScheduleRange(startTime?: string | null, endTime?: string | null) {
  const start = formatScheduleTime(startTime)
  const end = formatScheduleTime(endTime)

  if (start && end) {
    return `${start} - ${end}`
  }

  return [start, end].filter(Boolean).join(' - ') || null
}

export function getScheduleDayStatusLabel(status: ScheduleDayStatus) {
  return scheduleDayStatusLabels[status]
}

export function getScheduleSlotStatusLabel(status: ScheduleSlotStatus) {
  return scheduleSlotStatusLabels[status]
}

export function isExternalUrl(url?: string | null) {
  return Boolean(url && /^https?:\/\//i.test(url))
}

export function hasMeaningfulExternalUrl(url?: string | null) {
  if (!url || !isExternalUrl(url)) {
    return false
  }

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    const pathname = parsed.pathname.replace(/\/+$/, '') || '/'
    const hasExtraPath = pathname !== '/'
    const hasQuery = Boolean(parsed.search)

    if (host === 'facebook.com' && !hasExtraPath && !hasQuery) {
      return false
    }

    if (host === 'instagram.com' && !hasExtraPath && !hasQuery) {
      return false
    }

    if (host === 'tiktok.com' && !hasExtraPath && !hasQuery) {
      return false
    }

    if (host === 'maps.google.com' && !hasExtraPath && !hasQuery) {
      return false
    }

    return true
  } catch {
    return false
  }
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
