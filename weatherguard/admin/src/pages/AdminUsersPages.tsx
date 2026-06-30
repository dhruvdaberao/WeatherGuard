import { useState, useCallback } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
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

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', statusEndpoint, search, telegramFilter, page],
    queryFn: async () => {
      const endpoint = statusEndpoint ? `/admin/users/${statusEndpoint}` : '/admin/users';
      const res = await api.get(`${endpoint}?search=${search}&telegram=${telegramFilter}&page=${page}&limit=${limit}`);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center gap-6 mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto items-center justify-between">
          <div className="w-full sm:flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex items-center gap-1 bg-muted/60 p-1.5 rounded-2xl border border-border/60 w-full sm:w-auto justify-center shrink-0 shadow-sm">
            <button
              type="button"
              onClick={() => { setTelegramFilter('all'); setPage(1); }}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                telegramFilter === 'all'
                  ? 'bg-background text-foreground shadow scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
              }`}
            >
              All Telegram
            </button>
            <button
              type="button"
              onClick={() => { setTelegramFilter('connected'); setPage(1); }}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                telegramFilter === 'connected'
                  ? 'bg-[#229ED9] text-white shadow scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
              }`}
            >
              Connected
            </button>
            <button
              type="button"
              onClick={() => { setTelegramFilter('unconnected'); setPage(1); }}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                telegramFilter === 'unconnected'
                  ? 'bg-amber-500 text-white shadow scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
              }`}
            >
              Unconnected
            </button>
          </div>
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
              onClick={() => {
                setPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-1.5 text-sm font-medium border border-border rounded-xl disabled:opacity-40 hover:bg-muted transition-all active:scale-95 shadow-sm"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => {
                setPage(p => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-1.5 text-sm font-medium border border-border rounded-xl disabled:opacity-40 hover:bg-muted transition-all active:scale-95 shadow-sm"
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
