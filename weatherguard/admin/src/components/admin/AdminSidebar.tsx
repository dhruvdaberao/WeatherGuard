import { Link, useLocation } from 'react-router-dom';
import { PieChart, Users, Clock, CheckCircle, XCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Logo } from '../shared/Logo';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const location = useLocation();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: PieChart },
    { to: '/admin/users', label: 'All Users', icon: Users },
    { to: '/admin/pending', label: 'Pending', icon: Clock },
    { to: '/admin/approved', label: 'Approved', icon: CheckCircle },
    { to: '/admin/rejected', label: 'Rejected', icon: XCircle },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 border-r bg-card min-h-screen p-4 flex flex-col gap-2 transform transition-transform duration-200 ease-in-out md:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="text-slate-900 dark:text-slate-100 w-10 h-10 drop-shadow-sm shrink-0" />
            <div>
              <h2 className="text-xl font-bubble font-bold tracking-tight whitespace-nowrap">
                <span className="text-secondary drop-shadow-sm">WEATHER</span>
                <span className="text-primary mx-1">-</span>
                <span className="text-primary drop-shadow-sm">GUARD</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Admin Portal</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
    </>
  );
}
