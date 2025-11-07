import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { EntityConfig } from '@/types/entity-config';

export interface Approval {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  pattern?: any;
  assignedTo?: any;
  decisions?: any[];
  exceptions?: any[];
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  escalated: 'bg-orange-100 text-orange-800',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export const approvalsConfig: EntityConfig<Approval> = {
  entityName: 'approval',
  entityLabel: 'Approvals',
  apiPath: 'approvals',

  columns: [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium max-w-md truncate">{row.getValue('title')}</div>
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
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.getValue('priority') as string;
        return (
          <Badge className={priorityColors[priority] || ''} variant="outline">
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => {
        const dueDate = row.getValue('dueDate');
        return dueDate ? format(new Date(dueDate as string), 'MMM d, yyyy') : '—';
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
      field: 'status',
      label: 'Status',
      type: 'multiselect',
    },
    {
      field: 'priority',
      label: 'Priority',
      type: 'multiselect',
    },
    {
      field: 'isActive',
      label: 'Active Status',
      type: 'multiselect',
    },
  ],

  searchFields: ['title', 'description'],
  searchPlaceholder: 'Search approvals...',

  detailRelations: ['pattern', 'assignedTo', 'decisions', 'exceptions'],
};
