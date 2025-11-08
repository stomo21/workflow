import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputNotionProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  fullWidth?: boolean
}

const InputNotion = React.forwardRef<HTMLInputElement, InputNotionProps>(
  ({ className, type, icon, fullWidth = false, ...props }, ref) => {
    return (
      <div className={cn("relative inline-flex items-center", fullWidth && "w-full")}>
        {icon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 transition-all duration-100",
            "hover:border-gray-300",
            "focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            icon && "pl-10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
InputNotion.displayName = "InputNotion"

export { InputNotion }
