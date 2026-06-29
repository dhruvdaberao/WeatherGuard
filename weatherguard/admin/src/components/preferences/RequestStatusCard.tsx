import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Status } from '../../types/auth';

interface RequestStatusCardProps {
  status: Status;
}

export function RequestStatusCard({ status }: RequestStatusCardProps) {
  const config = {
    [Status.PENDING]: {
      icon: Clock,
      title: 'Approval Pending',
      description: 'Your account is currently under review by an administrator.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    [Status.APPROVED]: {
      icon: CheckCircle2,
      title: 'Account Approved',
      description: 'You have full access to WeatherGuard alerts.',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    [Status.REJECTED]: {
      icon: XCircle,
      title: 'Access Denied',
      description: 'Your request for access has been declined.',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
    },
  };

  const current = config[status] || config[Status.PENDING];
  const Icon = current.icon;

  return (
    <Card className={`border ${current.borderColor} shadow-md hover:shadow-lg transition-shadow duration-300`}>
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <div className={`p-3 rounded-full ${current.bgColor}`}>
          <Icon className={`w-6 h-6 ${current.color}`} />
        </div>
        <div>
          <CardTitle className="text-lg">{current.title}</CardTitle>
          <CardDescription>{current.description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
