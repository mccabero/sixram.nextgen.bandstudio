import type { Field, FilterOptions } from 'payload'

const urlValidationMessage = 'Please enter a valid URL.'

export const displayOrderField: Field = {
  name: 'displayOrder',
  label: 'Display Order',
  type: 'number',
  defaultValue: 0,
  admin: {
    description: 'Lower values appear first on the public website.',
    step: 1,
  },
}

export const isFeaturedField: Field = {
  name: 'isFeatured',
  label: 'Featured',
  type: 'checkbox',
  defaultValue: false,
}

export const isActiveField: Field = {
  name: 'isActive',
  label: 'Active',
  type: 'checkbox',
  defaultValue: true,
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
}

export const mediaUploadField = ({
  filterOptions,
  name,
  label,
  hasMany = false,
  required = false,
}: {
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
})

export const optionalUrlField = ({
  allowRelative = false,
  description,
  label,
  name,
}: {
  allowRelative?: boolean
  description?: string
  label: string
  name: string
}): Field => ({
  name,
  label,
  type: 'text',
  admin: {
    description,
  },
  validate: (value: string | null | undefined) => {
    if (!value || typeof value !== 'string') {
      return true
    }

    if (allowRelative && value.startsWith('/')) {
      return true
    }

    try {
      new URL(value)
      return true
    } catch {
      return urlValidationMessage
    }
  },
})
