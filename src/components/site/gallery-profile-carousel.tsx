'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn, formatDate } from '@/lib/utils'
import type { GalleryProfileImage } from '@/types/content'

type GalleryProfileCarouselProps = {
  images: GalleryProfileImage[]
  profileName: string
}

export function GalleryProfileCarousel({
  images,
  profileName,
}: GalleryProfileCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeImage = images[activeIndex]
  const activeDate = formatDate(activeImage?.sessionDate)
  const thumbnailStrip = useMemo(
    () => images.slice(Math.max(0, activeIndex - 3), Math.max(6, activeIndex + 3)),
    [activeIndex, images],
  )

  if (!activeImage) {
    return null
  }

  function goToPreviousImage() {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  function goToNextImage() {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1))
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-white/8 bg-card/85 p-4 shadow-[0_30px_90px_-56px_rgba(0,0,0,0.88)] sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/35">
              <Image
                alt={activeImage.alt}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                src={activeImage.src}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  {profileName}
                </p>
                <p className="text-lg font-semibold text-white">{activeImage.sessionTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {activeDate || `Image ${activeIndex + 1} of ${images.length}`}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  aria-label="Previous gallery image"
                  onClick={goToPreviousImage}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  aria-label="Next gallery image"
                  onClick={goToNextImage}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Image Queue
            </p>

            <div className="grid grid-cols-3 gap-3 lg:grid-cols-2">
              {thumbnailStrip.map((image) => {
                const imageIndex = images.findIndex((entry) => entry.id === image.id)
                const isActive = image.id === activeImage.id

                return (
                  <button
                    className={cn(
                      'relative aspect-square overflow-hidden rounded-[1rem] border border-white/8 transition',
                      isActive
                        ? 'border-primary shadow-[0_18px_42px_-28px_rgba(209,31,42,0.8)]'
                        : 'hover:border-white/16',
                    )}
                    key={image.id}
                    onClick={() => setActiveIndex(imageIndex)}
                    type="button"
                  >
                    <Image
                      alt={image.alt}
                      className="object-cover"
                      fill
                      sizes="(min-width: 1024px) 12vw, 28vw"
                      src={image.src}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
