import type { User } from '../../types/auth';
import { Status } from '../../types/auth';
import { StatusBadge } from './StatusBadge';
import { Button } from '../ui/Button';
import { Check, X, SearchX } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
}

export function UserTable({ users, isLoading }: UserTableProps) {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/admin/users/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('User approved successfully!');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/admin/users/${id}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('User rejected successfully!');
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading users...</div>;
  }

  if (users.length === 0) {
    return (
      <div className="p-16 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-6">
          <SearchX className="w-10 h-10 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-semibold mb-2">No users found</h3>
        <p className="text-muted-foreground max-w-sm">We couldn't find any users matching your current search or filter criteria. Try adjusting them.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 text-muted-foreground whitespace-nowrap">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium text-center">Role</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium text-center">Telegram</th>
              <th className="px-6 py-4 font-medium text-center">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => {
              const userId = (user as any)._id || user.id;
              return (
              <tr key={userId} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full bg-muted shrink-0 flex-none object-cover aspect-square" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 flex-none aspect-square">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground text-center">{user.role}</td>
                <td className="px-6 py-4 flex justify-center">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  {user.telegramConnected ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400">
                      Not Connected
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap text-center">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    {user.status !== Status.APPROVED && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                        onClick={() => approveMutation.mutate(userId)}
                        disabled={approveMutation.isPending}
                      >
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    )}
                    {user.status !== Status.REJECTED && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => rejectMutation.mutate(userId)}
                        disabled={rejectMutation.isPending}
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
