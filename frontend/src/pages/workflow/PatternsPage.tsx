import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { patternService } from '@/lib/api-client';
import { wsClient, EventType } from '@/lib/websocket-client';

interface Pattern {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  version: number;
  createdAt: string;
}

export default function PatternsPage() {
  const queryClient = useQueryClient();
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  const { data: patternsData, isLoading } = useQuery({
    queryKey: ['patterns'],
    queryFn: () => patternService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => patternService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patterns'] });
    },
  });

  useEffect(() => {
    const handlePatternEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['patterns'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handlePatternEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handlePatternEvent);
    wsClient.on(EventType.ENTITY_DELETED, handlePatternEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handlePatternEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handlePatternEvent);
      wsClient.off(EventType.ENTITY_DELETED, handlePatternEvent);
    };
  }, [queryClient]);

  const columns: ColumnDef<Pattern>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
          {row.original.type}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const colorClass =
          status === 'active'
            ? 'bg-green-100 text-green-700'
            : status === 'draft'
            ? 'bg-gray-100 text-gray-700'
            : 'bg-red-100 text-red-700';
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'version',
      header: 'Version',
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
              setSelectedPattern(row.original);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this pattern?')) {
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
          <h1 className="text-3xl font-bold">Patterns</h1>
          <p className="text-muted-foreground">Manage workflow patterns</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Pattern
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={patternsData?.data || []}
        searchable
        searchPlaceholder="Search patterns..."
        onRowClick={(pattern) => setSelectedPattern(pattern)}
      />
    </div>
  );
}
