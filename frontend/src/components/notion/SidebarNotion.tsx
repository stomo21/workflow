import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react"

export interface SidebarNotionItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  children?: SidebarNotionItem[]
  active?: boolean
}

export interface SidebarNotionProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: SidebarNotionItem[]
  defaultCollapsed?: boolean
  header?: React.ReactNode
  footer?: React.ReactNode
}

const SidebarNotionItemComponent: React.FC<{
  item: SidebarNotionItem
  depth?: number
  onItemClick?: (item: SidebarNotionItem) => void
}> = ({ item, depth = 0, onItemClick }) => {
  const [isOpen, setIsOpen] = React.useState(item.children?.some(child => child.active) || false)
  const hasChildren = item.children && item.children.length > 0

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) {
            setIsOpen(!isOpen)
          }
          onItemClick?.(item)
        }}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors group",
          item.active
            ? "bg-gray-200 text-gray-900 font-medium"
            : "text-gray-700 hover:bg-gray-100",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren && (
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 text-gray-500 transition-transform duration-200 flex-shrink-0",
              isOpen && "rotate-90"
            )}
          />
        )}
        {item.icon && (
          <span className="flex-shrink-0 text-base">
            {React.isValidElement(item.icon) ? item.icon : <span>{item.icon}</span>}
          </span>
        )}
        <span className="truncate flex-1 text-left">{item.label}</span>
      </button>
      {hasChildren && isOpen && (
        <div className="mt-0.5">
          {item.children!.map((child) => (
            <SidebarNotionItemComponent
              key={child.id}
              item={child}
              depth={depth + 1}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const SidebarNotion = React.forwardRef<HTMLDivElement, SidebarNotionProps>(
  ({ className, items = [], defaultCollapsed = false, header, footer, ...props }, ref) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col h-full bg-gray-50 border-r border-gray-200 transition-all duration-200",
          isCollapsed ? "w-12" : "w-64",
          className
        )}
        {...props}
      >
        {/* Collapse Toggle */}
        <div className="flex items-center justify-between p-2 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex-1">
              {header || <span className="text-sm font-semibold text-gray-900 px-2">Workspace</span>}
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* Search */}
            <div className="p-2 border-b border-gray-200">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white border border-gray-200 text-gray-500 hover:border-gray-300 transition-colors cursor-pointer">
                <Search className="h-4 w-4" />
                <span className="text-sm">Search</span>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {items.map((item) => (
                <SidebarNotionItemComponent key={item.id} item={item} />
              ))}
            </div>

            {/* Footer / New Page */}
            <div className="p-2 border-t border-gray-200">
              {footer || (
                <button className="flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>New Page</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    )
  }
)
SidebarNotion.displayName = "SidebarNotion"

export { SidebarNotion }
