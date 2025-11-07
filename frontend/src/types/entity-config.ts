import { ColumnDef } from '@tanstack/react-table';

export interface FilterDefinition {
  field: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'text';
}

export interface EntityConfig<T> {
  // Entity metadata
  entityName: string;
  entityLabel: string;
  apiPath: string;

  // Column definitions for the table
  columns: ColumnDef<T, any>[];

  // Filter definitions
  filters?: FilterDefinition[];

  // Search configuration
  searchFields?: string[];
  searchPlaceholder?: string;

  // Relations to load for detail view
  detailRelations?: string[];
}

export interface FilterOption {
  value: any;
  label: string;
  count: number;
}

export interface FilterAggregation {
  field: string;
  options: FilterOption[];
}

export interface FilterState {
  [field: string]: any[];
}
