import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EntityPage } from '@/components/entity-page/EntityPage';
import { usersConfig } from '@/config/entities/users.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function UsersPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleUserEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users-filters'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleUserEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleUserEvent);
    wsClient.on(EventType.ENTITY_DELETED, handleUserEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleUserEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleUserEvent);
      wsClient.off(EventType.ENTITY_DELETED, handleUserEvent);
    };
  }, [queryClient]);

  return (
    <EntityPage
      config={usersConfig}
      createButtonLabel="Add User"
      onCreateClick={() => {
        // TODO: Open create user dialog/navigate to create page
        console.log('Create user clicked');
      }}
    />
  );
}
