import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { EntityConfig } from '@/types/entity-config';

export interface Decision {
  id: string;
  type: string;
  comment?: string;
  decidedAt: string;
  createdAt: string;
  updatedAt: string;
  approval?: any;
  decidedBy?: any;
}

const typeColors = {
  approve: 'bg-green-100 text-green-800',
  reject: 'bg-red-100 text-red-800',
  delegate: 'bg-blue-100 text-blue-800',
  escalate: 'bg-yellow-100 text-yellow-800',
  request_info: 'bg-purple-100 text-purple-800',
};

export const decisionsConfig: EntityConfig<Decision> = {
  entityName: 'decision',
  entityLabel: 'Decisions',
  apiPath: 'decisions',

  columns: [
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return (
          <Badge className={typeColors[type] || ''} variant="outline">
            {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: ({ row }) => (
        <div className="max-w-md truncate text-sm text-muted-foreground">
          {row.getValue('comment') || '—'}
        </div>
      ),
    },
    {
      accessorKey: 'decidedAt',
      header: 'Decided At',
      cell: ({ row }) => format(new Date(row.getValue('decidedAt')), 'MMM d, yyyy HH:mm'),
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
      label: 'Decision Type',
      type: 'multiselect',
    },
  ],

  searchFields: ['comment'],
  searchPlaceholder: 'Search decisions...',

  detailRelations: ['approval', 'decidedBy'],
};
