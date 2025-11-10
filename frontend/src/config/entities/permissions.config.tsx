import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { BadgeNotion } from '@/components/notion';
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
        <BadgeNotion variant="blue">
          {row.getValue('action')}
        </BadgeNotion>
      ),
    },
    {
      accessorKey: 'resource',
      header: 'Resource',
      cell: ({ row }) => (
        <BadgeNotion variant="purple">
          {row.getValue('resource')}
        </BadgeNotion>
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
        <BadgeNotion variant={row.getValue('isActive') ? 'green' : 'default'}>
          {row.getValue('isActive') ? 'Active' : 'Inactive'}
        </BadgeNotion>
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
