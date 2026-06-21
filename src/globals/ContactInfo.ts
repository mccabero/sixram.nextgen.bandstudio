import type { GlobalConfig } from 'payload'

import { publicRead } from '@/access'
import { optionalUrlField } from '@/fields/shared'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  access: {
    read: publicRead,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'studioName',
      label: 'Studio Name',
      type: 'text',
      required: true,
    },
    {
      name: 'contactNumber',
      label: 'Contact Number',
      type: 'text',
      required: true,
    },
    optionalUrlField({
      label: 'Facebook Page',
      name: 'facebookPage',
    }),
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      required: true,
    },
    optionalUrlField({
      label: 'Google Maps Link',
      name: 'googleMapsLink',
    }),
    {
      name: 'businessHours',
      label: 'Business Hours',
      type: 'textarea',
      required: true,
    },
    {
      name: 'bookingInstructions',
      label: 'Booking Instructions',
      type: 'textarea',
      required: true,
    },
  ],
  label: 'Contact Info',
}
