import { useQuery } from '@tanstack/react-query';
import { Clock, User, Activity } from 'lucide-react';
import { auditLogService } from '@/lib/api-client';

interface AuditLog {
  id: string;
  action: string;
  description?: string;
  userName?: string;
  createdAt: string;
  newValues?: Record<string, any>;
  oldValues?: Record<string, any>;
}

interface ActivityLogProps {
  entityType: string;
  entityId: string;
}

export function ActivityLog({ entityType, entityId }: ActivityLogProps) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['activity-log', entityType, entityId],
    queryFn: () => auditLogService.getEntityTimeline(entityType, entityId),
  });

  if (isLoading) {
    return <div className="p-4 text-center">Loading activity...</div>;
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Activity className="mx-auto h-12 w-12 mb-2" />
        <p>No activity recorded yet</p>
      </div>
    );
  }

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      create: 'text-green-600 bg-green-100',
      update: 'text-blue-600 bg-blue-100',
      delete: 'text-red-600 bg-red-100',
      approve: 'text-green-600 bg-green-100',
      reject: 'text-red-600 bg-red-100',
      claim: 'text-purple-600 bg-purple-100',
      assign: 'text-blue-600 bg-blue-100',
      complete: 'text-green-600 bg-green-100',
      resolve: 'text-green-600 bg-green-100',
    };
    return colors[action.toLowerCase()] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Activity Timeline</h3>
      <div className="space-y-4">
        {logs.map((log: AuditLog) => (
          <div
            key={log.id}
            className="flex gap-4 border-l-2 border-gray-200 pl-4 pb-4"
          >
            <div className="flex-shrink-0">
              <div
                className={`rounded-full p-2 ${getActionColor(log.action)}`}
              >
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getActionColor(
                    log.action
                  )}`}
                >
                  {log.action}
                </span>
                {log.userName && (
                  <span className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-1 h-3 w-3" />
                    {log.userName}
                  </span>
                )}
                <span className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
              {log.description && (
                <p className="text-sm text-muted-foreground">
                  {log.description}
                </p>
              )}
              {log.newValues && Object.keys(log.newValues).length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    View changes
                  </summary>
                  <div className="mt-2 rounded-md bg-muted p-2">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(log.newValues, null, 2)}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
