# AGENTS.md

## Project

Repository name: `sixram.nextgen.bandstudio`

This project is a public website for Sixram Band Studio with Payload CMS as the admin portal.

The website will promote the studio, display rehearsal rates, show gallery photos, feature bands, publish promos, and provide contact/booking information.

## Final Tech Stack

Use:

* Next.js
* TypeScript
* Payload CMS
* Neon PostgreSQL
* Payload Postgres Adapter
* Vercel Blob
* Tailwind CSS
* shadcn/ui
* Vercel

## Do Not Use

Do not use:

* .NET
* MSSQL
* Prisma
* NextAuth/Auth.js
* Custom admin dashboard from scratch
* Payment tracking
* Booking calendar system for Phase 1

Payload CMS must handle the admin portal at:

`/admin`

## Public Website Pages

Create and maintain these public pages:

* Home: `/`
* Rates: `/rates`
* Gallery: `/gallery`
* Featured Bands: `/featured-bands`
* Promos: `/promos`
* Contact: `/contact`

## Payload CMS Admin

Payload should manage:

* Rates
* Gallery
* Featured Bands
* Promos
* Media
* Contact Info
* Site Settings

## Design Direction

Use a modern band studio design:

* Dark theme
* Black or charcoal background
* Red accent color
* White text
* Bold music/studio feel
* Clean and professional layout
* Fully responsive for mobile and desktop

## Business Details

Business name:

Sixram Band Studio

Main offering:

Band rehearsal studio with optional multitrack live recording.

Known rates:

* Rehearsal Only - ₱200 per hour
* 2 Hours + Free Multitrack Live Recording - ₱699

Important notes:

* By reservation only
* No walk-ins
* Schedule is subject to availability

## Public Website Content

### Home Page

The home page should include:

* Hero section
* Book Now call-to-action
* Current promo preview
* Rates preview
* Gallery preview
* Featured bands preview
* Studio inclusions section
* Contact call-to-action

### Rates Page

The rates page should show:

* Rehearsal packages
* Promo packages
* Duration
* Price
* Inclusions
* Booking notes

### Gallery Page

The gallery page should show:

* Studio photos
* Client/band photos
* Live recording session photos
* Featured gallery items

Only approved gallery items should be displayed publicly.

### Featured Bands Page

The featured bands page should show:

* Band name
* Genre
* Description
* Band photo
* YouTube video embed or link
* Social media links

### Promos Page

The promos page should show:

* Active promos
* Promo title
* Promo price
* Original price
* Promo description
* Promo image
* Promo validity

Expired or inactive promos should not be displayed publicly.

### Contact Page

The contact page should show:

* Contact number
* Facebook page link
* Address
* Google Maps link or embed
* Business hours
* Booking instructions
* Book Now or Message on Facebook button

## Payload Collections

Create and maintain these Payload collections:

### Rates

Fields:

* packageName
* description
* duration
* price
* inclusions
* isFeatured
* isActive
* displayOrder

### Gallery

Fields:

* title
* images
* bandOrClientName
* caption
* sessionDate
* approvedForPosting
* isFeatured
* displayOrder

### Featured Bands

Fields:

* bandName
* genre
* description
* bandPhoto
* youtubeVideoUrl
* facebookLink
* instagramLink
* tiktokLink
* isFeatured
* displayOrder

### Promos

Fields:

* promoTitle
* description
* promoPrice
* originalPrice
* startDate
* endDate
* promoImage
* isActive
* displayOrder

### Media

Use Payload upload collection for images and media files.

## Payload Globals

Create and maintain these Payload globals:

### Contact Info

Fields:

* studioName
* contactNumber
* facebookPage
* address
* googleMapsLink
* businessHours
* bookingInstructions

### Site Settings

Fields:

* logo
* heroTitle
* heroSubtitle
* heroImage
* mainCtaText
* mainCtaLink
* seoTitle
* seoDescription

## Development Rules

* Use clean, maintainable, production-ready code.
* Use reusable components.
* Keep the folder structure clean.
* Keep Payload collections easy to manage from the admin portal.
* Do not add features outside the requested phase.
* Do not add payment tracking.
* Do not add full booking/calendar management yet.
* Prefer server components where appropriate.
* Use TypeScript types properly.
* Avoid unnecessary dependencies.
* Update README when setup, environment variables, or commands change.

## Package Manager

Prefer:

`pnpm`

## Commands

Before finishing a task, run these commands when available:

```bash
pnpm lint
pnpm build
```

If a command is missing or fails because setup is incomplete, explain the reason clearly and suggest the next fix.

## Completion Criteria

A task is complete only when:

* The requested feature is implemented.
* The code follows the final tech stack.
* The code does not introduce prohibited technologies.
* Public pages remain responsive.
* Payload admin remains functional.
* Lint/build checks are run when available.
* README or documentation is updated when needed.
