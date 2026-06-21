import Image from 'next/image'

import { cn } from '@/lib/utils'

type MediaFrameProps = {
  alt: string
  className?: string
  imageClassName?: string
  priority?: boolean
  sizes?: string
  src: string
  showOverlay?: boolean
}

export function MediaFrame({
  alt,
  className,
  imageClassName,
  priority = false,
  sizes = '(min-width: 1024px) 33vw, 100vw',
  src,
  showOverlay = true,
}: MediaFrameProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/5', className)}>
      <Image
        alt={alt}
        className={cn('object-cover', imageClassName)}
        fill
        priority={priority}
        sizes={sizes}
        src={src}
      />
      {showOverlay ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      ) : null}
    </div>
  )
}
