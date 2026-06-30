import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { ThemeToggle } from './ThemeToggle';

interface UserProfileCardProps {
  name: string;
  email: string;
  avatar?: string;
  role: string;
  onLogout: () => void;
  variant?: 'card' | 'navbar';
}

export function UserProfileCard({ name, email, avatar, role, onLogout, variant = 'card' }: UserProfileCardProps) {
  const isAdmin = role === 'ADMIN';
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logoutModal = showLogoutModal && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md p-6 rounded-3xl border border-border/80 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20 shadow-sm">
            <LogOut className="w-6 h-6 ml-0.5" strokeWidth={2.25} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">Sign Out Confirmation</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Are you sure you want to end your active session?</p>
          </div>
        </div>

        <div className="bg-muted/60 p-3.5 rounded-2xl border border-border/50 text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
          You will be logged out and redirected to the login screen. You will need to re-authenticate to access your console or manage weather alerts.
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogoutModal(false)}
            className="px-4 py-2 h-9 rounded-xl font-semibold border-border hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setShowLogoutModal(false);
              onLogout();
            }}
            className="px-5 py-2 h-9 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            Yes, Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  if (isAdmin) {
    return (
      <div className={cn("flex items-center justify-end gap-1 sm:gap-2", variant === 'card' ? "p-4" : "py-2")}>
        {logoutModal}
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={() => setShowLogoutModal(true)} className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0 whitespace-nowrap px-2 sm:px-3">
          <LogOut className="w-5 h-5 shrink-0" strokeWidth={2.25} />
          <span className="hidden sm:inline font-medium">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative",
      variant === 'card' ? "bg-card rounded-xl border border-blue-200/80 dark:border-blue-800/50 p-4 sm:p-5 shadow-md hover:shadow-lg transition-shadow duration-300" : "py-2"
    )}>
      {logoutModal}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
        <img 
          src={avatar || `https://unavatar.io/${email}?fallback=https://ui-avatars.com/api/?name=${name?.replace(/ undefined/g, '') || 'U'}&background=random`} 
          alt={name}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm border border-border shrink-0"
        />
        <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-base sm:text-lg tracking-tight leading-none truncate">
              {name?.replace(/ undefined/g, '')}
            </h2>
          <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">{email}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={() => setShowLogoutModal(true)} className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0 whitespace-nowrap ml-auto sm:ml-0">
          <LogOut className="w-5 h-5 shrink-0" strokeWidth={2.25} />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
