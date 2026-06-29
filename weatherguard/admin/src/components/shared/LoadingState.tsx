import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function LoadingState({ className, message = 'Loading...', ...props }: LoadingStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center p-8 text-muted-foreground', className)}
      {...props}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
