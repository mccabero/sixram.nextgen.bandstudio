import type { Access, Where } from 'payload'

export const publicRead: Access = () => true

function allowAdminOrFilter(where: Where): Access {
  return ({ req }) => {
    if (req.user) {
      return true
    }

    return where
  }
}

export const publicReadActiveRates = allowAdminOrFilter({
  isActive: {
    equals: true,
  },
})

export const publicReadApprovedGallery = allowAdminOrFilter({
  approvedForPosting: {
    equals: true,
  },
})

export const publicReadActivePromos: Access = ({ req }) => {
  if (req.user) {
    return true
  }

  const now = new Date().toISOString()
  const where: Where = {
    and: [
      {
        isActive: {
          equals: true,
        },
      },
      {
        or: [
          {
            startDate: {
              equals: null,
            },
          },
          {
            startDate: {
              exists: false,
            },
          },
          {
            startDate: {
              less_than_equal: now,
            },
          },
        ],
      },
      {
        or: [
          {
            endDate: {
              equals: null,
            },
          },
          {
            endDate: {
              exists: false,
            },
          },
          {
            endDate: {
              greater_than_equal: now,
            },
          },
        ],
      },
    ],
  }

  return where
}
