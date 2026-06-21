import type { CollectionConfig } from 'payload'

import { publicReadApprovedGallery } from '@/access'
import { displayOrderField, isFeaturedField, mediaUploadField } from '@/fields/shared'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  access: {
    read: publicReadApprovedGallery,
  },
  admin: {
    defaultColumns: [
      'title',
      'bandOrClientName',
      'approvedForPosting',
      'isFeatured',
      'sessionDate',
      'displayOrder',
    ],
    group: 'Content',
    useAsTitle: 'title',
  },
  labels: {
    plural: 'Gallery',
    singular: 'Gallery Item',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Gallery Info',
          fields: [
            {
              name: 'title',
              label: 'Title',
              type: 'text',
              required: true,
              admin: {
                description: 'Internal and public title for this gallery entry.',
              },
            },
            {
              name: 'bandOrClientName',
              label: 'Band / Client Name',
              type: 'text',
              admin: {
                description: 'Optional name of the band, client, or session owner.',
              },
            },
            {
              name: 'caption',
              label: 'Caption',
              type: 'textarea',
              admin: {
                description: 'Optional short caption shown below the gallery item.',
              },
            },
            {
              name: 'sessionDate',
              label: 'Session Date',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                },
                description: 'Optional session date for the gallery entry.',
              },
            },
          ],
        },
        {
          label: 'Images',
          fields: [
            mediaUploadField({
              description: 'Upload one or more approved website-ready photos for this gallery entry.',
              filterOptions: {
                mimeType: {
                  contains: 'image/',
                },
              },
              hasMany: true,
              label: 'Images',
              name: 'images',
            }),
          ],
        },
        {
          label: 'Publishing Settings',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'approvedForPosting',
                  label: 'Approved for Posting',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Only approved photos will appear on the public website.',
                  },
                },
                isFeaturedField,
                displayOrderField,
              ],
            },
          ],
        },
      ],
    },
  ],
}
