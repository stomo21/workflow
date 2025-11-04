import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Edit, Users, Shield, Calendar } from 'lucide-react';
import { EntityDetails } from '@/components/entity-details/EntityDetails';
import { Button } from '@/components/ui/button';
import { groupService } from '@/lib/api-client';

interface Group {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  users?: Array<{ id: string; email: string; firstName?: string; lastName?: string }>;
  roles?: Array<{ id: string; name: string; permissions?: Array<{ name: string }> }>;
}

export default function GroupDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading } = useQuery<Group>({
    queryKey: ['group', id],
    queryFn: () => groupService.getOne(id!),
    enabled: !!id,
  });

  if (isLoading || !group) {
    return <div>Loading...</div>;
  }

  const usersTab = {
    id: 'users',
    label: 'Members',
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Group Members</h3>
          <Button size="sm">Add Members</Button>
        </div>
        {group.users && group.users.length > 0 ? (
          <div className="grid gap-2">
            {group.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 rounded-lg border p-3"
              >
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {[user.firstName, user.lastName].filter(Boolean).join(' ') || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No members in this group</p>
        )}
      </div>
    ),
  };

  const rolesTab = {
    id: 'roles',
    label: 'Roles',
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Assigned Roles</h3>
          <Button size="sm">Assign Roles</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Roles assigned to this group apply to all its members
        </p>
        {group.roles && group.roles.length > 0 ? (
          <div className="grid gap-2">
            {group.roles.map((role) => (
              <div
                key={role.id}
                className="rounded-lg border p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{role.name}</span>
                </div>
                {role.permissions && role.permissions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {role.permissions.map((permission, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                      >
                        {permission.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No roles assigned to this group</p>
        )}
      </div>
    ),
  };

  return (
    <EntityDetails
      title={group.name}
      entityType="Group"
      entityId={group.id}
      backLink="/groups"
      tabs={[usersTab, rolesTab]}
      headerActions={
        <>
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
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Group Name</p>
              <p className="font-medium">{group.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(group.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {group.description && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{group.description}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  group.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {group.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Members</p>
            <p className="text-2xl font-bold">{group.users?.length || 0}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Assigned Roles</p>
            <p className="text-2xl font-bold">{group.roles?.length || 0}</p>
          </div>
        </div>
      </div>
    </EntityDetails>
  );
}
