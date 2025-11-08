import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToggleNotionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  defaultOpen?: boolean
  icon?: React.ReactNode
}

const ToggleNotion = React.forwardRef<HTMLDivElement, ToggleNotionProps>(
  ({ className, title, defaultOpen = false, icon, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    return (
      <div ref={ref} className={cn("", className)} {...props}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 transition-colors group"
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 text-gray-500 transition-transform duration-200",
              isOpen && "rotate-90"
            )}
          />
          {icon && (
            <span className="flex-shrink-0 text-gray-500">
              {icon}
            </span>
          )}
          <span className="font-normal">{title}</span>
        </button>
        {isOpen && (
          <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-3">
            {children}
          </div>
        )}
      </div>
    )
  }
)
ToggleNotion.displayName = "ToggleNotion"

export { ToggleNotion }
