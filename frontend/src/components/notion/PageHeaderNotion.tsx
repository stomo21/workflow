import * as React from "react"
import { cn } from "@/lib/utils"
import { MoreHorizontal, Star } from "lucide-react"

export interface PageHeaderNotionProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  editable?: boolean
  onTitleChange?: (title: string) => void
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
}

const PageHeaderNotion = React.forwardRef<HTMLDivElement, PageHeaderNotionProps>(
  ({
    className,
    icon,
    title,
    editable = false,
    onTitleChange,
    breadcrumbs,
    actions,
    ...props
  }, ref) => {
    const [isEditing, setIsEditing] = React.useState(false)
    const [localTitle, setLocalTitle] = React.useState(title)

    const handleTitleSubmit = () => {
      setIsEditing(false)
      if (onTitleChange && localTitle !== title) {
        onTitleChange(localTitle)
      }
    }

    return (
      <div ref={ref} className={cn("space-y-1", className)} {...props}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500 px-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-gray-700 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-3 px-2 py-3">
          {/* Icon */}
          {icon && (
            <div className="flex-shrink-0 text-4xl leading-none mt-1">
              {React.isValidElement(icon) ? icon : <span>{icon}</span>}
            </div>
          )}

          {/* Title */}
          <div className="flex-1 min-w-0">
            {isEditing && editable ? (
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSubmit()
                  if (e.key === "Escape") {
                    setLocalTitle(title)
                    setIsEditing(false)
                  }
                }}
                className="w-full text-4xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0"
                autoFocus
              />
            ) : (
              <h1
                className={cn(
                  "text-4xl font-bold text-gray-900 break-words",
                  editable && "cursor-text hover:bg-gray-50 rounded px-1 -ml-1 transition-colors"
                )}
                onClick={() => editable && setIsEditing(true)}
              >
                {title}
              </h1>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {actions}
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors">
              <Star className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }
)
PageHeaderNotion.displayName = "PageHeaderNotion"

export { PageHeaderNotion }
