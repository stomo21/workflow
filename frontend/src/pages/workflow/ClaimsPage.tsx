import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EntityPage } from '@/components/entity-page/EntityPage';
import { claimsConfig } from '@/config/entities/claims.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function ClaimsPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClaimEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['claims-filters'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleClaimEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleClaimEvent);
    wsClient.on(EventType.CLAIM_UPDATED, handleClaimEvent);
    wsClient.on(EventType.ENTITY_DELETED, handleClaimEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleClaimEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleClaimEvent);
      wsClient.off(EventType.CLAIM_UPDATED, handleClaimEvent);
      wsClient.off(EventType.ENTITY_DELETED, handleClaimEvent);
    };
  }, [queryClient]);

  return (
    <EntityPage
      config={claimsConfig}
      createButtonLabel="Create Claim"
      onCreateClick={() => {
        // TODO: Open create claim dialog/navigate to create page
        console.log('Create claim clicked');
      }}
    />
  );
}
