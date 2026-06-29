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
      <div className={cn("flex items-center justify-end gap-2", variant === 'card' ? "p-4" : "py-2")}>
        <ThemeToggle />
        <Button variant="ghost" onClick={onLogout} className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0 whitespace-nowrap">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center justify-between",
      variant === 'card' ? "bg-card rounded-xl border border-blue-200/80 dark:border-blue-800/50 p-4 shadow-md hover:shadow-lg transition-shadow duration-300" : "py-2"
    )}>
      <div className="flex items-center gap-4">
        <img 
          src={avatar || `https://unavatar.io/${email}?fallback=https://ui-avatars.com/api/?name=${name?.replace(/ undefined/g, '') || 'U'}&background=random`} 
          alt={name}
          className="w-12 h-12 rounded-full object-cover shadow-sm border border-border"
        />
        <div>
            <h2 className="font-semibold text-lg tracking-tight leading-none truncate max-w-[200px]">
              {name?.replace(/ undefined/g, '')}
            </h2>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" onClick={onLogout} className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0 whitespace-nowrap">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
