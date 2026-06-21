import { NextResponse } from 'next/server'

export async function GET() {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim()

  const response: {
    blob: {
      error?: string
      errorName?: string
      tokenFormatLooksValid: boolean
      tokenPresent: boolean
      writableCheckPassed?: boolean
    }
    env: {
      siteUrl: string | null
      vercel: boolean
    }
  } = {
    blob: {
      tokenFormatLooksValid: Boolean(blobToken?.startsWith('vercel_blob_rw_')),
      tokenPresent: Boolean(blobToken),
    },
    env: {
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
      vercel: Boolean(process.env.VERCEL),
    },
  }

  if (!blobToken) {
    return NextResponse.json(response, { status: 200 })
  }

  try {
    const blobResponse = await fetch('https://vercel.com/api/blob?limit=1', {
      headers: {
        authorization: `Bearer ${blobToken}`,
      },
    })

    response.blob.writableCheckPassed = blobResponse.ok

    if (!blobResponse.ok) {
      const errorText = await blobResponse.text()

      response.blob.error = errorText || `Blob API request failed with ${blobResponse.status}`
      response.blob.errorName = `HTTP_${blobResponse.status}`
    }
  } catch (error) {
    response.blob.error = error instanceof Error ? error.message : 'Unknown Blob error'
    response.blob.errorName = error instanceof Error ? error.name : 'UnknownError'
    response.blob.writableCheckPassed = false
  }

  return NextResponse.json(response, { status: 200 })
}
