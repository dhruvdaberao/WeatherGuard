import * as React from 'react';
import { FileQuestion } from 'lucide-react';
import { cn } from '../../utils/cn';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  className, 
  title = 'No Data Found', 
  description = 'There is currently no data to display here.', 
  icon = <FileQuestion className="h-10 w-10 text-muted-foreground mb-4" />,
  ...props 
}: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/50', className)}
      {...props}
    >
      {icon}
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">{description}</p>
    </div>
  );
}
