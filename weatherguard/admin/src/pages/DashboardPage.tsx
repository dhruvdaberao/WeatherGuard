import { useAuth } from '../hooks/useAuth';
import { Status } from '../types/auth';
import { PendingApprovalPage } from './PendingApprovalPage';
import { ApprovedPage } from './ApprovedPage';
import { RejectedPage } from './RejectedPage';
import { LoadingState } from '../components/shared/LoadingState';

export function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><LoadingState /></div>;
  }

  switch (user.status) {
    case Status.PENDING:
      return <PendingApprovalPage />;
    case Status.APPROVED:
      return <ApprovedPage />;
    case Status.REJECTED:
      return <RejectedPage />;
    default:
      return <PendingApprovalPage />;
  }
}

