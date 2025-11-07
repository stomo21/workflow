import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { EntityConfig } from '@/types/entity-config';

export interface Permission {
  id: string;
  name: string;
  description?: string;
  action: string;
  resource: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles?: any[];
}

export const permissionsConfig: EntityConfig<Permission> = {
  entityName: 'permission',
  entityLabel: 'Permissions',
  apiPath: 'permissions',

  columns: [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          {row.getValue('action')}
        </Badge>
      ),
    },
    {
      accessorKey: 'resource',
      header: 'Resource',
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-purple-100 text-purple-800">
          {row.getValue('resource')}
        </Badge>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="max-w-md truncate text-sm text-muted-foreground">
          {row.getValue('description') || '—'}
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('isActive') ? 'default' : 'secondary'}>
          {row.getValue('isActive') ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ],

  filters: [
    {
      field: 'action',
      label: 'Action',
      type: 'multiselect',
    },
    {
      field: 'resource',
      label: 'Resource',
      type: 'multiselect',
    },
    {
      field: 'isActive',
      label: 'Status',
      type: 'multiselect',
    },
  ],

  searchFields: ['name', 'description', 'action', 'resource'],
  searchPlaceholder: 'Search permissions...',

  detailRelations: ['roles'],
};
