import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { UserTable } from '../components/admin/UserTable';
import { SearchBar } from '../components/admin/SearchBar';
import { Status } from '../types/auth';

interface AdminUsersViewProps {
  title: string;
  description: string;
  statusEndpoint: string;
}

export function AdminUsersView({ title, description, statusEndpoint }: AdminUsersViewProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', statusEndpoint, search, page],
    queryFn: async () => {
      const endpoint = statusEndpoint ? `/admin/users/${statusEndpoint}` : '/admin/users';
      const res = await api.get(`${endpoint}?search=${search}&page=${page}&limit=${limit}`);
      return res.data;
    },
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground mt-1">{description}</p>
            </div>
            <SearchBar onSearch={(val) => { setSearch(val); setPage(1); }} />
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
      </main>
    </div>
  );
}

// Wrapping for the specific pages requested
export const AllUsersPage = () => <AdminUsersView title="All Users" description="Manage all users on the platform." statusEndpoint="" />;
export const PendingUsersPage = () => <AdminUsersView title="Pending Approvals" description="Users waiting for access." statusEndpoint="pending" />;
export const ApprovedUsersPage = () => <AdminUsersView title="Approved Users" description="Active users receiving alerts." statusEndpoint="approved" />;
export const RejectedUsersPage = () => <AdminUsersView title="Rejected Users" description="Users who were denied access." statusEndpoint="rejected" />;
