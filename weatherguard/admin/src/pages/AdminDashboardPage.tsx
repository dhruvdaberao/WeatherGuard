import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { AnalyticsCards } from '../components/admin/AnalyticsCards';
import { UserTable } from '../components/admin/UserTable';
import { Button } from '../components/ui/Button';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

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

  const broadcastMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/admin/test-alert/broadcast');
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Broadcast sent to ${data.sentCount} users!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to broadcast test alert');
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Metrics and recent platform activity.</p>
        </div>
        <Button 
          onClick={() => broadcastMutation.mutate()} 
          disabled={broadcastMutation.isPending}
          className="gap-2 shadow-sm"
        >
          <Send className="w-4 h-4" />
          {broadcastMutation.isPending ? 'Sending...' : 'Broadcast Test Alert'}
        </Button>
      </div>

      {!statsLoading && stats && <AnalyticsCards stats={stats} />}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Users</h2>
        <UserTable users={recentUsers || []} isLoading={usersLoading} />
      </div>
    </div>
  );
}
