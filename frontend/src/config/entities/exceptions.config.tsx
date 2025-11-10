import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { BadgeNotion } from '@/components/notion';
import { EntityConfig } from '@/types/entity-config';

export interface Exception {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  approval?: any;
}

const statusColors = {
  open: 'bg-red-100 text-red-800',
  resolved: 'bg-green-100 text-green-800',
  investigating: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-gray-100 text-gray-800',
};

export const exceptionsConfig: EntityConfig<Exception> = {
  entityName: 'exception',
  entityLabel: 'Exceptions',
  apiPath: 'exceptions',

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
        <BadgeNotion variant="outline" className="bg-purple-100 text-purple-800">
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
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </BadgeNotion>
        );
      },
    },
    {
      accessorKey: 'errorMessage',
      header: 'Error Message',
      cell: ({ row }) => (
        <div className="max-w-md truncate text-sm text-muted-foreground">
          {row.getValue('errorMessage') || '—'}
        </div>
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

  searchFields: ['title', 'description', 'errorMessage'],
  searchPlaceholder: 'Search exceptions...',

  detailRelations: ['approval'],
};
