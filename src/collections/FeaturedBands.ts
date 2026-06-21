import type { CollectionConfig } from 'payload'

import { publicRead } from '@/access'
import {
  displayOrderField,
  isFeaturedField,
  mediaUploadField,
  optionalUrlField,
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
  fields: [
    {
      name: 'bandName',
      label: 'Band Name',
      type: 'text',
      required: true,
    },
    {
      name: 'genre',
      label: 'Genre',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    mediaUploadField({
      filterOptions: {
        mimeType: {
          contains: 'image/',
        },
      },
      label: 'Band Photo',
      name: 'bandPhoto',
    }),
    optionalUrlField({
      description: 'Paste a public YouTube URL for the featured performance.',
      label: 'YouTube Video URL',
      name: 'youtubeVideoUrl',
    }),
    optionalUrlField({
      label: 'Facebook Link',
      name: 'facebookLink',
    }),
    optionalUrlField({
      label: 'Instagram Link',
      name: 'instagramLink',
    }),
    optionalUrlField({
      label: 'TikTok Link',
      name: 'tiktokLink',
    }),
    isFeaturedField,
    displayOrderField,
  ],
}
