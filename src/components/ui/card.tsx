import * as React from 'react';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  return <Comp ref={ref} className={cn('border-gray-4 bg-card rounded-xl border p-4', className)} {...props} />;
});
Card.displayName = 'Card';

export { Card };
