import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { GitBranch } from 'lucide-react';
import { EntityPageNotion } from '@/components/entity-page/EntityPageNotion';
import { patternsConfig } from '@/config/entities/patterns.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function PatternsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

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
      wsClient.off(EntityType.ENTITY_UPDATED, handlePatternEvent);
      wsClient.off(EventType.ENTITY_DELETED, handlePatternEvent);
    };
  }, [queryClient]);

  const handleCreateClick = () => {
    setDialogOpen(true);
  };

  return (
    <EntityPageNotion
      config={patternsConfig}
      createButtonLabel="Create Pattern"
      onCreateClick={handleCreateClick}
      icon={<GitBranch className="h-10 w-10 text-purple-500" />}
    />
  );
}
