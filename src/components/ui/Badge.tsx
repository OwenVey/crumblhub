import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export function Badge({ children, className }: BadgeProps) {
  return (
    <div className={cn('bg-pink rounded-md px-2 text-black py-1 text-xs font-semibold', className)}>{children}</div>
  );
}
