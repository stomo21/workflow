import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EntityPage } from '@/components/entity-page/EntityPage';
import { rolesConfig } from '@/config/entities/roles.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function RolesPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleRoleEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles-filters'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleRoleEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleRoleEvent);
    wsClient.on(EventType.ENTITY_DELETED, handleRoleEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleRoleEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handleRoleEvent);
      wsClient.off(EventType.ENTITY_DELETED, handleRoleEvent);
    };
  }, [queryClient]);

  return (
    <EntityPage
      config={rolesConfig}
      createButtonLabel="Add Role"
      onCreateClick={() => {
        // TODO: Open create role dialog/navigate to create page
        console.log('Create role clicked');
      }}
    />
  );
}
