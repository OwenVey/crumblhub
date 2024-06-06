import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-card border-gray-5 animate-pulse rounded-xl border', className)} {...props} />;
}
