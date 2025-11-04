import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Edit, Mail, Calendar, Shield, UsersRound } from 'lucide-react';
import { EntityDetails } from '@/components/entity-details/EntityDetails';
import { Button } from '@/components/ui/button';
import { userService } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  groups?: Array<{ id: string; name: string }>;
  roles?: Array<{ id: string; name: string; permissions?: Array<{ name: string }> }>;
}

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => userService.getOne(id!),
    enabled: !!id,
  });

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'N/A';

  // Extract unique permissions from all roles
  const allPermissions = new Set(
    user.roles?.flatMap((role) => role.permissions?.map((p) => p.name) || [])
  );

  const groupsTab = {
    id: 'groups',
    label: 'Groups',
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Groups</h3>
          <Button size="sm">Manage Groups</Button>
        </div>
        {user.groups && user.groups.length > 0 ? (
          <div className="grid gap-2">
            {user.groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-2 rounded-lg border p-3"
              >
                <UsersRound className="h-4 w-4 text-muted-foreground" />
                <span>{group.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Not assigned to any groups</p>
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
          <h3 className="text-lg font-semibold">Roles</h3>
          <Button size="sm">Manage Roles</Button>
        </div>
        {user.roles && user.roles.length > 0 ? (
          <div className="grid gap-2">
            {user.roles.map((role) => (
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
          <p className="text-muted-foreground">No roles assigned</p>
        )}
      </div>
    ),
  };

  const permissionsTab = {
    id: 'permissions',
    label: 'Permissions',
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Effective Permissions</h3>
        <p className="text-sm text-muted-foreground">
          Permissions granted through assigned roles
        </p>
        {allPermissions.size > 0 ? (
          <div className="flex flex-wrap gap-2">
            {Array.from(allPermissions).map((permission) => (
              <span
                key={permission}
                className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
              >
                {permission}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No permissions</p>
        )}
      </div>
    ),
  };

  return (
    <EntityDetails
      title={fullName}
      entityType="User"
      entityId={user.id}
      backLink="/users"
      tabs={[groupsTab, rolesTab, permissionsTab]}
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
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    user.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Groups</p>
            <p className="text-2xl font-bold">{user.groups?.length || 0}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Roles</p>
            <p className="text-2xl font-bold">{user.roles?.length || 0}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Permissions</p>
            <p className="text-2xl font-bold">{allPermissions.size}</p>
          </div>
        </div>
      </div>
    </EntityDetails>
  );
}
