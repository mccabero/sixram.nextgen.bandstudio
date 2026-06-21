import type { CollectionConfig } from 'payload'

import { publicRead } from '@/access'
import {
  displayOrderField,
  isFeaturedField,
  mediaUploadField,
  optionalUrlField,
  youtubeUrlField,
} from '@/fields/shared'

export const FeaturedBands: CollectionConfig = {
  slug: 'featured-bands',
  access: {
    read: publicRead,
  },
  admin: {
    defaultColumns: ['bandName', 'genre', 'isFeatured', 'displayOrder'],
    group: 'Content',
    useAsTitle: 'bandName',
  },
  labels: {
    plural: 'Featured Bands',
    singular: 'Featured Band',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Band Info',
          fields: [
            {
              name: 'bandName',
              label: 'Band Name',
              type: 'text',
              required: true,
              admin: {
                description: 'Public name of the featured band or artist.',
              },
            },
            {
              name: 'genre',
              label: 'Genre',
              type: 'text',
              required: true,
              admin: {
                description: 'Example: Alternative Rock, Pop Punk, or Indie.',
              },
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              admin: {
                description: 'Optional short profile shown on the public Featured Bands page.',
              },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            mediaUploadField({
              description: 'Optional hero image or band photo for the public profile.',
              filterOptions: {
                mimeType: {
                  contains: 'image/',
                },
              },
              label: 'Band Photo',
              name: 'bandPhoto',
            }),
          ],
        },
        {
          label: 'YouTube Video',
          fields: [youtubeUrlField()],
        },
        {
          label: 'Social Links',
          fields: [
            optionalUrlField({
              description: 'Optional public Facebook page or profile URL.',
              label: 'Facebook Link',
              name: 'facebookLink',
              placeholder: 'https://www.facebook.com/your-page',
            }),
            optionalUrlField({
              description: 'Optional public Instagram profile URL.',
              label: 'Instagram Link',
              name: 'instagramLink',
              placeholder: 'https://www.instagram.com/your-profile',
            }),
            optionalUrlField({
              description: 'Optional public TikTok profile URL.',
              label: 'TikTok Link',
              name: 'tiktokLink',
              placeholder: 'https://www.tiktok.com/@your-profile',
            }),
          ],
        },
        {
          label: 'Publishing Settings',
          fields: [
            {
              type: 'row',
              fields: [isFeaturedField, displayOrderField],
            },
          ],
        },
      ],
    },
  ],
}
