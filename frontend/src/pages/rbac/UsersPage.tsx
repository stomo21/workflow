import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { userService } from '@/lib/api-client';
import { wsClient, EventType } from '@/lib/websocket-client';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  useEffect(() => {
    const handleUserEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleUserEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleUserEvent);
    wsClient.on(EventType.ENTITY_DELETED, handleUserEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleUserEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleUserEvent);
      wsClient.off(EventType.ENTITY_DELETED, handleUserEvent);
    };
  }, [queryClient]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
      enableSorting: true,
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      enableSorting: true,
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      enableSorting: true,
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
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(row.original);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this user?')) {
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
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage system users</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={usersData?.data || []}
        searchable
        searchPlaceholder="Search users..."
        onRowClick={(user) => setSelectedUser(user)}
      />
    </div>
  );
}
