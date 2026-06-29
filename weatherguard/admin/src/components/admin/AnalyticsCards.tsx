import { Users, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface AnalyticsCardsProps {
  stats: {
    totalUsers: number;
    pendingUsers: number;
    approvedUsers: number;
    rejectedUsers: number;
    telegramConnectedUsers: number;
    alertsSentToday: number;
  };
}

export function AnalyticsCards({ stats }: AnalyticsCardsProps) {
  const cards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { title: 'Pending Approval', value: stats.pendingUsers, icon: Clock, color: 'text-yellow-500' },
    { title: 'Approved Users', value: stats.approvedUsers, icon: CheckCircle, color: 'text-green-500' },
    { title: 'Telegram Connected', value: stats.telegramConnectedUsers, icon: Users, color: 'text-indigo-500' },
    { title: 'Alerts Sent Today', value: stats.alertsSentToday, icon: CheckCircle, color: 'text-teal-500' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
