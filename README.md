# Sixram Band Studio Website

Public website and Payload CMS-powered content platform for Sixram Band Studio. The current implementation includes the Phase 1 public website, the Phase 2 homepage cleanup, and the Phase 3 Payload CMS refinements for easier content management, safer publishing, and stronger public fallbacks.

## Tech Stack

* Next.js 16 with App Router
* TypeScript
* Payload CMS
* Neon PostgreSQL via `@payloadcms/db-postgres`
* Vercel Blob via `@payloadcms/storage-vercel-blob`
* Tailwind CSS v4
* shadcn/ui-ready component structure
* Vercel-ready deployment

## Public Website Pages

* Home: `/`
* Rates: `/rates`
* Gallery: `/gallery`
* Featured Bands: `/featured-bands`
* Promos: `/promos`
* Schedule: `/schedule`
* Contact: `/contact`

## Payload Admin

* Local admin URL: [http://localhost:3000/admin](http://localhost:3000/admin)
* App route: `/admin`

Payload manages:

* Rates
* Gallery
* Featured Bands
* Promos
* Daily Schedules
* Media
* Contact Info
* Site Settings

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

3. Fill in the required environment variables.

4. Start local development:

```bash
corepack pnpm run dev
```

5. Open the public website at [http://localhost:3000](http://localhost:3000) and Payload admin at [http://localhost:3000/admin](http://localhost:3000/admin).

## Environment Variables

Example values are provided in `.env.example`.

* `DATABASE_URL`: Neon PostgreSQL connection string used by Payload's Postgres adapter
* `PAYLOAD_SECRET`: secret used by Payload authentication and session handling
* `NEXT_PUBLIC_SITE_URL`: base URL for local and deployed metadata
* `BLOB_READ_WRITE_TOKEN`: optional in local development, but required on Vercel if you want Payload media uploads to work reliably

## Useful Commands

```bash
corepack pnpm run dev
corepack pnpm run lint
corepack pnpm run build
corepack pnpm run generate:types
corepack pnpm run generate:importmap
corepack pnpm run seed
corepack pnpm run db:migrate
corepack pnpm run db:migrate:create
```

## Content Management Guide

### Site Settings

Manage the main brand and homepage content in `Site Settings`.

Use it for:

* Logo
* Hero title and subtitle
* Hero image
* Main CTA text and CTA link
* SEO title and description

Notes:

* If `Main CTA Link` is empty, the public website falls back to `/contact`.
* If `Hero Image` is empty, the homepage uses a clean dark fallback panel.
* If `Logo` is empty, the header and footer fall back to bundled studio branding.

### Contact Info

Manage the public business details in `Contact Info`.

Use it for:

* Studio name
* Contact number
* Facebook page
* Address
* Google Maps link
* Business hours
* Booking instructions

Notes:

* If `Contact Number` is empty, phone links are hidden safely.
* If `Facebook Page` is empty, Facebook buttons are hidden safely.
* If `Google Maps Link` is empty, the map button is hidden safely.

### Rates

Add each rehearsal package in `Rates`.

Recommended fields:

* Package Name
* Description
* Duration
* Price
* Inclusions
* Featured
* Active
* Display Order

Public behavior:

* Only active rates are shown publicly.
* Rates are sorted by `Display Order`.
* Featured rates are prioritized in homepage previews.

### Gallery

Add public photo sets in `Gallery`.

Recommended fields:

* Title
* Images
* Band / Client Name
* Caption
* Session Date
* Approved for Posting
* Featured
* Display Order

Public behavior:

* Only approved gallery items are shown publicly.
* Featured gallery items appear first.
* Missing captions, dates, or images fall back safely.

### Featured Bands

Add band spotlights in `Featured Bands`.

Recommended fields:

* Band Name
* Genre
* Description
* Band Photo
* YouTube Video URL
* Facebook, Instagram, TikTok links
* Featured
* Display Order

YouTube guidance:

* Paste a normal YouTube link such as `youtube.com/watch?v=...`, `youtu.be/...`, or `youtube.com/embed/...`.
* The website converts valid YouTube links into an embeddable video automatically.
* Invalid or missing video links do not crash the page; a fallback state is shown instead.

Public behavior:

* Featured bands appear first.
* Bands are sorted by `Display Order`.
* Missing photos, descriptions, and social links are handled safely.

### Promos

Add time-based offers in `Promos`.

Recommended fields:

* Promo Title
* Description
* Promo Price
* Original Price
* Start Date
* End Date
* Promo Image
* Active
* Display Order

Public behavior:

* Only active promos are shown publicly.
* Future promos stay hidden until their `Start Date`.
* Expired promos are hidden after their `End Date`.
* Empty `End Date` means the promo is ongoing.
* Promos are sorted by `Display Order`, then by newest created date when needed.

Promo image note:

* Public promo title, description, and pricing come from CMS text fields.
* Promo images are displayed inside a dark 16:9 container with contained scaling to protect poster text from being cropped.

### Daily Schedules

Add the public day-by-day availability entries in `Daily Schedules`.

Recommended fields:

* Schedule Date
* Day Status
* Public Note
* Published
* Time Slots
* Internal Band / Client Name
* Public Display Name
* Show Public Display Name

Public behavior:

* The `/schedule` page shows the published schedule for the selected studio day.
* The `/schedule` page also lets visitors move through previous and upcoming days to review posted availability.
* Only one schedule can exist per day because `Schedule Date Key` is generated automatically and kept unique.
* Slot times are expected in 12-hour `h:mm AM/PM` format and cannot overlap.
* `Internal Band / Client Name` is the default public band/client name for reserved slots.
* `Public Display Name` is an optional override that can replace the default name when `Show Public Display Name` is enabled.
* When a reserved slot has no band/client name entered, the website shows `Reserved`.
* When a reserved slot has a band/client name, the website shows that name instead of a separate reserved label.

### Media

Upload reusable media in `Media`.

Required fields:

* `Alt Text / Media Label`

Optional fields:

* `Caption`

Use descriptive alt text for accessibility and SEO.

## Publishing Flags

Use these fields consistently in Payload:

* `Active`: the item is allowed to appear publicly.
* `Inactive`: the item stays hidden from the public website.
* `Approved for Posting`: gallery-only flag that allows an item to appear publicly.
* `Featured`: pushes the item ahead of non-featured items in public previews and sorted lists.
* `Display Order`: lower numbers appear first on the public website.

## Seed Content

The repository includes a starter seed script for sample content and media records.

It can create:

* Site Settings defaults for Sixram Band Studio
* Contact Info starter content
* `Rehearsal Only - PHP 200`
* `2 Hours + Free Multitrack Live Recording - PHP 699`
* A sample promo
* A sample featured band
* A sample gallery entry
* Sample media assets and placeholders

Run it after `DATABASE_URL` is configured:

```bash
corepack pnpm run seed
```

## Deployment Notes

### Vercel

* Deploy this project as a standard Next.js application.
* Set the same environment variables from `.env.example` in the Vercel project settings.
* Keep `NEXT_PUBLIC_SITE_URL` aligned with your production domain.
* If you deploy from the Vercel CLI on Windows, avoid uploading a Windows-built prebuilt artifact for production. Let Vercel build on Linux from the repository, or reinstall dependencies before deployment so Linux `sharp` binaries are included.

### Neon PostgreSQL

* Store the Neon connection string in `DATABASE_URL`.
* Use Payload migration commands during release workflows for production schema updates.
* In development, Payload can work against the configured Postgres database directly once `DATABASE_URL` is set.

### Vercel Blob

* Add Blob storage to the Vercel project.
* Set `BLOB_READ_WRITE_TOKEN` in the Vercel environment.
* The Vercel Blob adapter is enabled automatically when the token is present.
* On Vercel, do not rely on local Payload file storage for media uploads. Without `BLOB_READ_WRITE_TOKEN`, media records may save in the database while the actual file URL fails in production.
* Without the token, local Payload uploads fall back to local storage for development.
* The Media collection accepts image, audio, video, and PDF uploads for content management.

## Notes

* Public users do not have login accounts in this phase.
* Payments, booking calendars, Prisma, NextAuth/Auth.js, and custom admin dashboards are intentionally out of scope.
* Content management is handled by Payload CMS only.
