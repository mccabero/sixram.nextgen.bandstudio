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
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branding',
          fields: [
            mediaUploadField({
              description: 'Optional website logo used in the header and footer.',
              filterOptions: {
                mimeType: {
                  contains: 'image/',
                },
              },
              label: 'Logo',
              name: 'logo',
            }),
          ],
        },
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'heroTitle',
              label: 'Hero Title',
              type: 'text',
              required: true,
              defaultValue: 'Sixram Band Studio',
              admin: {
                description: 'Main hero headline on the homepage.',
              },
            },
            {
              name: 'heroSubtitle',
              label: 'Hero Subtitle',
              type: 'textarea',
              required: true,
              defaultValue:
                'Band rehearsal studio with quality gear, live session energy, and optional multitrack recording.',
              admin: {
                description: 'Short supporting text below the hero title.',
              },
            },
            mediaUploadField({
              description: 'Optional homepage hero image. If left empty, the site uses a clean dark visual fallback.',
              filterOptions: {
                mimeType: {
                  contains: 'image/',
                },
              },
              label: 'Hero Image',
              name: 'heroImage',
            }),
          ],
        },
        {
          label: 'Call-to-Action',
          fields: [
            {
              name: 'mainCtaText',
              label: 'Main CTA Text',
              type: 'text',
              required: true,
              defaultValue: 'Book Your Session',
              admin: {
                description: 'Primary button label used across the public website.',
              },
            },
            optionalUrlField({
              allowRelative: true,
              description: 'Relative links like /contact are allowed. If empty, the public CTA falls back to /contact.',
              label: 'Main CTA Link',
              name: 'mainCtaLink',
              placeholder: '/contact',
            }),
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              label: 'SEO Title',
              type: 'text',
              required: true,
              defaultValue: 'Sixram Band Studio | Rehearsal & Live Recording Studio',
              admin: {
                description: 'Default browser title and search title for the public website.',
              },
            },
            {
              name: 'seoDescription',
              label: 'SEO Description',
              type: 'textarea',
              required: true,
              defaultValue:
                'Book band rehearsals at Sixram Band Studio with quality amps, drums, microphones, speakers, and optional multitrack live recording. By reservation only.',
              admin: {
                description: 'Default meta description used for search engines and social previews.',
              },
            },
          ],
        },
      ],
    },
  ],
  label: 'Site Settings',
}
