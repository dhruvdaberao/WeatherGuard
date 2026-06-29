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

  if (isAdmin) {
    return (
      <div className={cn("flex items-center justify-end gap-1 sm:gap-2", variant === 'card' ? "p-4" : "py-2")}>
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={onLogout} className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0 whitespace-nowrap px-2 sm:px-3">
          <LogOut className="w-5 h-5 shrink-0" strokeWidth={2.25} />
          <span className="hidden sm:inline font-medium">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
      variant === 'card' ? "bg-card rounded-xl border border-blue-200/80 dark:border-blue-800/50 p-4 sm:p-5 shadow-md hover:shadow-lg transition-shadow duration-300" : "py-2"
    )}>
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
        <Button variant="ghost" size="sm" onClick={onLogout} className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0 whitespace-nowrap ml-auto sm:ml-0">
          <LogOut className="w-5 h-5 shrink-0" strokeWidth={2.25} />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
