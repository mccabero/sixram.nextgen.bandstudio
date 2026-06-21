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
  fields: [
    {
      name: 'packageName',
      label: 'Package Name',
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
      name: 'duration',
      label: 'Duration',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      min: 0,
      required: true,
    },
    inclusionsField,
    isFeaturedField,
    isActiveField,
    displayOrderField,
  ],
}
