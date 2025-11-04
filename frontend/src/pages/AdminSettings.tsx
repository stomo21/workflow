export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Configure RBAC and system settings</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">RBAC Configuration</h2>
          <p className="text-muted-foreground">
            Configure role-based access control settings, including default roles, permissions, and security policies.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Workflow Settings</h2>
          <p className="text-muted-foreground">
            Configure workflow patterns, approval processes, and exception handling rules.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">System Settings</h2>
          <p className="text-muted-foreground">
            Configure system-wide settings including notifications, email templates, and integrations.
          </p>
        </div>
      </div>
    </div>
  );
}
