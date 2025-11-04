import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import {
  Users,
  Shield,
  UsersRound,
  Key,
  CheckSquare,
  GitBranch,
  AlertTriangle,
  ClipboardList,
  FileCheck,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'RBAC',
    children: [
      { name: 'Users', href: '/users', icon: Users },
      { name: 'Roles', href: '/roles', icon: Shield },
      { name: 'Groups', href: '/groups', icon: UsersRound },
      { name: 'Permissions', href: '/permissions', icon: Key },
    ],
  },
  {
    name: 'Workflow',
    children: [
      { name: 'Approvals', href: '/approvals', icon: CheckSquare },
      { name: 'Patterns', href: '/patterns', icon: GitBranch },
      { name: 'Exceptions', href: '/exceptions', icon: AlertTriangle },
      { name: 'Claims', href: '/claims', icon: ClipboardList },
      { name: 'Decisions', href: '/decisions', icon: FileCheck },
    ],
  },
  { name: 'Admin Settings', href: '/admin', icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r bg-card">
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-xl font-bold">Workflow Manager</h1>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                    {item.name}
                  </div>
                  {item.children.map((child) => {
                    const Icon = child.icon;
                    const isActive = location.pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        to={child.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <Link
                  key={item.href}
                  to={item.href!}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    location.pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b bg-card px-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                {navigation
                  .flatMap((item) => (item.children ? item.children : [item]))
                  .find((item) => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            <UserButton afterSignOutUrl="/login" />
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
