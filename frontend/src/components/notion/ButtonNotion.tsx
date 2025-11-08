import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonNotionVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-normal transition-all duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm",
        primary: "bg-blue-500 text-white hover:bg-blue-600 shadow-sm",
        ghost: "hover:bg-gray-100 text-gray-600 hover:text-gray-800",
        subtle: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
        link: "text-gray-600 hover:text-gray-800 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-3 py-1.5",
        sm: "h-7 px-2 py-1 text-xs",
        lg: "h-9 px-4 py-2",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonNotionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonNotionVariants> {
  asChild?: boolean
  loading?: boolean
}

const ButtonNotion = React.forwardRef<HTMLButtonElement, ButtonNotionProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonNotionVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
ButtonNotion.displayName = "ButtonNotion"

export { ButtonNotion, buttonNotionVariants }
