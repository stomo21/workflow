import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { roleService } from '@/lib/api-client';
import { wsClient, EventType } from '@/lib/websocket-client';

interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export default function RolesPage() {
  const queryClient = useQueryClient();

  const { data: rolesData, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getAll(),
  });

  useEffect(() => {
    const handleRoleEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleRoleEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleRoleEvent);
    wsClient.on(EventType.ENTITY_DELETED, handleRoleEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleRoleEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleRoleEvent);
      wsClient.off(EventType.ENTITY_DELETED, handleRoleEvent);
    };
  }, [queryClient]);

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            row.original.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {row.original.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
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
          <h1 className="text-3xl font-bold">Roles</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rolesData?.data || []}
        searchable
        searchPlaceholder="Search roles..."
      />
    </div>
  );
}
