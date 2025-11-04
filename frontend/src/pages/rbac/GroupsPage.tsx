import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { groupService } from '@/lib/api-client';
import { wsClient, EventType } from '@/lib/websocket-client';

interface Group {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export default function GroupsPage() {
  const queryClient = useQueryClient();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const { data: groupsData, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => groupService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  useEffect(() => {
    const handleGroupEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleGroupEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleGroupEvent);
    wsClient.on(EventType.ENTITY_DELETED, handleGroupEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleGroupEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleGroupEvent);
      wsClient.off(EventType.ENTITY_DELETED, handleGroupEvent);
    };
  }, [queryClient]);

  const columns: ColumnDef<Group>[] = [
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
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGroup(row.original);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this group?')) {
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
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-muted-foreground">Manage user groups</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={groupsData?.data || []}
        searchable
        searchPlaceholder="Search groups..."
        onRowClick={(group) => setSelectedGroup(group)}
      />
    </div>
  );
}
