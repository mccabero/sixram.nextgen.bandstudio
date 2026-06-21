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
      type: 'tabs',
      tabs: [
        {
          label: 'Business Info',
          fields: [
            {
              name: 'studioName',
              label: 'Studio Name',
              type: 'text',
              required: true,
              defaultValue: 'Sixram Band Studio',
              admin: {
                description: 'Public business name used throughout the website.',
              },
            },
            {
              name: 'contactNumber',
              label: 'Contact Number',
              type: 'text',
              admin: {
                description: 'Optional public phone number or mobile number for bookings.',
              },
            },
            {
              name: 'businessHours',
              label: 'Business Hours',
              type: 'textarea',
              required: true,
              defaultValue: 'Monday to Sunday | 1:00 PM to 11:00 PM',
              admin: {
                description: 'Public operating hours shown on the contact page and footer.',
              },
            },
          ],
        },
        {
          label: 'Contact Links',
          fields: [
            optionalUrlField({
              description: 'Optional public Facebook page URL used for direct messages and booking buttons.',
              label: 'Facebook Page',
              name: 'facebookPage',
              placeholder: 'https://www.facebook.com/your-page',
            }),
          ],
        },
        {
          label: 'Location',
          fields: [
            {
              name: 'address',
              label: 'Address',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Public studio address shown on the contact page and footer.',
              },
            },
            optionalUrlField({
              description: 'Optional public Google Maps link. Leave empty to hide the map button.',
              label: 'Google Maps Link',
              name: 'googleMapsLink',
              placeholder: 'https://maps.google.com/?q=Your+Address',
            }),
          ],
        },
        {
          label: 'Booking Instructions',
          fields: [
            {
              name: 'bookingInstructions',
              label: 'Booking Instructions',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Short public instructions that explain how customers should reserve a session.',
              },
            },
          ],
        },
      ],
    },
  ],
  label: 'Contact Info',
}
