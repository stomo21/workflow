import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Plus,
  MoreHorizontal,
  ArrowUpDown,
  Filter,
  Calendar,
  User,
  Tag,
  CheckSquare
} from "lucide-react"

export type DatabaseNotionColumnType = "text" | "number" | "select" | "multiselect" | "date" | "person" | "checkbox"

export interface DatabaseNotionColumn {
  id: string
  name: string
  type: DatabaseNotionColumnType
  width?: number
}

export interface DatabaseNotionRow {
  id: string
  [key: string]: any
}

export interface DatabaseNotionProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: DatabaseNotionColumn[]
  data: DatabaseNotionRow[]
  title?: string
  onAddRow?: () => void
  onRowClick?: (row: DatabaseNotionRow) => void
  onCellEdit?: (rowId: string, columnId: string, value: any) => void
}

const columnTypeIcons: Record<DatabaseNotionColumnType, React.ComponentType<{ className?: string }>> = {
  text: () => <span className="text-xs">Aa</span>,
  number: () => <span className="text-xs">#</span>,
  select: Tag,
  multiselect: Tag,
  date: Calendar,
  person: User,
  checkbox: CheckSquare,
}

const DatabaseNotion = React.forwardRef<HTMLDivElement, DatabaseNotionProps>(
  ({ className, columns, data, title, onAddRow, onRowClick, onCellEdit, ...props }, ref) => {
    const renderCellValue = (value: any, type: DatabaseNotionColumnType) => {
      if (value === null || value === undefined) {
        return <span className="text-gray-400">Empty</span>
      }

      switch (type) {
        case "checkbox":
          return (
            <input
              type="checkbox"
              checked={!!value}
              className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              readOnly
            />
          )
        case "select":
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {value}
            </span>
          )
        case "multiselect":
          return (
            <div className="flex flex-wrap gap-1">
              {Array.isArray(value) ? value.map((v, i) => (
                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  {v}
                </span>
              )) : null}
            </div>
          )
        case "person":
          return (
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                {value.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm">{value}</span>
            </div>
          )
        case "date":
          return <span className="text-sm text-gray-700">{new Date(value).toLocaleDateString()}</span>
        default:
          return <span className="text-sm text-gray-700">{String(value)}</span>
      }
    }

    return (
      <div ref={ref} className={cn("bg-white rounded-lg border border-gray-200", className)} {...props}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-gray-600 hover:bg-gray-100 transition-colors">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>
              <button className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-gray-600 hover:bg-gray-100 transition-colors">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort
              </button>
            </div>
          </div>
          <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {columns.map((column) => {
                  const Icon = columnTypeIcons[column.type]
                  return (
                    <th
                      key={column.id}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-600 bg-gray-50"
                      style={{ width: column.width }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-gray-400" />
                        <span>{column.name}</span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={column.id} className="px-4 py-3">
                      {renderCellValue(row[column.id], column.type)}
                    </td>
                  ))}
                </tr>
              ))}
              {/* New Row Button */}
              <tr>
                <td colSpan={columns.length} className="px-4 py-2">
                  <button
                    onClick={onAddRow}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 w-full px-2 py-1.5 rounded transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    New
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
)
DatabaseNotion.displayName = "DatabaseNotion"

export { DatabaseNotion }
