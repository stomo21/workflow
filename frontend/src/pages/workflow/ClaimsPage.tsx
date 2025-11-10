import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ClipboardList } from 'lucide-react';
import { EntityPageNotion } from '@/components/entity-page/EntityPageNotion';
import { claimsConfig } from '@/config/entities/claims.config';
import { wsClient, EventType } from '@/lib/websocket-client';

export default function ClaimsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const handleClaimEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['claims-filters'] });
    };

    wsClient.on(EventType.ENTITY_CREATED, handleClaimEvent);
    wsClient.on(EventType.ENTITY_UPDATED, handleClaimEvent);
    wsClient.on(EventType.CLAIM_UPDATED, handleClaimEvent);
    wsClient.on(EventType.ENTITY_DELETED, handleClaimEvent);

    return () => {
      wsClient.off(EventType.ENTITY_CREATED, handleClaimEvent);
      wsClient.off(EntityType.ENTITY_UPDATED, handleClaimEvent);
      wsClient.off(EventType.CLAIM_UPDATED, handleClaimEvent);
      wsClient.off(EventType.ENTITY_DELETED, handleClaimEvent);
    };
  }, [queryClient]);

  const handleCreateClick = () => {
    setDialogOpen(true);
  };

  return (
    <EntityPageNotion
      config={claimsConfig}
      createButtonLabel="Create Claim"
      onCreateClick={handleCreateClick}
      icon={<ClipboardList className="h-10 w-10 text-cyan-500" />}
    />
  );
}
