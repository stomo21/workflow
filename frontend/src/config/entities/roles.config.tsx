import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { BadgeNotion } from '@/components/notion';
import { EntityConfig } from '@/types/entity-config';

export interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: any[];
  users?: any[];
  groups?: any[];
}

export const rolesConfig: EntityConfig<Role> = {
  entityName: 'role',
  entityLabel: 'Roles',
  apiPath: 'roles',

  columns: [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
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
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'MMM d, yyyy'),
    },
  ],

  filters: [
    {
      field: 'isActive',
      label: 'Status',
      type: 'multiselect',
    },
  ],

  searchFields: ['name', 'description'],
  searchPlaceholder: 'Search roles...',

  detailRelations: ['permissions', 'users', 'groups'],
};
