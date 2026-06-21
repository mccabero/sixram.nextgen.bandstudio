import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  const shouldRunWriteCheck = req.nextUrl.searchParams.get('write') === '1'

  const response: {
    blob: {
      error?: string
      errorName?: string
      readCheckPassed?: boolean
      tokenFormatLooksValid: boolean
      tokenPresent: boolean
      writableCheckPassed?: boolean
      writeError?: string
      writeErrorName?: string
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

    response.blob.readCheckPassed = blobResponse.ok

    if (!blobResponse.ok) {
      const errorText = await blobResponse.text()

      response.blob.error = errorText || `Blob API request failed with ${blobResponse.status}`
      response.blob.errorName = `HTTP_${blobResponse.status}`
    } else {
      response.blob.writableCheckPassed = true
    }

    if (shouldRunWriteCheck) {
      const pathname = `diagnostics/storage-check-${Date.now()}.txt`
      const writeBody = 'sixram-storage-check'
      const writeResponse = await fetch(
        `https://vercel.com/api/blob/?${new URLSearchParams({ pathname }).toString()}`,
        {
          body: writeBody,
          headers: {
            authorization: `Bearer ${blobToken}`,
            'content-length': String(writeBody.length),
            'x-add-random-suffix': '0',
            'x-api-version': '12',
            'x-content-length': String(writeBody.length),
            'x-content-type': 'text/plain',
            'x-vercel-blob-access': 'public',
          },
          method: 'PUT',
        },
      )

      response.blob.writableCheckPassed = writeResponse.ok

      if (!writeResponse.ok) {
        const writeErrorText = await writeResponse.text()

        response.blob.writeError =
          writeErrorText || `Blob write request failed with ${writeResponse.status}`
        response.blob.writeErrorName = `HTTP_${writeResponse.status}`
      }
    }
  } catch (error) {
    response.blob.error = error instanceof Error ? error.message : 'Unknown Blob error'
    response.blob.errorName = error instanceof Error ? error.name : 'UnknownError'
    response.blob.writableCheckPassed = false
  }

  return NextResponse.json(response, { status: 200 })
}
