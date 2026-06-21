import type { CollectionConfig } from 'payload'

import { publicReadApprovedGallery } from '@/access'
import { displayOrderField, isFeaturedField, mediaUploadField } from '@/fields/shared'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  access: {
    read: publicReadApprovedGallery,
  },
  admin: {
    defaultColumns: ['title', 'bandOrClientName', 'approvedForPosting', 'isFeatured', 'displayOrder'],
    group: 'Content',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    mediaUploadField({
      filterOptions: {
        mimeType: {
          contains: 'image/',
        },
      },
      hasMany: true,
      label: 'Images',
      name: 'images',
    }),
    {
      name: 'bandOrClientName',
      label: 'Band or Client Name',
      type: 'text',
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'textarea',
    },
    {
      name: 'sessionDate',
      label: 'Session Date',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'approvedForPosting',
      label: 'Approved for Posting',
      type: 'checkbox',
      defaultValue: false,
    },
    isFeaturedField,
    displayOrderField,
  ],
}
