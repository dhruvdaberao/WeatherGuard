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
        <header className="h-20 border-b bg-card flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold tracking-tight">Admin Console</h1>
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
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
