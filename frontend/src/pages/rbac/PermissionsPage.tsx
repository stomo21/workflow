import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EntityPage } from '@/components/entity-page/EntityPage';
import { permissionsConfig } from '@/config/entities/permissions.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function PermissionsPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handlePermissionEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permissions-filters'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handlePermissionEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handlePermissionEvent);
    wsClient.on(EventType.ENTITY_DELETED, handlePermissionEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handlePermissionEvent);
      wsClient.off(EventType.ENTITY_UPDATED, handlePermissionEvent);
      wsClient.off(EventType.ENTITY_DELETED, handlePermissionEvent);
    };
  }, [queryClient]);

  return (
    <EntityPage
      config={permissionsConfig}
      createButtonLabel="Add Permission"
      onCreateClick={() => {
        // TODO: Open create permission dialog/navigate to create page
        console.log('Create permission clicked');
      }}
    />
  );
}
