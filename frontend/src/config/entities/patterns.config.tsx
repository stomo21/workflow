import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { EntityConfig } from '@/types/entity-config';

export interface Pattern {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  approvals?: any[];
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  inactive: 'bg-red-100 text-red-800',
  archived: 'bg-yellow-100 text-yellow-800',
};

export const patternsConfig: EntityConfig<Pattern> = {
  entityName: 'pattern',
  entityLabel: 'Patterns',
  apiPath: 'patterns',

  columns: [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          {row.getValue('type')}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge className={statusColors[status] || ''} variant="outline">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'version',
      header: 'Version',
      cell: ({ row }) => (
        <div className="text-sm">v{row.getValue('version')}</div>
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

  searchFields: ['name', 'description'],
  searchPlaceholder: 'Search patterns...',

  detailRelations: ['approvals'],
};
