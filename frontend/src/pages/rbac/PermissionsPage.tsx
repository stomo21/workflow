import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EntityPage } from '@/components/entity-page/EntityPage';
import { PermissionDialog } from '@/components/rbac/PermissionDialog';
import { permissionsConfig } from '@/config/entities/permissions.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function PermissionsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<any>(null);

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

  const handleCreateClick = () => {
    setSelectedPermission(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPermission(null);
  };

  return (
    <>
      <EntityPage
        config={permissionsConfig}
        createButtonLabel="New Permission"
        onCreateClick={handleCreateClick}
      />
      <PermissionDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        permission={selectedPermission}
      />
    </>
  );
}
