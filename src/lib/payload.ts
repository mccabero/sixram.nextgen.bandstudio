import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

let cachedPayload: Promise<Payload> | null = null

export function hasCmsEnvironment() {
  return Boolean(process.env.DATABASE_URL)
}

export async function getPayloadClient() {
  if (!cachedPayload) {
    cachedPayload = getPayload({
      config: configPromise,
    })
  }

  return cachedPayload
}
