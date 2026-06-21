import type { GlobalConfig } from 'payload'

import { publicRead } from '@/access'
import { mediaUploadField, optionalUrlField } from '@/fields/shared'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: publicRead,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    mediaUploadField({
      filterOptions: {
        mimeType: {
          contains: 'image/',
        },
      },
      label: 'Logo',
      name: 'logo',
    }),
    {
      name: 'heroTitle',
      label: 'Hero Title',
      type: 'text',
      required: true,
    },
    {
      name: 'heroSubtitle',
      label: 'Hero Subtitle',
      type: 'textarea',
      required: true,
    },
    mediaUploadField({
      filterOptions: {
        mimeType: {
          contains: 'image/',
        },
      },
      label: 'Hero Image',
      name: 'heroImage',
    }),
    {
      name: 'mainCtaText',
      label: 'Main CTA Text',
      type: 'text',
      required: true,
    },
    optionalUrlField({
      allowRelative: true,
      label: 'Main CTA Link',
      name: 'mainCtaLink',
    }),
    {
      name: 'seoTitle',
      label: 'SEO Title',
      type: 'text',
      required: true,
    },
    {
      name: 'seoDescription',
      label: 'SEO Description',
      type: 'textarea',
      required: true,
    },
  ],
  label: 'Site Settings',
}
