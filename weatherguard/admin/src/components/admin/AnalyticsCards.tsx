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
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Pending Approval', value: stats.pendingUsers, icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { title: 'Approved Users', value: stats.approvedUsers, icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { title: 'Telegram Connected', value: stats.telegramConnectedUsers, icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { title: 'Alerts Sent Today', value: stats.alertsSentToday, icon: CheckCircle, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow duration-200 border-border/60 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 gap-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground leading-tight">{card.title}</CardTitle>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${card.bg} ${card.color} shadow-sm`}>
                <Icon className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight text-foreground">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
