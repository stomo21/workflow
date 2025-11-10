import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CheckSquare } from 'lucide-react';
import { EntityPageNotion } from '@/components/entity-page/EntityPageNotion';
import { approvalsConfig } from '@/config/entities/approvals.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function ApprovalsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const handleApprovalEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['approvals-filters'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleApprovalEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleApprovalEvent);
    wsClient.on(EventType.APPROVAL_STATUS_CHANGED, handleApprovalEvent);
    wsClient.on(EventType.ENTITY_DELETED, handleApprovalEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleApprovalEvent);
      wsClient.off(EntityType.ENTITY_UPDATED, handleApprovalEvent);
      wsClient.off(EventType.APPROVAL_STATUS_CHANGED, handleApprovalEvent);
      wsClient.off(EventType.ENTITY_DELETED, handleApprovalEvent);
    };
  }, [queryClient]);

  const handleCreateClick = () => {
    setDialogOpen(true);
  };

  return (
    <EntityPageNotion
      config={approvalsConfig}
      createButtonLabel="Create Approval"
      onCreateClick={handleCreateClick}
      icon={<CheckSquare className="h-10 w-10 text-blue-500" />}
    />
  );
}
