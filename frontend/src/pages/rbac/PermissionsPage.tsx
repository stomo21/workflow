import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { permissionService } from '@/lib/api-client';
import { wsClient, EventType } from '@/lib/websocket-client';

interface Permission {
  id: string;
  name: string;
  description?: string;
  action: string;
  resource: string;
  isActive: boolean;
  createdAt: string;
}

export default function PermissionsPage() {
  const queryClient = useQueryClient();
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const { data: permissionsData, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => permissionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });

  useEffect(() => {
    const handlePermissionEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handlePermissionEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handlePermissionEvent);
    wsClient.on(EventType.ENTITY_DELETED, handlePermissionEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handlePermissionEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handlePermissionEvent);
      wsClient.off(EventType.ENTITY_DELETED, handlePermissionEvent);
    };
  }, [queryClient]);

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
          {row.original.action}
        </span>
      ),
    },
    {
      accessorKey: 'resource',
      header: 'Resource',
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700">
          {row.original.resource}
        </span>
      ),
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
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPermission(row.original);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this permission?')) {
                deleteMutation.mutate(row.original.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Permissions</h1>
          <p className="text-muted-foreground">Manage system permissions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Permission
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={permissionsData?.data || []}
        searchable
        searchPlaceholder="Search permissions..."
        onRowClick={(permission) => setSelectedPermission(permission)}
      />
    </div>
  );
}
