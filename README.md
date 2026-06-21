# Sixram Band Studio Website

Public website and Payload CMS-powered content platform for Sixram Band Studio. The current implementation covers a polished Phase 2 public experience with a simplified landing page, detailed content pages, reusable UI components, Payload admin at `/admin`, and seed content that can populate both content entries and media records.

## Tech Stack

* Next.js 16 with App Router
* TypeScript
* Payload CMS
* Neon PostgreSQL via `@payloadcms/db-postgres`
* Vercel Blob via `@payloadcms/storage-vercel-blob`
* Tailwind CSS v4
* shadcn/ui-ready component structure
* Vercel-ready deployment

## Public Pages

* Home: `/`
* Rates: `/rates`
* Gallery: `/gallery`
* Featured Bands: `/featured-bands`
* Promos: `/promos`
* Contact: `/contact`

## Payload Admin

* Local admin URL: [http://localhost:3000/admin](http://localhost:3000/admin)
* App route: `/admin`

Payload manages:

* Rates
* Gallery
* Featured Bands
* Promos
* Media
* Contact Info
* Site Settings

## Content Management

Use Payload CMS to manage all public content:

* Update hero copy, logo, CTA text, and SEO fields in `Site Settings`
* Update contact number, Facebook page, address, hours, maps link, and booking instructions in `Contact Info`
* Create active rate packages in `Rates`
* Create approved gallery entries in `Gallery`
* Create featured band profiles and optional YouTube links in `Featured Bands`
* Create active promos with valid dates in `Promos`
* Upload images and supporting media in `Media`

Public filtering is automatic:

* Only active rates are shown publicly
* Only approved gallery items are shown publicly
* Featured bands are ordered first, then by display order
* Only active, non-expired promos are shown publicly

## Requirements

* Node.js 24+
* A PostgreSQL connection string for Neon or another Postgres provider
* A Payload secret
* Optional Vercel Blob token for cloud media uploads

## Setup

1. Install dependencies:

```bash
corepack pnpm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Fill in the required environment variables in `.env`.

4. Generate Payload types and import map if needed:

```bash
corepack pnpm run generate:types
corepack pnpm run generate:importmap
```

5. Start local development:

```bash
corepack pnpm run dev
```

6. Open the public website at [http://localhost:3000](http://localhost:3000) and the Payload admin at [http://localhost:3000/admin](http://localhost:3000/admin).

## Environment Variables

Example values are provided in `.env.example`.

* `DATABASE_URL`: Neon PostgreSQL connection string used by Payload's Postgres adapter
* `PAYLOAD_SECRET`: secret used by Payload authentication and session handling
* `NEXT_PUBLIC_SITE_URL`: base URL for local and deployed metadata
* `BLOB_READ_WRITE_TOKEN`: optional Vercel Blob token for cloud media uploads

## Useful Commands

```bash
corepack pnpm run dev
corepack pnpm run lint
corepack pnpm run build
corepack pnpm run seed
corepack pnpm run db:migrate
corepack pnpm run db:migrate:create
```

## Seed Content

Run the seed script after your database is configured if you want starter CMS entries for:

* Hero copy
* Rehearsal Only - `PHP 200` per hour
* `2 Hours + Free Multitrack Live Recording - PHP 699`
* A sample promo
* A sample featured band
* A sample gallery placeholder item
* Media records for the hero image, logo, promo artwork, featured band art, and gallery placeholder

Command:

```bash
corepack pnpm run seed
```

## Deployment Notes

### Vercel

* Deploy this project as a standard Next.js application.
* Set the same environment variables from `.env.example` in the Vercel project settings.
* Keep `NEXT_PUBLIC_SITE_URL` aligned with your production domain.

### Neon PostgreSQL

* Store the Neon connection string in `DATABASE_URL`.
* Use Payload migration commands during release workflows for production schema updates.
* In development, Payload can work against the configured Postgres database directly once `DATABASE_URL` is set.

### Vercel Blob

* Add Blob storage to the Vercel project.
* Set `BLOB_READ_WRITE_TOKEN` in the Vercel environment.
* The Vercel Blob adapter is enabled automatically when the token is present.
* Without the token, local Payload uploads fall back to local storage for development.
* The Media collection accepts image, audio, video, and PDF uploads for content management.

## Notes

* Public users do not have login accounts in this phase.
* Payments, booking calendars, Prisma, NextAuth/Auth.js, and custom admin dashboards are intentionally out of scope.
* Content management is handled by Payload CMS only.
