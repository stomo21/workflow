import { useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { FilterPanel } from '@/components/filters/FilterPanel';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{config.entityLabel}</h1>
        </div>
        <div className="flex items-center gap-2">
          {headerActions}
          {onCreateClick && (
            <Button onClick={onCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              {createButtonLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {hasFilters && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <FilterPanel
                  filters={config.filters || []}
                  filterAggregations={filterAggregations}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className={hasFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <Card>
            <CardContent className="p-6">
              <DataTable
                columns={config.columns}
                data={data?.data || []}
                searchable={!!config.searchFields}
                searchPlaceholder={
                  config.searchPlaceholder || `Search ${config.entityLabel.toLowerCase()}...`
                }
                pageSize={pageSize}
                onRowClick={handleRowClick}
              />

              {/* Pagination Info */}
              {data && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((page - 1) * pageSize) + 1} to{' '}
                    {Math.min(page * pageSize, data.total)} of {data.total} results
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= data.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
