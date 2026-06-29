import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { LogOut, Settings } from 'lucide-react';
import { RequestStatusCard } from '../components/preferences/RequestStatusCard';
import { Status } from '../types/auth';

export function ApprovedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">WeatherGuard Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="ghost" onClick={logout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <RequestStatusCard status={Status.APPROVED} />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow space-y-4">
            <h3 className="font-semibold text-lg tracking-tight">Your Preferences</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Alert City</span>
                <span className="font-medium">{user?.city || 'Not set'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Alert Types</span>
                <span className="font-medium text-right max-w-[200px]">
                  {user?.weatherPreferences?.length ? user.weatherPreferences.join(', ') : 'None selected'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-dashed bg-card/50 text-card-foreground shadow-sm flex items-center justify-center text-center">
             <div>
               <h3 className="font-semibold text-muted-foreground mb-2">Telegram Integration</h3>
               <p className="text-sm text-muted-foreground">Connect your Telegram account to start receiving active weather alerts.</p>
               <Button className="mt-4" variant="secondary">Connect Telegram</Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
