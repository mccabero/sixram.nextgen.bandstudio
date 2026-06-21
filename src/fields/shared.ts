import type { Field, FilterOptions } from 'payload'

const urlValidationMessage = 'Please enter a valid URL.'
const youtubeValidationMessage = 'Please enter a valid YouTube URL.'

function normalizeTextValue(value: string | null | undefined) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : null
}

function isValidAbsoluteUrl(value: string) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function isValidYouTubeUrl(value: string | null | undefined) {
  const normalized = normalizeTextValue(value)

  if (!normalized) {
    return false
  }

  try {
    const parsed = new URL(normalized)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return Boolean(parsed.pathname.split('/').filter(Boolean)[0])
    }

    if (!host.endsWith('youtube.com')) {
      return false
    }

    if (parsed.pathname === '/watch') {
      return Boolean(parsed.searchParams.get('v'))
    }

    const [, firstSegment, secondSegment] = parsed.pathname.split('/')

    return ['embed', 'live', 'shorts'].includes(firstSegment) && Boolean(secondSegment)
  } catch {
    return false
  }
}

export const displayOrderField: Field = {
  name: 'displayOrder',
  label: 'Display Order',
  type: 'number',
  defaultValue: 100,
  min: 0,
  admin: {
    description: 'Lower numbers appear first on the public website.',
    step: 1,
  },
}

export const isFeaturedField: Field = {
  name: 'isFeatured',
  label: 'Featured',
  type: 'checkbox',
  defaultValue: false,
  admin: {
    description: 'Featured items appear first in homepage previews and highlighted sections.',
  },
}

export const isActiveField: Field = {
  name: 'isActive',
  label: 'Active',
  type: 'checkbox',
  defaultValue: true,
  admin: {
    description: 'Only active items can appear on the public website.',
  },
}

export const inclusionsField: Field = {
  name: 'inclusions',
  label: 'Inclusions',
  type: 'array',
  labels: {
    plural: 'Inclusions',
    singular: 'Inclusion',
  },
  fields: [
    {
      name: 'item',
      label: 'Item',
      type: 'text',
      required: true,
    },
  ],
  admin: {
    description: 'Add each included item, gear detail, or session perk shown on the public website.',
    initCollapsed: false,
  },
}

export const mediaUploadField = ({
  filterOptions,
  name,
  label,
  description,
  hasMany = false,
  required = false,
}: {
  description?: string
  filterOptions?: FilterOptions
  hasMany?: boolean
  label: string
  name: string
  required?: boolean
}): Field => ({
  filterOptions,
  name,
  label,
  type: 'upload',
  relationTo: 'media',
  hasMany,
  required,
  admin: {
    description,
  },
})

export const optionalUrlField = ({
  allowRelative = false,
  description,
  label,
  name,
  placeholder,
}: {
  allowRelative?: boolean
  description?: string
  label: string
  name: string
  placeholder?: string
}): Field => ({
  name,
  label,
  type: 'text',
  admin: {
    description,
    placeholder,
  },
  validate: (value: string | null | undefined) => {
    const normalized = normalizeTextValue(value)

    if (!normalized) {
      return true
    }

    if (allowRelative && normalized.startsWith('/')) {
      return true
    }

    return isValidAbsoluteUrl(normalized) ? true : urlValidationMessage
  },
})

export const youtubeUrlField = ({
  description = 'Paste a normal YouTube video link. The website will automatically convert it to an embedded video when possible.',
  label = 'YouTube Video URL',
  name = 'youtubeVideoUrl',
}: {
  description?: string
  label?: string
  name?: string
} = {}): Field => ({
  name,
  label,
  type: 'text',
  admin: {
    description,
    placeholder: 'https://www.youtube.com/watch?v=VIDEO_ID',
  },
  validate: (value: string | null | undefined) => {
    const normalized = normalizeTextValue(value)

    if (!normalized) {
      return true
    }

    return isValidYouTubeUrl(normalized) ? true : youtubeValidationMessage
  },
})
