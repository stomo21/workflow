import { useState, useEffect, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Columns, RefreshCw, Download } from 'lucide-react';
import {
  ButtonNotion,
  InputNotion,
  SelectNotion,
  SelectNotionContent,
  SelectNotionItem,
  SelectNotionTrigger,
  SelectNotionValue,
  DatabaseNotion,
  DatabaseNotionColumn,
  DatabaseNotionRow,
  PageHeaderNotion,
  CalloutNotion,
  BadgeNotion,
  ToggleNotion,
} from '@/components/notion';
import { EntityConfig, FilterState, FilterAggregation } from '@/types/entity-config';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface EntityPageNotionProps<T> {
  config: EntityConfig<T>;
  onCreateClick?: () => void;
  createButtonLabel?: string;
  headerActions?: ReactNode;
  icon?: React.ReactNode;
}

export function EntityPageNotion<T extends { id: string }>({
  config,
  onCreateClick,
  createButtonLabel = 'Create',
  headerActions,
  icon,
}: EntityPageNotionProps<T>) {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showFilters, setShowFilters] = useState(true);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    return config.columns
      .filter((col) => col.id || (col as any).accessorKey)
      .map((col) => col.id || String((col as any).accessorKey));
  });

  // Fetch filter aggregations
  const { data: filterAggregations = [] } = useQuery<FilterAggregation[]>({
    queryKey: [`${config.apiPath}-filters`],
    queryFn: async () => {
      if (!config.filters || config.filters.length === 0) {
        return [];
      }
      const fields = config.filters.map((f) => f.field).join(',');
      const response = await apiClient.get(
        `/${config.apiPath}/filters/aggregations?fields=${fields}`
      );
      return response.data;
    },
    enabled: !!config.filters && config.filters.length > 0,
  });

  // Fetch entity data
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      config.apiPath,
      page,
      pageSize,
      searchQuery,
      selectedFilters,
    ],
    queryFn: async () => {
      const params: any = {
        page,
        limit: pageSize,
      };

      if (searchQuery && config.searchFields) {
        params.search = searchQuery;
        params.searchFields = config.searchFields.join(',');
      }

      // Add filters to params
      Object.keys(selectedFilters).forEach((key) => {
        if (selectedFilters[key] && selectedFilters[key].length > 0) {
          params[`filters[${key}]`] = selectedFilters[key].join(',');
        }
      });

      const response = await apiClient.get(`/${config.apiPath}`, { params });
      return response.data;
    },
  });

  // Convert table columns to database columns
  const databaseColumns: DatabaseNotionColumn[] = useMemo(() => {
    return config.columns
      .filter((col) => {
        const id = col.id || String((col as any).accessorKey);
        return visibleColumns.includes(id);
      })
      .map((col) => {
        const id = col.id || String((col as any).accessorKey);
        const header = typeof col.header === 'string' ? col.header : String(id);

        // Infer column type from accessorKey or id
        let type: DatabaseNotionColumn['type'] = 'text';
        if (id.includes('date') || id.includes('Date')) type = 'date';
        if (id.includes('status') || id.includes('Status')) type = 'select';
        if (id.includes('active') || id.includes('Active')) type = 'checkbox';

        return {
          id,
          name: header,
          type,
        };
      });
  }, [config.columns, visibleColumns]);

  // Convert data to database rows
  const databaseRows: DatabaseNotionRow[] = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((item: any) => {
      const row: DatabaseNotionRow = { id: item.id };
      config.columns.forEach((col) => {
        const id = col.id || String((col as any).accessorKey);
        const accessor = (col as any).accessorKey;
        row[id] = accessor ? item[accessor] : item[id];
      });
      return row;
    });
  }, [data?.data, config.columns]);

  const handleRowClick = (row: DatabaseNotionRow) => {
    navigate(`/${config.apiPath}/${row.id}`);
  };

  const handleFilterChange = (field: string, values: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [field]: values,
    }));
    setPage(1);
  };

  const hasFilters = config.filters && config.filters.length > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeaderNotion
        icon={icon || '📋'}
        title={config.entityLabel}
        actions={
          <div className="flex items-center gap-2">
            <ButtonNotion
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </ButtonNotion>
            {headerActions}
            {onCreateClick && (
              <ButtonNotion variant="primary" onClick={onCreateClick}>
                <Plus className="h-4 w-4" />
                {createButtonLabel}
              </ButtonNotion>
            )}
          </div>
        }
      />

      {/* Search and Filters Bar */}
      <div className="flex items-center gap-3">
        {config.searchFields && (
          <div className="flex-1 max-w-md">
            <InputNotion
              icon={<Search className="h-4 w-4" />}
              placeholder={config.searchPlaceholder || `Search ${config.entityLabel.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              fullWidth
            />
          </div>
        )}

        {hasFilters && (
          <ButtonNotion
            variant={showFilters ? 'subtle' : 'ghost'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {Object.values(selectedFilters).flat().length > 0 && (
              <BadgeNotion variant="blue" className="ml-1">
                {Object.values(selectedFilters).flat().length}
              </BadgeNotion>
            )}
          </ButtonNotion>
        )}

        <ButtonNotion variant="ghost" size="sm">
          <Columns className="h-4 w-4" />
          Columns
        </ButtonNotion>

        <ButtonNotion variant="ghost" size="sm">
          <Download className="h-4 w-4" />
          Export
        </ButtonNotion>
      </div>

      {/* Filters Panel */}
      {hasFilters && showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Active Filters</h3>
            {Object.values(selectedFilters).flat().length > 0 && (
              <ButtonNotion
                variant="link"
                size="sm"
                onClick={() => setSelectedFilters({})}
              >
                Clear all
              </ButtonNotion>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {config.filters?.map((filter) => {
              const aggregation = filterAggregations.find(
                (agg) => agg.field === filter.field
              );
              const options = aggregation?.values || [];

              return (
                <div key={filter.field} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {filter.label}
                  </label>
                  {filter.type === 'multiselect' && (
                    <div className="space-y-1">
                      {options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={
                              selectedFilters[filter.field]?.includes(
                                String(option.value)
                              ) || false
                            }
                            onChange={(e) => {
                              const current = selectedFilters[filter.field] || [];
                              const newValues = e.target.checked
                                ? [...current, String(option.value)]
                                : current.filter((v) => v !== String(option.value));
                              handleFilterChange(filter.field, newValues);
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {String(option.value)}
                          </span>
                          <span className="text-xs text-gray-500 ml-auto">
                            ({option.count})
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          <span className="font-semibold text-gray-900">{data?.total || 0}</span>{' '}
          {config.entityLabel.toLowerCase()}
        </span>
        {Object.values(selectedFilters).flat().length > 0 && (
          <span className="text-gray-500">
            (filtered from {data?.total || 0} total)
          </span>
        )}
      </div>

      {/* Database Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
            <p className="text-sm text-gray-600">Loading {config.entityLabel.toLowerCase()}...</p>
          </div>
        </div>
      ) : data?.data?.length === 0 ? (
        <CalloutNotion variant="info" title="No results found">
          {searchQuery || Object.values(selectedFilters).flat().length > 0
            ? 'Try adjusting your search or filters'
            : `No ${config.entityLabel.toLowerCase()} have been created yet.`}
        </CalloutNotion>
      ) : (
        <DatabaseNotion
          columns={databaseColumns}
          data={databaseRows}
          onRowClick={handleRowClick}
          onAddRow={onCreateClick}
        />
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {page} of {data.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <ButtonNotion
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </ButtonNotion>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <ButtonNotion
                    key={pageNum}
                    variant={page === pageNum ? 'subtle' : 'ghost'}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </ButtonNotion>
                );
              })}
            </div>
            <ButtonNotion
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.totalPages}
            >
              Next
            </ButtonNotion>
          </div>
        </div>
      )}
    </div>
  );
}
