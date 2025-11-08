import { useState, useEffect, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { ColumnSelector } from '@/components/table/ColumnSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EntityConfig, FilterState, FilterAggregation } from '@/types/entity-config';
import { apiClient } from '@/lib/api-client';

interface EntityPageProps<T> {
  config: EntityConfig<T>;
  onCreateClick?: () => void;
  createButtonLabel?: string;
  headerActions?: ReactNode;
}

export function EntityPage<T extends { id: string }>({
  config,
  onCreateClick,
  createButtonLabel = 'Create',
  headerActions,
}: EntityPageProps<T>) {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    // Initialize with all columns visible
    return config.columns
      .filter((col) => col.id || (col as any).accessorKey)
      .map((col) => col.id || String((col as any).accessorKey));
  });

  // Filter columns based on visibility
  const displayedColumns = useMemo(() => {
    return config.columns.filter((col) => {
      const id = col.id || String((col as any).accessorKey);
      return visibleColumns.includes(id);
    });
  }, [config.columns, visibleColumns]);

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
          // Send as comma-separated string for arrays
          params[`filters[${key}]`] = selectedFilters[key].join(',');
        }
      });

      const response = await apiClient.get(`/${config.apiPath}`, { params });
      return response.data;
    },
  });

  const handleRowClick = (row: T) => {
    navigate(`/${config.apiPath}/${row.id}`);
  };

  const handleFilterChange = (filters: FilterState) => {
    setSelectedFilters(filters);
    setPage(1); // Reset to first page when filters change
  };

  const hasFilters = config.filters && config.filters.length > 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{config.entityLabel}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and organize your {config.entityLabel.toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {headerActions}
          {onCreateClick && (
            <Button onClick={onCreateClick} className="notion-button notion-button-primary">
              <Plus className="h-4 w-4" />
              {createButtonLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Filters Sidebar */}
        {hasFilters && (
          <div className="lg:col-span-1">
            <div className="notion-card p-4">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Filters</h3>
              <FilterPanel
                filters={config.filters || []}
                filterAggregations={filterAggregations}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={hasFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <div className="notion-card">
            {/* Table Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="text-sm text-muted-foreground">
                {data?.total || 0} {config.entityLabel.toLowerCase()}
              </div>
              <ColumnSelector
                columns={config.columns}
                visibleColumns={visibleColumns}
                onVisibilityChange={setVisibleColumns}
              />
            </div>

            <div className="p-4">
              <DataTable
                columns={displayedColumns}
                data={data?.data || []}
                searchable={!!config.searchFields}
                searchPlaceholder={
                  config.searchPlaceholder || `Search ${config.entityLabel.toLowerCase()}...`
                }
                pageSize={pageSize}
                onRowClick={handleRowClick}
              />

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {data.totalPages}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="notion-button notion-button-ghost"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= data.totalPages}
                      className="notion-button notion-button-ghost"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
