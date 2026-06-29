import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types/auth';
import { LoadingState } from '../shared/LoadingState';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><LoadingState /></div>;
  }

  if (user?.role !== Role.ADMIN) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
