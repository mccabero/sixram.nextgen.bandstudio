import type { CollectionConfig } from 'payload'

import { publicReadActivePromos } from '@/access'
import {
  displayOrderField,
  isActiveField,
  mediaUploadField,
} from '@/fields/shared'

export const Promos: CollectionConfig = {
  slug: 'promos',
  access: {
    read: publicReadActivePromos,
  },
  admin: {
    defaultColumns: ['promoTitle', 'promoPrice', 'isActive', 'endDate', 'displayOrder'],
    group: 'Content',
    useAsTitle: 'promoTitle',
  },
  fields: [
    {
      name: 'promoTitle',
      label: 'Promo Title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'promoPrice',
      label: 'Promo Price',
      type: 'number',
      min: 0,
      required: true,
    },
    {
      name: 'originalPrice',
      label: 'Original Price',
      type: 'number',
      min: 0,
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    mediaUploadField({
      filterOptions: {
        mimeType: {
          contains: 'image/',
        },
      },
      label: 'Promo Image',
      name: 'promoImage',
    }),
    isActiveField,
    displayOrderField,
  ],
}
