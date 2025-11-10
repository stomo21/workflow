import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { EntityPageNotion } from '@/components/entity-page/EntityPageNotion';
import { exceptionsConfig } from '@/config/entities/exceptions.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function ExceptionsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const handleExceptionEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions'] });
      queryClient.invalidateQueries({ queryKey: ['exceptions-filters'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleExceptionEvent);
    wsClient.on(EntityType.ENTITY_UPDATED, handleExceptionEvent);
    wsClient.on(EventType.EXCEPTION_RAISED, handleExceptionEvent);
    wsClient.on(EventType.ENTITY_DELETED, handleExceptionEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleExceptionEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleExceptionEvent);
      wsClient.off(EventType.EXCEPTION_RAISED, handleExceptionEvent);
      wsClient.off(EventType.ENTITY_DELETED, handleExceptionEvent);
    };
  }, [queryClient]);

  const handleCreateClick = () => {
    setDialogOpen(true);
  };

  return (
    <EntityPageNotion
      config={exceptionsConfig}
      createButtonLabel="Report Exception"
      onCreateClick={handleCreateClick}
      icon={<AlertTriangle className="h-10 w-10 text-red-500" />}
    />
  );
}
