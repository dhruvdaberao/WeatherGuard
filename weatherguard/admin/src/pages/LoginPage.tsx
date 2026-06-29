import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { GitHubLoginButton } from '../components/auth/GitHubLoginButton';
import { CloudLightning } from 'lucide-react';

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Let ProtectedRoute or a top-level loader handle this if needed, or just blank during brief check
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-border/50">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
            <CloudLightning className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">WeatherGuard</CardTitle>
            <CardDescription className="text-base">
              Secure weather alerts delivered to Telegram.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleLoginButton />
          <GitHubLoginButton />
          
          <div className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
