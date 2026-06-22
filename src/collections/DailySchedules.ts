import type {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
} from 'payload'

import { publicReadPublishedDailySchedules } from '@/access'
import {
  getTimeValueInMinutes,
  normalizeDateKey,
  normalizeScheduleTimeInput,
} from '@/lib/utils'

const defaultPublicNote =
  'By reservation only. No walk-ins. Schedule is subject to availability.'

type MutableScheduleSlot = {
  internalClientName?: string | null
  publicDisplayName?: string | null
  showPublicName?: boolean | null
  status?: string | null
  [key: string]: unknown
}

function normalizeOptionalText(value: string | null | undefined) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : null
}

const beforeValidateSchedule: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (!data) {
    return data
  }

  const sourceDate = normalizeDateKey(
    (data as { scheduleDate?: string | null }).scheduleDate ?? originalDoc?.scheduleDate,
  )

  if (sourceDate) {
    ;(data as { scheduleDateKey?: string }).scheduleDateKey = sourceDate
  }

  if (Array.isArray((data as { timeSlots?: unknown[] }).timeSlots)) {
    ;(data as { timeSlots: MutableScheduleSlot[] }).timeSlots = (
      data as { timeSlots: MutableScheduleSlot[] }
    ).timeSlots.map((slot) => {
      const startTime = normalizeScheduleTimeInput(slot.startTime as string | null)
      const endTime = normalizeScheduleTimeInput(slot.endTime as string | null)

      if (slot.status !== 'reserved') {
        return {
          ...slot,
          endTime,
          internalClientName: undefined,
          publicDisplayName: undefined,
          showPublicName: false,
          startTime,
        }
      }

      return {
        ...slot,
        endTime,
        internalClientName: normalizeOptionalText(slot.internalClientName as string | null),
        publicDisplayName: normalizeOptionalText(slot.publicDisplayName as string | null),
        showPublicName: Boolean(slot.showPublicName),
        startTime,
      }
    })
  }

  return data
}

const sanitizeScheduleForPublic: CollectionAfterReadHook = ({ doc, req }) => {
  if (req.user || !Array.isArray(doc.timeSlots)) {
    return doc
  }

  return {
    ...doc,
    timeSlots: doc.timeSlots.map((slot: MutableScheduleSlot) => {
      const publicDisplayName =
        slot.status === 'reserved'
          ? slot.showPublicName
            ? normalizeOptionalText(slot.publicDisplayName)
            : normalizeOptionalText(slot.internalClientName)
          : null

      return {
        ...slot,
        internalClientName: undefined,
        publicDisplayName,
        showPublicName: undefined,
      }
    }),
  }
}

