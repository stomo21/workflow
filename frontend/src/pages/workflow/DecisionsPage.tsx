import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EntityPage } from '@/components/entity-page/EntityPage';
import { decisionsConfig } from '@/config/entities/decisions.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function DecisionsPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleDecisionEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      queryClient.invalidateQueries({ queryKey: ['decisions-filters'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleDecisionEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleDecisionEvent);
    wsClient.on(EventType.DECISION_MADE, handleDecisionEvent);
    wsClient.on(EventType.ENTITY_DELETED, handleDecisionEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleDecisionEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleDecisionEvent);
      wsClient.off(EventType.DECISION_MADE, handleDecisionEvent);
      wsClient.off(EventType.ENTITY_DELETED, handleDecisionEvent);
    };
  }, [queryClient]);

  return (
    <EntityPage
      config={decisionsConfig}
      createButtonLabel="Record Decision"
      onCreateClick={() => {
        // TODO: Open create decision dialog/navigate to create page
        console.log('Create decision clicked');
      }}
    />
  );
}
