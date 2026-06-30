import type { User } from '../../types/auth';
import { Status } from '../../types/auth';
import { StatusBadge } from './StatusBadge';
import { Button } from '../ui/Button';
import { Check, X, SearchX, CheckCircle2, XCircle } from 'lucide-react';
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
      <div className="flex sm:hidden items-center justify-between px-3.5 py-2 bg-primary/10 text-primary text-[11px] font-bold border-b border-primary/20">
        <span>👈 Swipe table horizontally to view Status & Actions 👉</span>
        <span className="animate-pulse">↔️</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 text-muted-foreground whitespace-nowrap">
            <tr>
              <th className="px-3.5 py-3 sm:px-6 sm:py-4 font-medium">User</th>
              <th className="px-3.5 py-3 sm:px-6 sm:py-4 font-medium text-center">Role</th>
              <th className="px-3.5 py-3 sm:px-6 sm:py-4 font-medium text-center">Status</th>
              <th className="px-3.5 py-3 sm:px-6 sm:py-4 font-medium text-center">Telegram</th>
              <th className="px-3.5 py-3 sm:px-6 sm:py-4 font-medium text-center">Joined</th>
              <th className="px-3.5 py-3 sm:px-6 sm:py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => {
              const userId = (user as any)._id || user.id;
              return (
              <tr key={userId} className="hover:bg-muted/30 transition-colors">
                <td className="px-3.5 py-3 sm:px-6 sm:py-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted shrink-0 flex-none object-cover aspect-square" />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 flex-none aspect-square">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-foreground text-xs sm:text-sm">{user.name}</div>
                      <div className="text-[11px] sm:text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3.5 py-3 sm:px-6 sm:py-4 text-muted-foreground text-xs sm:text-sm text-center">{user.role}</td>
                <td className="px-3.5 py-3 sm:px-6 sm:py-4 flex justify-center">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-3.5 py-3 sm:px-6 sm:py-4 text-center">
                  {user.telegramConnected ? (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 whitespace-nowrap shadow-sm">
                      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 whitespace-nowrap shadow-sm">
                      <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      Not Connected
                    </span>
                  )}
                </td>
                <td className="px-3.5 py-3 sm:px-6 sm:py-4 text-muted-foreground text-xs sm:text-sm whitespace-nowrap text-center">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3.5 py-3 sm:px-6 sm:py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                    {user.status !== Status.APPROVED && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 sm:h-8 px-2 sm:px-3 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                        onClick={() => approveMutation.mutate(userId)}
                        disabled={approveMutation.isPending}
                      >
                        <Check className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                    )}
                    {user.status !== Status.REJECTED && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 sm:h-8 px-2 sm:px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => rejectMutation.mutate(userId)}
                        disabled={rejectMutation.isPending}
                      >
                        <X className="w-3.5 h-3.5 mr-1" /> Reject
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
