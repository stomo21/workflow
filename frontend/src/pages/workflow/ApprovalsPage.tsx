import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EntityPage } from '@/components/entity-page/EntityPage';
import { approvalsConfig } from '@/config/entities/approvals.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function ApprovalsPage() {
  const queryClient = useQueryClient();

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
      wsClient.off(EventType.ENTITY_UPDATED, handleApprovalEvent);
      wsClient.off(EventType.APPROVAL_STATUS_CHANGED, handleApprovalEvent);
      wsClient.off(EventType.ENTITY_DELETED, handleApprovalEvent);
    };
  }, [queryClient]);

  return (
    <EntityPage
      config={approvalsConfig}
      createButtonLabel="Create Approval"
      onCreateClick={() => {
        // TODO: Open create approval dialog/navigate to create page
        console.log('Create approval clicked');
      }}
    />
  );
}
