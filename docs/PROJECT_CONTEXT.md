# Sixram Band Studio Website

## Project Name

sixram.nextgen.bandstudio

## Purpose

This project is a public website and Payload CMS-powered content management system for Sixram Band Studio.

The website will promote the band studio, display rehearsal rates, show gallery photos, highlight featured bands, publish promos, and provide contact and booking information.

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

Payload CMS will provide the admin portal.

## Admin Portal

Payload CMS admin URL:

/admin

The admin will manage:

* Rates
* Gallery
* Featured Bands
* Promos
* Media
* Contact Info
* Site Settings

## Public Website Pages

The public website must have these pages:

* Home: /
* Rates: /rates
* Gallery: /gallery
* Featured Bands: /featured-bands
* Promos: /promos
* Contact: /contact

## Website Style

The website should have a modern band studio theme.

Preferred style:

* Dark theme
* Black or charcoal background
* Red accent color
* White text
* Bold music and studio feel
* Clean and professional layout
* Mobile responsive

## Business Details

Business name:

Sixram Band Studio

Main offering:

Band rehearsal studio with optional multitrack live recording.

Known rates:

* Rehearsal Only - ₱200 per hour
* 2 Hours + Free Multitrack Live Recording - ₱699

Important booking notes:

* By reservation only
* No walk-ins
* Schedule is subject to availability

## Public Website Sections

### Home

The home page should include:

* Hero section
* Book Now button
* Current promo preview
* Rates preview
* Gallery preview
* Featured bands preview
* Studio equipment or inclusions section
* Contact call-to-action

### Rates

The rates page should show:

* Rehearsal packages
* Promo packages
* Duration
* Price
* Inclusions
* Booking notes

### Gallery

The gallery page should show:

* Studio photos
* Client and band photos
* Live recording session photos
* Featured gallery items

Only approved gallery items should be displayed publicly.

### Featured Bands

The featured bands page should show:

* Band name
* Genre
* Description
* Band photo
* YouTube video embed or link
* Facebook, Instagram, or TikTok links

### Promos

The promos page should show:

* Active promos
* Promo title
* Promo price
* Original price
* Promo description
* Promo image
* Promo validity

Expired or inactive promos should not be displayed publicly.

### Contact

The contact page should show:

* Contact number
* Facebook page link
* Address
* Google Maps link or embed
* Business hours
* Booking instructions
* Book Now or Message on Facebook button

## Payload Collections

Create Payload CMS collections for:

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

Create Payload CMS globals for:

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

## Deployment Target

The project will be deployed to Vercel.

Database will use Neon PostgreSQL.

Media and image uploads will use Vercel Blob.

## Development Requirement

Build clean, maintainable, production-ready code.

Use reusable components.

Use responsive design.

Use Payload CMS for content management.

Do not build a separate custom admin dashboard for Phase 1.
