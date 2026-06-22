import { ImageResponse } from 'next/og'

import { placeholderContactInfo, placeholderSiteSettings } from '@/lib/placeholders'
import { getContactInfoData, getSiteSettingsData } from '@/lib/site-data'

export const ogImageSize = {
  height: 630,
  width: 1200,
}

export type OgPageKey =
  | 'contact'
  | 'featured-bands'
  | 'gallery'
  | 'home'
  | 'not-found'
  | 'promos'
  | 'rates'
  | 'schedule'

type OgPageContent = {
  description: string
  eyebrow: string
  title: string
}

const ogPageContent: Record<Exclude<OgPageKey, 'home'>, OgPageContent> = {
  contact: {
    description: 'Contact Sixram Band Studio to book your next rehearsal or live recording session.',
    eyebrow: 'BOOK YOUR SESSION',
    title: 'Contact',
  },
  'featured-bands': {
    description: 'Discover featured bands and artists who rehearsed or recorded at Sixram Band Studio.',
    eyebrow: 'ARTISTS IN THE ROOM',
    title: 'Featured Bands',
  },
  gallery: {
    description: 'View studio photos, band rehearsal sessions, and live recording moments at Sixram Band Studio.',
    eyebrow: 'INSIDE THE STUDIO',
    title: 'Gallery',
  },
  'not-found': {
    description: 'The page you tried to open is not available. Head back to Sixram Band Studio home or contact the studio directly.',
    eyebrow: 'PAGE NOT FOUND',
    title: '404',
  },
  promos: {
    description: 'Check current rehearsal and live recording promos from Sixram Band Studio.',
    eyebrow: 'LIVE OFFERS',
    title: 'Promos',
  },
  rates: {
    description: 'View Sixram Band Studio rehearsal rates, promo packages, inclusions, and booking notes.',
    eyebrow: 'PUBLIC RATES',
    title: 'Rates',
  },
  schedule: {
    description: 'Browse today, previous days, and upcoming days to check Sixram Band Studio schedule availability before booking.',
    eyebrow: 'CHECK AVAILABILITY',
    title: 'Schedule',
  },
}

function getOgPageContent(page: OgPageKey, siteName: string, heroSubtitle: string): OgPageContent {
  if (page === 'home') {
    return {
      description: heroSubtitle || placeholderSiteSettings.heroSubtitle,
      eyebrow: 'REHEARSAL + LIVE RECORDING',
      title: siteName,
    }
  }

  return ogPageContent[page]
}

export function isOgPageKey(value?: string | null): value is OgPageKey {
  return value === 'home' || value === 'schedule' || value === 'rates' || value === 'gallery' || value === 'featured-bands' || value === 'promos' || value === 'contact' || value === 'not-found'
}

export function getOgImagePath(page: OgPageKey) {
  const params = new URLSearchParams({ page })

  return `/api/og?${params.toString()}`
}

export async function createOgImageResponse(page: OgPageKey) {
  const [siteSettings, contactInfo] = await Promise.all([getSiteSettingsData(), getContactInfoData()])
  const siteName = contactInfo.studioName || placeholderContactInfo.studioName
  const ctaText = siteSettings.mainCtaText || placeholderSiteSettings.mainCtaText
  const heroSubtitle = siteSettings.heroSubtitle || placeholderSiteSettings.heroSubtitle
  const content = getOgPageContent(page, siteName, heroSubtitle)

  return new ImageResponse(
    (
      <div
        style={{
          background:
            'linear-gradient(145deg, rgba(15,15,15,1) 0%, rgba(7,7,7,1) 55%, rgba(3,3,3,1) 100%)',
          color: '#ffffff',
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          padding: '56px',
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          style={{
            background: 'radial-gradient(circle, rgba(209,31,42,0.38) 0%, rgba(209,31,42,0) 70%)',
            display: 'flex',
            height: '540px',
            left: '-80px',
            position: 'absolute',
            top: '-120px',
            width: '540px',
          }}
        />
        <div
          style={{
            background: 'radial-gradient(circle, rgba(209,31,42,0.24) 0%, rgba(209,31,42,0) 72%)',
            display: 'flex',
            height: '520px',
            position: 'absolute',
            right: '-160px',
            top: '180px',
            width: '520px',
          }}
        />
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '32px',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              gap: '18px',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '18px',
                  color: '#080808',
                  display: 'flex',
                  fontSize: '28px',
                  fontWeight: 900,
                  height: '72px',
                  justifyContent: 'center',
                  letterSpacing: '0.08em',
                  paddingLeft: '22px',
                  paddingRight: '22px',
                  textTransform: 'uppercase',
                }}
              >
                S
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}
                >
                  {siteName}
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.68)',
                    fontSize: '16px',
                    fontWeight: 600,
                    letterSpacing: '0.24em',
                  }}
                >
                  {content.eyebrow}
                </div>
              </div>
            </div>
            <div
              style={{
                alignItems: 'center',
                background: 'rgba(209,31,42,0.14)',
                border: '1px solid rgba(209,31,42,0.24)',
                borderRadius: '999px',
                color: '#f4b0b5',
                display: 'flex',
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '0.16em',
                padding: '14px 22px',
              }}
            >
              BY RESERVATION ONLY
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxWidth: '780px',
            }}
          >
            <div
              style={{
                fontSize: page === 'home' ? '84px' : '72px',
                fontWeight: 900,
                letterSpacing: '0.01em',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              {content.title}
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.78)',
                display: 'flex',
                fontSize: '28px',
                lineHeight: 1.45,
                maxWidth: '860px',
              }}
            >
              {content.description}
            </div>
          </div>

          <div
            style={{
              alignItems: 'flex-end',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                color: 'rgba(255,255,255,0.62)',
                display: 'flex',
                flexDirection: 'column',
                fontSize: '18px',
                gap: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <div>Quality amps, drums, microphones, speakers</div>
              <div>Optional multitrack live recording</div>
            </div>
            <div
              style={{
                alignItems: 'center',
                background: '#d11f2a',
                borderRadius: '999px',
                display: 'flex',
                fontSize: '22px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '18px 28px',
                textTransform: 'uppercase',
              }}
            >
              {ctaText}
            </div>
          </div>
        </div>
      </div>
    ),
    ogImageSize,
  )
}
