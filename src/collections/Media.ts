import type { CollectionConfig } from 'payload'

import { publicRead } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: publicRead,
  },
  admin: {
    group: 'Content',
    useAsTitle: 'alt',
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text / Media Label',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'textarea',
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
