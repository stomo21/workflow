import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { BadgeNotion } from '@/components/notion';
import { EntityConfig } from '@/types/entity-config';

export interface Claim {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  claimedAt?: string;
  createdAt: string;
  updatedAt: string;
  approval?: any;
  claimedBy?: any;
}

const statusColors = {
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export const claimsConfig: EntityConfig<Claim> = {
  entityName: 'claim',
  entityLabel: 'Claims',
  apiPath: 'claims',

  columns: [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium max-w-md truncate">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <BadgeNotion variant="outline" className="bg-indigo-100 text-indigo-800">
          {row.getValue('type')}
        </BadgeNotion>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <BadgeNotion className={statusColors[status] || ''} variant="outline">
            {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
          </BadgeNotion>
        );
      },
    },
    {
      accessorKey: 'claimedAt',
      header: 'Claimed At',
      cell: ({ row }) => {
        const claimedAt = row.getValue('claimedAt');
        return claimedAt ? format(new Date(claimedAt as string), 'MMM d, yyyy HH:mm') : '—';
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'MMM d, yyyy'),
    },
  ],

  filters: [
    {
      field: 'type',
      label: 'Type',
      type: 'multiselect',
    },
    {
      field: 'status',
      label: 'Status',
      type: 'multiselect',
    },
  ],

  searchFields: ['title', 'description'],
  searchPlaceholder: 'Search claims...',

  detailRelations: ['approval', 'claimedBy'],
};
