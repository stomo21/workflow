import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Check, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { roleService } from '@/lib/api-client';
import { PermissionSelector } from './PermissionSelector';

interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  permissions?: any[];
}

interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  role?: Role | null;
}

export function RoleDialog({ open, onClose, role }: RoleDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!role;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        isActive: role.isActive ?? true,
      });
      setSelectedPermissions(role.permissions?.map((p) => p.id) || []);
    } else {
      setFormData({
        name: '',
        description: '',
        isActive: true,
      });
      setSelectedPermissions([]);
    }
  }, [role]);

  const createMutation = useMutation({
    mutationFn: (data: any) => roleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles-filters'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => roleService.update(role!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles-filters'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      permissionIds: selectedPermissions,
    };

    if (isEditing) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl notion-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-primary" />
            {isEditing ? 'Edit Role' : 'Create New Role'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Admin, Manager, Viewer"
                required
                className="notion-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe what this role is for..."
                rows={3}
                className="notion-input resize-none"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-md bg-accent/30">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  Active Status
                </Label>
                <p className="text-xs text-muted-foreground">
                  Inactive roles cannot be assigned to users
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Permissions</Label>
            <p className="text-xs text-muted-foreground">
              Select the permissions this role should have
            </p>
            <PermissionSelector
              selectedPermissions={selectedPermissions}
              onPermissionsChange={setSelectedPermissions}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="notion-button notion-button-secondary"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name}
              className="notion-button notion-button-primary"
            >
              <Check className="h-4 w-4" />
              {isEditing ? 'Update' : 'Create'} Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
