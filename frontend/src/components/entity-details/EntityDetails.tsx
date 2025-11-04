import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ActivityLog } from '@/components/activity-log/ActivityLog';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface EntityDetailsProps {
  title: string;
  entityType: string;
  entityId: string;
  backLink: string;
  tabs?: Tab[];
  headerActions?: ReactNode;
  children: ReactNode;
}

export function EntityDetails({
  title,
  entityType,
  entityId,
  backLink,
  tabs = [],
  headerActions,
  children,
}: EntityDetailsProps) {
  const navigate = useNavigate();

  const allTabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: children,
    },
    ...tabs,
    {
      id: 'activity',
      label: 'Activity',
      content: <ActivityLog entityType={entityType} entityId={entityId} />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(backLink)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">
              {entityType} Details
            </p>
          </div>
        </div>
        {headerActions && <div className="flex gap-2">{headerActions}</div>}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          {allTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {allTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
