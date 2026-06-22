import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CalendarDays,
  CircleAlert,
  CircleCheckBig,
  CircleOff,
  CircleX,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
  MessageSquareMore,
} from 'lucide-react'

import { BookNowButton } from '@/components/site/book-now-button'
import { EmptyState } from '@/components/site/empty-state'
import { PageHeading } from '@/components/site/page-heading'
import { PageShell } from '@/components/site/page-shell'
import { SectionContainer } from '@/components/site/section-container'
import { Button } from '@/components/ui/button'
import { buildPageMetadata } from '@/lib/seo'
import {
  getContactInfoData,
  getScheduleBrowseData,
  getSiteSettingsData,
} from '@/lib/site-data'
import {
  cn,
  getCurrentStudioDateKey,
  getPrimaryCtaHref,
  isExternalUrl,
  normalizeDateKey,
} from '@/lib/utils'
import type {
  ScheduleDateOption,
  ScheduleDayStatus,
  ScheduleSlotItem,
  ScheduleSlotStatus,
} from '@/types/content'

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, contactInfo] = await Promise.all([getSiteSettingsData(), getContactInfoData()])

  return buildPageMetadata({
    contactInfo,
    description: 'Browse today, previous days, and upcoming days to check Sixram Band Studio schedule availability before booking.',
    ogPage: 'schedule',
    path: '/schedule',
    siteSettings,
    title: 'Schedule',
  })
}

const dayStatusStyles: Record<ScheduleDayStatus, string> = {
  open: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
  limited: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
  'fully-booked': 'border-primary/35 bg-primary/10 text-primary-foreground',
  closed: 'border-white/12 bg-white/6 text-white/72',
}

const slotToneStyles: Record<ScheduleSlotStatus, string> = {
  available: 'text-emerald-300',
  reserved: 'text-amber-200',
  blocked: 'text-white/60',
  'fully-booked': 'text-primary',
}

const slotIcons: Record<ScheduleSlotStatus, LucideIcon> = {
  available: CircleCheckBig,
  reserved: CircleAlert,
  blocked: CircleOff,
  'fully-booked': CircleX,
}

function getScheduleHref(dateKey: string, todayKey: string) {
  return dateKey === todayKey ? '/schedule' : `/schedule?date=${dateKey}`
}

