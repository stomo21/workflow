import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { UsersRound } from 'lucide-react';
import { EntityPageNotion } from '@/components/entity-page/EntityPageNotion';
import { groupsConfig } from '@/config/entities/groups.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function GroupsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const handleGroupEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups-filters'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleGroupEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleGroupEvent);
    wsClient.on(EventType.ENTITY_DELETED, handleGroupEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleGroupEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleGroupEvent);
      wsClient.off(EntityType.ENTITY_DELETED, handleGroupEvent);
    };
  }, [queryClient]);

  const handleCreateClick = () => {
    setDialogOpen(true);
  };

  return (
    <EntityPageNotion
      config={groupsConfig}
      createButtonLabel="New Group"
      onCreateClick={handleCreateClick}
      icon={<UsersRound className="h-10 w-10 text-green-500" />}
    />
  );
}
