import { useAuth } from '../hooks/useAuth';
import { RequestStatusCard } from '../components/preferences/RequestStatusCard';
import { Status } from '../types/auth';
import { Button } from '../components/ui/Button';
import { LogOut } from 'lucide-react';

export function RejectedPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="max-w-md w-full space-y-6">
        <RequestStatusCard status={Status.REJECTED} />
        
        <p className="text-muted-foreground">
          If you believe this is a mistake or your circumstances have changed, please contact our support team.
        </p>

        <Button onClick={logout} variant="outline" className="w-full gap-2">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
