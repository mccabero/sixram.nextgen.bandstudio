import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-11 px-5 text-sm',
        icon: 'size-10',
        lg: 'h-12 px-6 text-base',
        sm: 'h-9 px-4 text-sm',
      },
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[0_18px_45px_-18px_rgba(209,31,42,0.7)] hover:-translate-y-0.5 hover:bg-[#e32a36]',
        ghost: 'bg-transparent text-foreground hover:bg-white/6',
        outline:
          'border border-white/12 bg-white/4 text-foreground hover:border-white/20 hover:bg-white/8',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-white/10',
      },
    },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ asChild = false, className, size, variant, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return <Comp className={cn(buttonVariants({ className, size, variant }))} {...props} />
}

export { Button, buttonVariants }
