import { Status } from '../../types/auth';
import { cn } from '../../utils/cn';

export function StatusBadge({ status }: { status: Status }) {
  const styles = {
    [Status.PENDING]: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    [Status.APPROVED]: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    [Status.REJECTED]: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  };

  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap shadow-sm', styles[status])}>
      {status}
    </span>
  );
}
