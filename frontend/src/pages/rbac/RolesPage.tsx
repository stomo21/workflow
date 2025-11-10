import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Shield } from 'lucide-react';
import { EntityPageNotion } from '@/components/entity-page/EntityPageNotion';
import { RoleDialog } from '@/components/rbac/RoleDialog';
import { rolesConfig } from '@/config/entities/roles.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function RolesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

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

  const handleCreateClick = () => {
    setSelectedRole(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRole(null);
  };

  return (
    <>
      <EntityPageNotion
        config={rolesConfig}
        createButtonLabel="New Role"
        onCreateClick={handleCreateClick}
        icon={<Shield className="h-10 w-10 text-purple-500" />}
      />
      <RoleDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        role={selectedRole}
      />
    </>
  );
}
