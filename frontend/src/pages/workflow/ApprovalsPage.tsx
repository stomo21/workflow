import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { approvalService } from '@/lib/api-client';
import { wsClient, EventType } from '@/lib/websocket-client';

interface Approval {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function ApprovalsPage() {
  const queryClient = useQueryClient();

  const { data: approvalsData, isLoading } = useQuery({
    queryKey: ['approvals'],
    queryFn: () => approvalService.getAll(),
  });

  useEffect(() => {
    const handleApprovalEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleApprovalEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleApprovalEvent);
    wsClient.on(EventType.APPROVAL_STATUS_CHANGED, handleApprovalEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleApprovalEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleApprovalEvent);
      wsClient.off(EventType.APPROVAL_STATUS_CHANGED, handleApprovalEvent);
    };
  }, [queryClient]);

  const columns: ColumnDef<Approval>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.original.priority;
        const colorClass =
          priority === 'high' || priority === 'critical'
            ? 'bg-red-100 text-red-700'
            : priority === 'medium'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-green-100 text-green-700';
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}>
            {priority}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      enableSorting: true,
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Approvals</h1>
          <p className="text-muted-foreground">Manage approval workflows</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Approval
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={approvalsData?.data || []}
        searchable
        searchPlaceholder="Search approvals..."
      />
    </div>
  );
}
