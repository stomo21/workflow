import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { decisionService } from '@/lib/api-client';
import { wsClient, EventType } from '@/lib/websocket-client';

interface Decision {
  id: string;
  type: string;
  comment?: string;
  decidedAt: string;
  createdAt: string;
}

export default function DecisionsPage() {
  const queryClient = useQueryClient();
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  const { data: decisionsData, isLoading } = useQuery({
    queryKey: ['decisions'],
    queryFn: () => decisionService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => decisionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
    },
  });

  useEffect(() => {
    const handleDecisionEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleDecisionEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleDecisionEvent);
    wsClient.on(EventType.DECISION_MADE, handleDecisionEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleDecisionEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleDecisionEvent);
      wsClient.off(EventType.DECISION_MADE, handleDecisionEvent);
    };
  }, [queryClient]);

  const columns: ColumnDef<Decision>[] = [
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.type;
        const colorClass =
          type === 'approve'
            ? 'bg-green-100 text-green-700'
            : type === 'reject'
            ? 'bg-red-100 text-red-700'
            : type === 'delegate'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-yellow-100 text-yellow-700';
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}>
            {type}
          </span>
        );
      },
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: ({ row }) => (
        <span className="truncate max-w-xs block">{row.original.comment || 'No comment'}</span>
      ),
    },
    {
      accessorKey: 'decidedAt',
      header: 'Decided At',
      cell: ({ row }) => new Date(row.original.decidedAt).toLocaleString(),
      enableSorting: true,
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
              setSelectedDecision(row.original);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this decision?')) {
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
          <h1 className="text-3xl font-bold">Decisions</h1>
          <p className="text-muted-foreground">View approval decisions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Decision
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={decisionsData?.data || []}
        searchable
        searchPlaceholder="Search decisions..."
        onRowClick={(decision) => setSelectedDecision(decision)}
      />
    </div>
  );
}
