import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { BadgeNotion } from '@/components/notion';
import { EntityConfig } from '@/types/entity-config';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  groups?: any[];
  roles?: any[];
}

export const usersConfig: EntityConfig<User> = {
  entityName: 'user',
  entityLabel: 'Users',
  apiPath: 'users',

  columns: [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
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

  searchFields: ['email', 'firstName', 'lastName'],
  searchPlaceholder: 'Search by email or name...',

  detailRelations: ['groups', 'roles', 'roles.permissions'],
};
