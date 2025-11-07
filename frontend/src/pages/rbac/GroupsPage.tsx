import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EntityPage } from '@/components/entity-page/EntityPage';
import { groupsConfig } from '@/config/entities/groups.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function GroupsPage() {
  const queryClient = useQueryClient();

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
      wsClient.off(EventType.ENTITY_DELETED, handleGroupEvent);
    };
  }, [queryClient]);

  return (
    <EntityPage
      config={groupsConfig}
      createButtonLabel="Add Group"
      onCreateClick={() => {
        // TODO: Open create group dialog/navigate to create page
        console.log('Create group clicked');
      }}
    />
  );
}
