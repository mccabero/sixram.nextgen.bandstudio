import type { NextRequest } from 'next/server'

import { createOgImageResponse, isOgPageKey } from '@/lib/og'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const requestedPage = request.nextUrl.searchParams.get('page')
  const page = isOgPageKey(requestedPage) ? requestedPage : 'home'

  return createOgImageResponse(page)
}
