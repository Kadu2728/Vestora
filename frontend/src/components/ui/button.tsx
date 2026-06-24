import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-accent)] text-white shadow-[0_0_0_1px_rgba(99,102,241,0.4)] hover:shadow-[var(--shadow-glow)] hover:brightness-110",
        secondary:
          "bg-[var(--color-surface-2)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface)]",
        ghost:
          "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]",
        outline:
          "border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface)]",
        danger: "bg-[var(--color-danger)] text-white hover:brightness-110",
      },
      size: {
        sm: "h-9 px-4 text-sm min-h-[36px]",
        default: "h-11 px-6 min-h-[44px]",
        lg: "h-13 px-8 text-base min-h-[52px]",
        icon: "h-11 w-11 min-h-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
