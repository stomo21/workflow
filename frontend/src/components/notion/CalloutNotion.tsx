import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, Info, Lightbulb, AlertTriangle } from "lucide-react"

export interface CalloutNotionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "success" | "error"
  icon?: React.ReactNode
  title?: string
}

const variantStyles = {
  info: {
    container: "bg-blue-50 border-blue-200",
    icon: "text-blue-500",
    title: "text-blue-900",
    content: "text-blue-800",
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200",
    icon: "text-yellow-600",
    title: "text-yellow-900",
    content: "text-yellow-800",
  },
  success: {
    container: "bg-green-50 border-green-200",
    icon: "text-green-600",
    title: "text-green-900",
    content: "text-green-800",
  },
  error: {
    container: "bg-red-50 border-red-200",
    icon: "text-red-600",
    title: "text-red-900",
    content: "text-red-800",
  },
}

const defaultIcons = {
  info: Info,
  warning: AlertTriangle,
  success: Lightbulb,
  error: AlertCircle,
}

const CalloutNotion = React.forwardRef<HTMLDivElement, CalloutNotionProps>(
  ({ className, variant = "info", icon, title, children, ...props }, ref) => {
    const styles = variantStyles[variant]
    const Icon = icon || defaultIcons[variant]

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3 rounded-md border p-4 transition-all duration-100",
          styles.container,
          className
        )}
        {...props}
      >
        <div className={cn("flex-shrink-0 mt-0.5", styles.icon)}>
          {React.isValidElement(Icon) ? Icon : <Icon className="h-5 w-5" />}
        </div>
        <div className="flex-1 space-y-1">
          {title && (
            <div className={cn("font-medium text-sm", styles.title)}>
              {title}
            </div>
          )}
          <div className={cn("text-sm", styles.content)}>
            {children}
          </div>
        </div>
      </div>
    )
  }
)
CalloutNotion.displayName = "CalloutNotion"

export { CalloutNotion }
