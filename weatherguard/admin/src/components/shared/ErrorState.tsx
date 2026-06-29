import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  className, 
  title = 'Something went wrong', 
  message = 'An error occurred while fetching the data. Please try again later.', 
  onRetry,
  ...props 
}: ErrorStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center p-12 text-center rounded-xl border border-destructive/20 bg-destructive/5', className)}
      {...props}
    >
      <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
      <h3 className="text-lg font-semibold tracking-tight text-destructive">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
