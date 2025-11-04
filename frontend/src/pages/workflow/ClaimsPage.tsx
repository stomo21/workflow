import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { claimService } from '@/lib/api-client';
import { wsClient, EventType } from '@/lib/websocket-client';

interface Claim {
  id: string;
  title: string;
  type: string;
  status: string;
  claimedAt?: string;
  createdAt: string;
}

export default function ClaimsPage() {
  const queryClient = useQueryClient();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const { data: claimsData, isLoading } = useQuery({
    queryKey: ['claims'],
    queryFn: () => claimService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => claimService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });

  useEffect(() => {
    const handleClaimEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleClaimEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleClaimEvent);
    wsClient.on(EventType.CLAIM_UPDATED, handleClaimEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleClaimEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleClaimEvent);
      wsClient.off(EventType.CLAIM_UPDATED, handleClaimEvent);
    };
  }, [queryClient]);

  const columns: ColumnDef<Claim>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      enableSorting: true,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700">
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
          status === 'completed'
            ? 'bg-green-100 text-green-700'
            : status === 'in_progress'
            ? 'bg-blue-100 text-blue-700'
            : status === 'open'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-gray-100 text-gray-700';
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'claimedAt',
      header: 'Claimed At',
      cell: ({ row }) => (
        row.original.claimedAt
          ? new Date(row.original.claimedAt).toLocaleDateString()
          : 'Not claimed'
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
              setSelectedClaim(row.original);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this claim?')) {
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
          <h1 className="text-3xl font-bold">Claims</h1>
          <p className="text-muted-foreground">Manage workflow claims</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Claim
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={claimsData?.data || []}
        searchable
        searchPlaceholder="Search claims..."
        onRowClick={(claim) => setSelectedClaim(claim)}
      />
    </div>
  );
}
