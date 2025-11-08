import * as React from "react"
import { cn } from "@/lib/utils"

export interface PropertyNotionProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  icon?: React.ReactNode
  required?: boolean
}

const PropertyNotion = React.forwardRef<HTMLDivElement, PropertyNotionProps>(
  ({ className, label, icon, required, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-start gap-3 py-2", className)}
        {...props}
      >
        <div className="flex items-center gap-2 min-w-[140px] text-sm text-gray-600">
          {icon && (
            <span className="flex-shrink-0 text-gray-400">
              {icon}
            </span>
          )}
          <span className="font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    )
  }
)
PropertyNotion.displayName = "PropertyNotion"

export { PropertyNotion }