function ScheduleDateCard({
  activeDateKey,
  date,
  todayKey,
}: {
  activeDateKey: string
  date: ScheduleDateOption
  todayKey: string
}) {
  const isActive = date.dateKey === activeDateKey

  return (
    <Link
      className={cn(
        'rounded-[1.35rem] border p-4 transition',
        isActive
          ? 'border-primary/35 bg-primary/12 shadow-[0_24px_70px_-50px_rgba(209,31,42,0.8)]'
          : 'border-white/8 bg-black/18 hover:border-white/16 hover:bg-white/[0.03]',
      )}
      href={getScheduleHref(date.dateKey, todayKey)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">
            {date.weekdayLabel}
          </p>
          <p className="mt-2 text-lg font-semibold text-white">{date.shortDateLabel}</p>
        </div>
        {date.isToday ? (
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-primary">
            Today
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-xs leading-5 text-white/72">
        {date.hasSchedule ? date.dayStatusLabel : 'No schedule posted'}
      </p>
    </Link>
  )
}

function ScheduleSlotRow({ slot }: { slot: ScheduleSlotItem }) {
  const SlotIcon = slotIcons[slot.status]

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-white/8 px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <SlotIcon className={cn('size-5 shrink-0', slotToneStyles[slot.status])} />
        <p className="truncate text-sm font-medium text-white sm:text-base">{slot.timeLabel}</p>
      </div>

      <div className="min-w-0 justify-self-end text-right">
        <p
          className={cn(
            'text-sm font-semibold sm:text-base',
            slot.hasVisibleBandName ? 'text-white' : slotToneStyles[slot.status],
          )}
        >
          {slot.label}
        </p>
      </div>
    </li>
  )
}

type SchedulePageProps = {
  searchParams?: Promise<{
    date?: string | string[] | undefined
  }>
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const requestedDate = Array.isArray(resolvedSearchParams?.date)
    ? resolvedSearchParams?.date[0]
    : resolvedSearchParams?.date
  const activeDateKey = normalizeDateKey(requestedDate) || getCurrentStudioDateKey()
  const todayKey = getCurrentStudioDateKey()

  const [scheduleBrowse, siteSettings, contactInfo] = await Promise.all([
    getScheduleBrowseData(activeDateKey),
    getSiteSettingsData(),
    getContactInfoData(),
  ])

  const ctaHref = getPrimaryCtaHref(siteSettings.mainCtaLink)

  return (
    <PageShell>
      <SectionContainer className="space-y-8">
        <PageHeading
          actions={<BookNowButton href={ctaHref} label={siteSettings.mainCtaText} />}
          description="Move through previous and upcoming days to check posted studio availability before messaging to reserve."
          eyebrow="Public Page"
          title="Schedule"
        />

        <div className="space-y-4 rounded-[2rem] border border-white/8 bg-card/70 p-5 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.88)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button asChild variant="outline">
              <Link href={getScheduleHref(scheduleBrowse.previousDateKey, todayKey)}>
                <ChevronLeft className="size-4" />
                Previous Day
              </Link>
            </Button>

            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Viewing
              </p>
              <p className="mt-1 text-base font-medium text-white">{scheduleBrowse.activeDisplayDate}</p>
            </div>

            <Button asChild variant="outline">
              <Link href={getScheduleHref(scheduleBrowse.nextDateKey, todayKey)}>
                Next Day
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
            {scheduleBrowse.visibleDates.map((date) => (
              <ScheduleDateCard
                activeDateKey={scheduleBrowse.activeDateKey}
                date={date}
                key={date.dateKey}
                todayKey={todayKey}
              />
            ))}
          </div>
        </div>

        {scheduleBrowse.schedule ? (
          <div className="space-y-6 rounded-[2rem] border border-white/8 bg-card/85 p-5 shadow-[0_32px_90px_-56px_rgba(0,0,0,0.88)] lg:p-7">
            <div className="flex flex-col gap-4 rounded-[1.6rem] border border-primary/20 bg-gradient-to-r from-primary/18 via-black/45 to-black/75 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-[1rem] border border-white/10 bg-black/35 text-primary">
                  <CalendarDays className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    Selected Day
                  </p>
                  <p className="font-display text-3xl uppercase tracking-[0.08em] text-white sm:text-4xl">
                    {scheduleBrowse.schedule.displayDate}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  'inline-flex w-fit rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em]',
                  dayStatusStyles[scheduleBrowse.schedule.dayStatus],
                )}
              >
                {scheduleBrowse.schedule.dayStatusLabel}
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/22">
              <ul>
                {scheduleBrowse.schedule.slots.map((slot) => (
                  <ScheduleSlotRow key={slot.id} slot={slot} />
                ))}
              </ul>
            </div>

            <div className="rounded-[1.45rem] border border-primary/20 bg-black/25 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                  <MessageSquareMore className="size-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                    Booking Note
                  </p>
                  <p className="text-sm leading-7 text-white/78">
                    {scheduleBrowse.schedule.publicNote ||
                      'By reservation only. No walk-ins. Schedule is subject to availability.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <BookNowButton href={ctaHref} label={siteSettings.mainCtaText} size="lg" />
              {contactInfo.facebookPage ? (
                <Button asChild size="lg" variant="outline">
                  <Link
                    href={contactInfo.facebookPage}
                    rel={isExternalUrl(contactInfo.facebookPage) ? 'noreferrer' : undefined}
                    target={isExternalUrl(contactInfo.facebookPage) ? '_blank' : undefined}
                  >
                    Message on Facebook
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <EmptyState
            action={<BookNowButton href={ctaHref} label={siteSettings.mainCtaText} />}
            description={`There is no published schedule for ${scheduleBrowse.activeDisplayDate} yet. Try the next few days above or message the studio directly and we'll confirm availability for your preferred slot.`}
            title="No posted schedule for this day"
          />
        )}
      </SectionContainer>
    </PageShell>
  )
}
