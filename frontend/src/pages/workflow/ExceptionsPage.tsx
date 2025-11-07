import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EntityPage } from '@/components/entity-page/EntityPage';
import { exceptionsConfig } from '@/config/entities/exceptions.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function ExceptionsPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleExceptionEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions'] });
      queryClient.invalidateQueries({ queryKey: ['exceptions-filters'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleExceptionEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleExceptionEvent);
    wsClient.on(EventType.EXCEPTION_RAISED, handleExceptionEvent);
    wsClient.on(EventType.ENTITY_DELETED, handleExceptionEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleExceptionEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleExceptionEvent);
      wsClient.off(EventType.EXCEPTION_RAISED, handleExceptionEvent);
      wsClient.off(EventType.ENTITY_DELETED, handleExceptionEvent);
    };
  }, [queryClient]);

  return (
    <EntityPage
      config={exceptionsConfig}
      createButtonLabel="Report Exception"
      onCreateClick={() => {
        // TODO: Open create exception dialog/navigate to create page
        console.log('Create exception clicked');
      }}
    />
  );
}
