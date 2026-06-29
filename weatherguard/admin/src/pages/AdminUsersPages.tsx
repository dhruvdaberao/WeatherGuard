import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { UserTable } from '../components/admin/UserTable';
import { SearchBar } from '../components/admin/SearchBar';

interface AdminUsersViewProps {
  title: string;
  description: string;
  statusEndpoint: string;
}

export function AdminUsersView({ title, description, statusEndpoint }: AdminUsersViewProps) {
  const [search, setSearch] = useState('');
  const [telegramFilter, setTelegramFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', statusEndpoint, search, telegramFilter, page],
    queryFn: async () => {
      const endpoint = statusEndpoint ? `/admin/users/${statusEndpoint}` : '/admin/users';
      const res = await api.get(`${endpoint}?search=${search}&telegram=${telegramFilter}&page=${page}&limit=${limit}`);
      return res.data;
    },
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center gap-6 mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="w-full flex gap-4 max-w-2xl mx-auto">
          <div className="flex-1">
            <SearchBar onSearch={(val) => { setSearch(val); setPage(1); }} />
          </div>
          <select 
            value={telegramFilter}
            onChange={(e) => { setTelegramFilter(e.target.value); setPage(1); }}
            className="rounded-full border border-input bg-background px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Telegram</option>
            <option value="connected">Connected</option>
            <option value="unconnected">Unconnected</option>
          </select>
        </div>
      </div>

      <UserTable users={data?.data || []} isLoading={isLoading} />

      {/* Pagination */}
      {!isLoading && data?.total > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} users
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-muted"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-muted"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapping for the specific pages requested
export const AllUsersPage = () => <AdminUsersView title="All Users" description="Manage all users on the platform." statusEndpoint="" />;
export const PendingUsersPage = () => <AdminUsersView title="Pending Approvals" description="Users waiting for access." statusEndpoint="pending" />;
export const ApprovedUsersPage = () => <AdminUsersView title="Approved Users" description="Active users receiving alerts." statusEndpoint="approved" />;
export const RejectedUsersPage = () => <AdminUsersView title="Rejected Users" description="Users who were denied access." statusEndpoint="rejected" />;
