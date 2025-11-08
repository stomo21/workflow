import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const badgeNotionVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
        green: "bg-green-100 text-green-700 hover:bg-green-200",
        yellow: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        red: "bg-red-100 text-red-700 hover:bg-red-200",
        purple: "bg-purple-100 text-purple-700 hover:bg-purple-200",
        pink: "bg-pink-100 text-pink-700 hover:bg-pink-200",
        orange: "bg-orange-100 text-orange-700 hover:bg-orange-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeNotionProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeNotionVariants> {
  onRemove?: () => void
}

const BadgeNotion = React.forwardRef<HTMLSpanElement, BadgeNotionProps>(
  ({ className, variant, onRemove, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeNotionVariants({ variant }), className)}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="ml-0.5 -mr-1 rounded-full p-0.5 hover:bg-black/10 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </span>
    )
  }
)
BadgeNotion.displayName = "BadgeNotion"

export { BadgeNotion, badgeNotionVariants }
