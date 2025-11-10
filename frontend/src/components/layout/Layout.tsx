import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Sparkles,
} from 'lucide-react';
import { SidebarNotion, SidebarNotionItem } from '@/components/notion';

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
  { name: 'Notion Demo', href: '/notion-demo', icon: Sparkles },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Convert navigation to SidebarNotionItem format
  const sidebarItems: SidebarNotionItem[] = navigation.map((item) => {
    if (item.children) {
      return {
        id: item.name,
        label: item.name,
        children: item.children.map((child) => ({
          id: child.href,
          label: child.name,
          icon: <child.icon className="h-4 w-4" />,
          href: child.href,
          active: location.pathname === child.href,
        })),
      };
    }

    const Icon = item.icon!;
    return {
      id: item.href!,
      label: item.name,
      icon: <Icon className="h-4 w-4" />,
      href: item.href,
      active: location.pathname === item.href,
    };
  });

  const handleItemClick = (item: SidebarNotionItem) => {
    if (item.href) {
      navigate(item.href);
    }
  };

  const currentPageTitle = navigation
    .flatMap((item) => (item.children ? item.children : [item]))
    .find((item) => item.href === location.pathname)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen">
        {/* Sidebar with custom header */}
        <SidebarNotion
          items={sidebarItems}
          header={
            <div className="flex items-center gap-2 px-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                W
              </div>
              <span className="text-sm font-semibold text-gray-900">Workflow</span>
            </div>
          }
          footer={
            <div className="flex items-center gap-2 px-2 py-2 text-sm text-gray-600">
              <UserButton
                afterSignOutUrl="/login"
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                  },
                }}
              />
            </div>
          }
        />

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentPageTitle}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <UserButton
                afterSignOutUrl="/login"
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                  },
                }}
              />
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-white p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
