import 'dotenv/config'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig, type SharpDependency } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { FeaturedBands } from '@/collections/FeaturedBands'
import { Gallery } from '@/collections/Gallery'
import { Media } from '@/collections/Media'
import { Promos } from '@/collections/Promos'
import { Rates } from '@/collections/Rates'
import { Users } from '@/collections/Users'
import { ContactInfo } from '@/globals/ContactInfo'
import { SiteSettings } from '@/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/sixram_bandstudio'
const payloadSecret = process.env.PAYLOAD_SECRET || 'dev-payload-secret-change-me'
const blobToken = process.env.BLOB_READ_WRITE_TOKEN || ''

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      icons: {
        apple: '/branding/sixram-logo.png',
        icon: '/branding/sixram-logo.png',
      },
      titleSuffix: ' | Sixram Band Studio',
    },
    user: Users.slug,
  },
  collections: [Users, Media, Rates, Gallery, FeaturedBands, Promos],
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
    },
  }),
  globals: [ContactInfo, SiteSettings],
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      enabled: Boolean(blobToken),
      token: blobToken,
    }),
  ],
  routes: {
    admin: '/admin',
  },
  secret: payloadSecret,
  sharp: sharp as unknown as SharpDependency,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
