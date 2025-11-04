import { useQuery } from '@tanstack/react-query';
import { Users, Shield, CheckSquare, AlertTriangle } from 'lucide-react';
import { userService, roleService, approvalService, exceptionService } from '@/lib/api-client';

export default function Dashboard() {
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll({ limit: 1 }),
  });

  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getAll({ limit: 1 }),
  });

  const { data: approvalsData } = useQuery({
    queryKey: ['approvals'],
    queryFn: () => approvalService.getAll({ limit: 1 }),
  });

  const { data: exceptionsData } = useQuery({
    queryKey: ['exceptions'],
    queryFn: () => exceptionService.getAll({ limit: 1 }),
  });

  const stats = [
    {
      name: 'Total Users',
      value: usersData?.total || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Roles',
      value: rolesData?.total || 0,
      icon: Shield,
      color: 'bg-green-500',
    },
    {
      name: 'Pending Approvals',
      value: approvalsData?.total || 0,
      icon: CheckSquare,
      color: 'bg-yellow-500',
    },
    {
      name: 'Open Exceptions',
      value: exceptionsData?.total || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your workflow management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <p className="text-muted-foreground">Activity feed coming soon...</p>
      </div>
    </div>
  );
}
