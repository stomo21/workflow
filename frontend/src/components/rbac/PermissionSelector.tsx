import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Check, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { permissionService } from '@/lib/api-client';

interface PermissionSelectorProps {
  selectedPermissions: string[];
  onPermissionsChange: (permissionIds: string[]) => void;
}

interface Permission {
  id: string;
  name: string;
  action: string;
  resource: string;
  description?: string;
  isActive: boolean;
}

export function PermissionSelector({
  selectedPermissions,
  onPermissionsChange,
}: PermissionSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: permissionsData, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getAll(),
  });

  const permissions = permissionsData?.data || [];

  // Group permissions by resource
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};

    permissions.forEach((permission: Permission) => {
      if (!groups[permission.resource]) {
        groups[permission.resource] = [];
      }
      groups[permission.resource].push(permission);
    });

    return groups;
  }, [permissions]);

  // Filter permissions based on search
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groupedPermissions;

    const filtered: Record<string, Permission[]> = {};

    Object.entries(groupedPermissions).forEach(([resource, perms]) => {
      const matchingPerms = perms.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.resource.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchingPerms.length > 0) {
        filtered[resource] = matchingPerms;
      }
    });

    return filtered;
  }, [groupedPermissions, searchQuery]);

  const handleToggle = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      onPermissionsChange(selectedPermissions.filter((id) => id !== permissionId));
    } else {
      onPermissionsChange([...selectedPermissions, permissionId]);
    }
  };

  const handleToggleResource = (resource: string) => {
    const resourcePermissions = groupedPermissions[resource] || [];
    const resourcePermissionIds = resourcePermissions.map((p) => p.id);
    const allSelected = resourcePermissionIds.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      // Deselect all from this resource
      onPermissionsChange(
        selectedPermissions.filter((id) => !resourcePermissionIds.includes(id))
      );
    } else {
      // Select all from this resource
      const newSelection = [
        ...selectedPermissions,
        ...resourcePermissionIds.filter((id) => !selectedPermissions.includes(id)),
      ];
      onPermissionsChange(newSelection);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">Loading permissions...</div>
      </div>
    );
  }

  const selectedCount = selectedPermissions.length;
  const totalCount = permissions.length;

  return (
    <div className="space-y-3">
      {/* Search and Summary */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 notion-input"
          />
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {selectedCount} / {totalCount} selected
        </Badge>
      </div>

      {/* Permissions List */}
      <div className="border border-border rounded-md max-h-96 overflow-y-auto notion-scrollbar">
        {Object.keys(filteredGroups).length === 0 ? (
          <div className="text-center p-8 text-sm text-muted-foreground">
            No permissions found
          </div>
        ) : (
          Object.entries(filteredGroups).map(([resource, perms]) => {
            const resourcePermissionIds = perms.map((p) => p.id);
            const allSelected = resourcePermissionIds.every((id) =>
              selectedPermissions.includes(id)
            );
            const someSelected = resourcePermissionIds.some((id) =>
              selectedPermissions.includes(id)
            );

            return (
              <div key={resource} className="border-b border-border last:border-b-0">
                {/* Resource Header */}
                <div className="flex items-center gap-3 p-3 bg-accent/30 sticky top-0 z-10">
                  <Checkbox
                    checked={allSelected}
                    data-state={someSelected && !allSelected ? 'indeterminate' : undefined}
                    onCheckedChange={() => handleToggleResource(resource)}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm capitalize">{resource}</div>
                    <div className="text-xs text-muted-foreground">
                      {perms.filter((p) => selectedPermissions.includes(p.id)).length} of{' '}
                      {perms.length} selected
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="divide-y divide-border">
                  {perms.map((permission) => {
                    const isSelected = selectedPermissions.includes(permission.id);

                    return (
                      <div
                        key={permission.id}
                        className="flex items-start gap-3 p-3 hover:bg-accent/50 transition-colors group"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggle(permission.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{permission.name}</span>
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {permission.action}
                            </Badge>
                          </div>
                          {permission.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {permission.description}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
