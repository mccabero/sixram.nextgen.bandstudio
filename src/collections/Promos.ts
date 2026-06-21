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
    defaultColumns: [
      'promoTitle',
      'promoPrice',
      'originalPrice',
      'isActive',
      'startDate',
      'endDate',
      'displayOrder',
    ],
    group: 'Content',
    useAsTitle: 'promoTitle',
  },
  labels: {
    plural: 'Promos',
    singular: 'Promo',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Promo Details',
          fields: [
            {
              name: 'promoTitle',
              label: 'Promo Title',
              type: 'text',
              required: true,
              admin: {
                description: 'Public title for the promo card and promo page.',
              },
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Short public summary that explains the promo offer.',
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
                  name: 'promoPrice',
                  label: 'Promo Price',
                  type: 'number',
                  min: 0,
                  required: true,
                  admin: {
                    description: 'Enter the discounted numeric price only.',
                    step: 1,
                  },
                },
                {
                  name: 'originalPrice',
                  label: 'Original Price',
                  type: 'number',
                  min: 0,
                  admin: {
                    description: 'Optional regular price shown with a strikethrough when provided.',
                    step: 1,
                  },
                  validate: (
                    value: number | null | undefined,
                    { siblingData }: { siblingData?: { promoPrice?: number | null } },
                  ) => {
                    if (typeof value !== 'number') {
                      return true
                    }

                    const promoPrice = (siblingData as { promoPrice?: number | null } | undefined)
                      ?.promoPrice

                    if (typeof promoPrice === 'number' && value < promoPrice) {
                      return 'Original Price should be greater than or equal to Promo Price.'
                    }

                    return true
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Validity',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'startDate',
                  label: 'Start Date',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayOnly',
                    },
                    description: 'Optional. Leave empty to make the promo available immediately when active.',
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
                    description: 'Optional. Leave empty to keep the promo ongoing until you deactivate it.',
                  },
                  validate: (value, { siblingData }) => {
                    const startDateValue = (siblingData as { startDate?: string | null } | undefined)
                      ?.startDate

                    if (!value || !startDateValue) {
                      return true
                    }

                    const endDate = new Date(value)
                    const startDate = new Date(startDateValue)

                    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
                      return true
                    }

                    return endDate >= startDate
                      ? true
                      : 'End Date must be the same as or later than Start Date.'
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Image and Display',
          fields: [
            mediaUploadField({
              description:
                'Optional promo artwork. Public title, description, and pricing come from the CMS text fields, so the image does not need to contain all promo text.',
              filterOptions: {
                mimeType: {
                  contains: 'image/',
                },
              },
              label: 'Promo Image',
              name: 'promoImage',
            }),
            {
              type: 'row',
              fields: [isActiveField, displayOrderField],
            },
          ],
        },
      ],
    },
  ],
}
