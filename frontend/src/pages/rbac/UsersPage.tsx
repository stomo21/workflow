import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { EntityPageNotion } from '@/components/entity-page/EntityPageNotion';
import { usersConfig } from '@/config/entities/users.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleCreateClick = () => {
    setDialogOpen(true);
  };

  return (
    <EntityPageNotion
      config={usersConfig}
      createButtonLabel="Add User"
      onCreateClick={handleCreateClick}
      icon={<Users className="h-10 w-10 text-blue-500" />}
    />
  );
}
