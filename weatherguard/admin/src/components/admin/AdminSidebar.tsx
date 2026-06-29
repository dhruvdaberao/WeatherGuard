import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export function AdminSidebar() {
  const location = useLocation();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'All Users', icon: Users },
    { to: '/admin/pending', label: 'Pending', icon: Clock },
    { to: '/admin/approved', label: 'Approved', icon: CheckCircle },
    { to: '/admin/rejected', label: 'Rejected', icon: XCircle },
  ];

  return (
    <aside className="w-64 border-r bg-card min-h-screen p-4 flex flex-col gap-2">
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">WeatherGuard</h2>
        <p className="text-sm text-muted-foreground">Admin Portal</p>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
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
  );
}
