import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FileCheck } from 'lucide-react';
import { EntityPageNotion } from '@/components/entity-page/EntityPageNotion';
import { decisionsConfig } from '@/config/entities/decisions.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function DecisionsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

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
      wsClient.off(EntityType.ENTITY_UPDATED, handleDecisionEvent);
      wsClient.off(EventType.DECISION_MADE, handleDecisionEvent);
      wsClient.off(EntityType.ENTITY_DELETED, handleDecisionEvent);
    };
  }, [queryClient]);

  const handleCreateClick = () => {
    setDialogOpen(true);
  };

  return (
    <EntityPageNotion
      config={decisionsConfig}
      createButtonLabel="Record Decision"
      onCreateClick={handleCreateClick}
      icon={<FileCheck className="h-10 w-10 text-green-500" />}
    />
  );
}
