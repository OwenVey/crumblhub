import { cn } from '@/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export function Badge({ children, className }: BadgeProps) {
  return <div className={cn('rounded-md bg-pink px-1.5 py-1 text-xs font-semibold', className)}>{children}</div>;
}
