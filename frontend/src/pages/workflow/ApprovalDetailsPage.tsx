import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Edit, Calendar, User, GitBranch, CheckCircle } from 'lucide-react';
import { EntityDetails } from '@/components/entity-details/EntityDetails';
import { Button } from '@/components/ui/button';
import { approvalService } from '@/lib/api-client';

interface Approval {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  createdAt: string;
  assignedTo?: { id: string; email: string };
  pattern?: { id: string; name: string };
  decisions?: Array<{ id: string; type: string; comment?: string; decidedAt: string }>;
}

export default function ApprovalDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: approval, isLoading } = useQuery<Approval>({
    queryKey: ['approval', id],
    queryFn: () => approvalService.getOne(id!),
    enabled: !!id,
  });

  if (isLoading || !approval) {
    return <div>Loading...</div>;
  }

  const decisionsTab = {
    id: 'decisions',
    label: 'Decisions',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Decision History</h3>
        {approval.decisions && approval.decisions.length > 0 ? (
          <div className="space-y-2">
            {approval.decisions.map((decision) => (
              <div key={decision.id} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    decision.type === 'approve'
                      ? 'bg-green-100 text-green-700'
                      : decision.type === 'reject'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {decision.type}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(decision.decidedAt).toLocaleString()}
                  </span>
                </div>
                {decision.comment && (
                  <p className="text-sm">{decision.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No decisions recorded yet</p>
        )}
      </div>
    ),
  };

  return (
    <EntityDetails
      title={approval.title}
      entityType="Approval"
      entityId={approval.id}
      backLink="/approvals"
      tabs={[decisionsTab]}
      headerActions={
        <>
          <Button variant="outline" className="bg-green-50 hover:bg-green-100">
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </>
      }
    >
      <div className="grid gap-6">
        {/* Basic Information */}
        <div className="rounded-lg border p-6 space-y-4">
          <h3 className="text-lg font-semibold">Approval Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{approval.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
                {approval.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Priority</p>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                approval.priority === 'high' || approval.priority === 'critical'
                  ? 'bg-red-100 text-red-700'
                  : approval.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {approval.priority}
              </span>
            </div>
            {approval.assignedTo && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Assigned To</p>
                  <p className="font-medium">{approval.assignedTo.email}</p>
                </div>
              </div>
            )}
            {approval.pattern && (
              <div className="flex items-center gap-3">
                <GitBranch className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Pattern</p>
                  <p className="font-medium">{approval.pattern.name}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(approval.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {approval.dueDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">
                    {new Date(approval.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            {approval.description && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{approval.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </EntityDetails>
  );
}