export const DailySchedules: CollectionConfig = {
  slug: 'daily-schedules',
  access: {
    read: publicReadPublishedDailySchedules,
  },
  admin: {
    defaultColumns: ['scheduleDate', 'dayStatus', 'isPublished', 'updatedAt'],
    group: 'Content',
    useAsTitle: 'scheduleDateKey',
  },
  hooks: {
    afterRead: [sanitizeScheduleForPublic],
    beforeValidate: [beforeValidateSchedule],
  },
  labels: {
    plural: 'Daily Schedules',
    singular: 'Daily Schedule',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Schedule Details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'scheduleDate',
                  label: 'Schedule Date',
                  type: 'date',
                  required: true,
                  admin: {
                    date: {
                      pickerAppearance: 'dayOnly',
                    },
                    description: 'Choose the calendar day this public schedule applies to.',
                  },
                },
                {
                  name: 'dayStatus',
                  label: 'Day Status',
                  type: 'select',
                  defaultValue: 'open',
                  options: [
                    { label: 'Open Today', value: 'open' },
                    { label: 'Limited Availability', value: 'limited' },
                    { label: 'Fully Booked', value: 'fully-booked' },
                    { label: 'Closed Today', value: 'closed' },
                  ],
                  required: true,
                  admin: {
                    description: 'Top-level status banner shown on the public schedule page.',
                  },
                },
              ],
            },
            {
              name: 'scheduleDateKey',
              label: 'Schedule Date Key',
              type: 'text',
              unique: true,
              admin: {
                description:
                  'Automatically generated from Schedule Date to keep one record per day.',
                readOnly: true,
              },
            },
            {
              name: 'publicNote',
              label: 'Public Note',
              type: 'textarea',
              defaultValue: defaultPublicNote,
              admin: {
                description: 'Short public note shown under the schedule list.',
              },
            },
            {
              name: 'isPublished',
              label: 'Published',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Only published daily schedules can appear on the public website.',
              },
            },
          ],
        },
        {
          label: 'Time Slots',
          fields: [
            {
              name: 'timeSlots',
              label: 'Time Slots',
              type: 'array',
              labels: {
                plural: 'Time Slots',
                singular: 'Time Slot',
              },
              minRows: 1,
              required: true,
              admin: {
                description:
                  'Use 12-hour time in h:mm AM/PM format. Named reservations can optionally show an approved public display name.',
                initCollapsed: false,
              },
              validate: (value) => {
                if (!Array.isArray(value) || !value.length) {
                  return 'Add at least one time slot for the current day.'
                }

                const parsedSlots: Array<{ end: number; start: number }> = []

                for (const slot of value as Array<{
                  endTime?: string | null
                  startTime?: string | null
                }>) {
                  const start = getTimeValueInMinutes(slot?.startTime)
                  const end = getTimeValueInMinutes(slot?.endTime)

                  if (start === null || end === null) {
                    return 'Each slot needs a valid start and end time in 12-hour format, such as 1:00 PM.'
                  }

                  if (end <= start) {
                    return 'Each slot end time must be later than its start time.'
                  }

                  parsedSlots.push({ end, start })
                }

                parsedSlots.sort((left, right) => left.start - right.start)

                for (let index = 1; index < parsedSlots.length; index += 1) {
                  if (parsedSlots[index].start < parsedSlots[index - 1].end) {
                    return 'Time slots cannot overlap. Adjust the slot ranges and try again.'
                  }
                }

                return true
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'startTime',
                      label: 'Start Time',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: '1:00 PM',
                      },
                      validate: (value: string | null | undefined) =>
                        getTimeValueInMinutes(value) !== null
                          ? true
                          : 'Use a valid 12-hour time such as 1:00 PM.',
                    },
                    {
                      name: 'endTime',
                      label: 'End Time',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: '3:00 PM',
                      },
                      validate: (value: string | null | undefined) =>
                        getTimeValueInMinutes(value) !== null
                          ? true
                          : 'Use a valid 12-hour time such as 3:00 PM.',
                    },
                    {
                      name: 'status',
                      label: 'Status',
                      type: 'select',
                      defaultValue: 'available',
                      options: [
                        { label: 'Available', value: 'available' },
                        { label: 'Reserved', value: 'reserved' },
                        { label: 'Blocked', value: 'blocked' },
                        { label: 'Fully Booked', value: 'fully-booked' },
                      ],
                      required: true,
                    },
                  ],
                },
                {
                  name: 'internalClientName',
                  label: 'Internal Band / Client Name',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.status === 'reserved',
                    description:
                      'Primary band or client name for the reserved slot. This appears on the public schedule page unless you enable a separate Public Display Name override.',
                    placeholder: 'Midnight Echoes',
                  },
                },
                {
                  name: 'publicDisplayName',
                  label: 'Public Display Name',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.status === 'reserved',
                    description:
                      'Optional alternate name shown publicly when the override toggle is enabled.',
                    placeholder: 'Midnight Echoes',
                  },
                  validate: (
                    value: string | null | undefined,
                    { siblingData }: { siblingData?: { showPublicName?: boolean | null } },
                  ) => {
                    if (!siblingData?.showPublicName) {
                      return true
                    }

                    return normalizeOptionalText(value)
                      ? true
                      : 'Add a public display name before enabling public name visibility.'
                  },
                },
                {
                  name: 'showPublicName',
                  label: 'Show Public Display Name',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    condition: (_, siblingData) => siblingData?.status === 'reserved',
                    description:
                      'Use Public Display Name on the website instead of the primary band or client name.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
