import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <ShieldAlert className="w-16 h-16 text-destructive mb-6" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Access Denied</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        You do not have the required permissions to access this page. Please contact your administrator if you believe this is a mistake.
      </p>
      <Button onClick={() => navigate('/dashboard')} variant="default">
        Return to Dashboard
      </Button>
    </div>
  );
}
