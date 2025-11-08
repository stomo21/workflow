import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Check, Lock } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { permissionService } from '@/lib/api-client';

interface Permission {
  id: string;
  name: string;
  description?: string;
  action: string;
  resource: string;
  isActive: boolean;
}

interface PermissionDialogProps {
  open: boolean;
  onClose: () => void;
  permission?: Permission | null;
}

const commonActions = ['create', 'read', 'update', 'delete', 'manage', 'view', 'edit'];
const commonResources = ['user', 'role', 'permission', 'group', 'approval', 'pattern', 'exception', 'claim', 'decision'];

export function PermissionDialog({ open, onClose, permission }: PermissionDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!permission;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    action: '',
    resource: '',
    isActive: true,
  });

  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name || '',
        description: permission.description || '',
        action: permission.action || '',
        resource: permission.resource || '',
        isActive: permission.isActive ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        action: '',
        resource: '',
        isActive: true,
      });
    }
  }, [permission]);

  const createMutation = useMutation({
    mutationFn: (data: any) => permissionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permissions-filters'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => permissionService.update(permission!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permissions-filters'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl notion-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5 text-primary" />
            {isEditing ? 'Edit Permission' : 'Create New Permission'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="e.g., Create Users, Manage Approvals"
                required
                className="notion-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="action" className="text-sm font-medium">
                  Action <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.action}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, action: value }))
                  }
                  required
                >
                  <SelectTrigger className="notion-input">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonActions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource" className="text-sm font-medium">
                  Resource <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.resource}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, resource: value }))
                  }
                  required
                >
                  <SelectTrigger className="notion-input">
                    <SelectValue placeholder="Select resource" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonResources.map((resource) => (
                      <SelectItem key={resource} value={resource}>
                        {resource}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                <strong>Permission format:</strong> {formData.action && formData.resource
                  ? `${formData.action}:${formData.resource}`
                  : 'action:resource'}
              </p>
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
                placeholder="Describe what this permission allows..."
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
                  Inactive permissions are not enforced
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
              disabled={isLoading || !formData.name || !formData.action || !formData.resource}
              className="notion-button notion-button-primary"
            >
              <Check className="h-4 w-4" />
              {isEditing ? 'Update' : 'Create'} Permission
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
