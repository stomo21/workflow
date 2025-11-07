import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EntityPage } from '@/components/entity-page/EntityPage';
import { patternsConfig } from '@/config/entities/patterns.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function PatternsPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handlePatternEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['patterns'] });
      queryClient.invalidateQueries({ queryKey: ['patterns-filters'] });
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

  return (
    <EntityPage
      config={patternsConfig}
      createButtonLabel="Create Pattern"
      onCreateClick={() => {
        // TODO: Open create pattern dialog/navigate to create page
        console.log('Create pattern clicked');
      }}
    />
  );
}
