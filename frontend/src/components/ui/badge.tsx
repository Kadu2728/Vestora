import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-full)] px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/20",
        success: "bg-[var(--color-success)]/15 text-[var(--color-success)] border border-[var(--color-success)]/20",
        danger: "bg-[var(--color-danger)]/15 text-[var(--color-danger)] border border-[var(--color-danger)]/20",
        muted: "bg-[var(--color-surface-2)] text-[var(--color-muted)] border border-[var(--color-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  )
}

export { Badge, badgeVariants }
