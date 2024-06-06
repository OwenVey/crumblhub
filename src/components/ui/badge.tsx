import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export function Badge({ children, className }: BadgeProps) {
  return (
    <div className={cn('bg-pink rounded-md py-1 px-2 text-xs font-semibold text-black', className)}>{children}</div>
  );
}
