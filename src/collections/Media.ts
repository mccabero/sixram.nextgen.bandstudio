import type { CollectionConfig } from 'payload'

import { publicRead } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: publicRead,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'caption', 'createdAt'],
    group: 'Content',
    useAsTitle: 'alt',
  },
  labels: {
    plural: 'Media',
    singular: 'Media Asset',
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text / Media Label',
      type: 'text',
      required: true,
      admin: {
        description:
          'Use descriptive alt text for accessibility and SEO. Example: Dark rehearsal studio setup with drums, amplifiers, microphones, and warm lighting.',
      },
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'textarea',
      admin: {
        description: 'Optional caption or internal note for the uploaded media item.',
      },
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        height: 720,
        name: 'card',
        width: 1280,
      },
      {
        height: 480,
        name: 'thumbnail',
        width: 640,
      },
    ],
    mimeTypes: ['image/*', 'audio/*', 'video/*', 'application/pdf'],
  },
}
