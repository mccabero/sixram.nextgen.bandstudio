import type { CollectionConfig } from 'payload'

import { publicReadActiveRates } from '@/access'
import {
  displayOrderField,
  inclusionsField,
  isActiveField,
  isFeaturedField,
} from '@/fields/shared'

export const Rates: CollectionConfig = {
  slug: 'rates',
  access: {
    read: publicReadActiveRates,
  },
  admin: {
    defaultColumns: ['packageName', 'price', 'duration', 'isFeatured', 'isActive', 'displayOrder'],
    group: 'Content',
    useAsTitle: 'packageName',
  },
  labels: {
    plural: 'Rates',
    singular: 'Rate',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Package Info',
          fields: [
            {
              name: 'packageName',
              label: 'Package Name',
              type: 'text',
              required: true,
              admin: {
                description: 'Public name of the rehearsal package or rate.',
              },
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Short public summary shown on rate cards and preview sections.',
              },
            },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'duration',
                  label: 'Duration',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Example: 1 hour or 2 hours.',
                  },
                },
                {
                  name: 'price',
                  label: 'Price',
                  type: 'number',
                  min: 0,
                  required: true,
                  admin: {
                    description: 'Enter the numeric price only. The website adds the currency format.',
                    step: 1,
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Inclusions',
          fields: [inclusionsField],
        },
        {
          label: 'Publishing Settings',
          fields: [
            {
              type: 'row',
              fields: [isFeaturedField, isActiveField, displayOrderField],
            },
          ],
        },
      ],
    },
  ],
}
