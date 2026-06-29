import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { AnalyticsCards } from '../components/admin/AnalyticsCards';
import { UserTable } from '../components/admin/UserTable';
import { AdminSidebar } from '../components/admin/AdminSidebar';

export function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard/stats');
      return res.data;
    },
  });

  const { data: recentUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', 'recent'],
    queryFn: async () => {
      const res = await api.get('/admin/users?limit=5');
      return res.data.data; // service returns { data, total }
    },
  });

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground mt-1">Metrics and recent platform activity.</p>
          </div>

          {!statsLoading && stats && <AnalyticsCards stats={stats} />}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Recent Users</h2>
            <UserTable users={recentUsers || []} isLoading={usersLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}
