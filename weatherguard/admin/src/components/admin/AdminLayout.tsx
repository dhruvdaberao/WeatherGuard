import { useState, type ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { UserProfileCard } from '../shared/UserProfileCard';
import { useAuth } from '../../hooks/useAuth';
import { Menu } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 sm:h-20 border-b bg-card flex items-center justify-between px-3 sm:px-8 shrink-0 gap-2 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Button variant="ghost" size="icon" className="md:hidden shrink-0 h-9 w-9" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight truncate">Admin Console</h1>
          </div>
          <div className="shrink-0 flex items-center justify-end">
            <UserProfileCard
              name={user?.name || 'Administrator'}
              email={user?.email || 'admin@weatherguard.local'}
              avatar={user?.avatar}
              role="ADMIN"
              onLogout={logout}
              variant="navbar"
            />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
