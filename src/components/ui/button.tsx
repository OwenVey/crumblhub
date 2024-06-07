import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center focus-visible:border-gray-12 whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring focus-visible:ring-gray-12 disabled:pointer-events-none disabled:opacity-50 cursor-pointer focus-visible:z-10',
  {
    variants: {
      variant: {
        default: 'bg-gray-12 text-gray-1 hover:bg-gray-12/80',
        secondary: 'bg-gray-5 text-gray-12 hover:bg-gray-7',
        outline: 'border border-gray-6 bg-card text-gray-12 hover:bg-gray-2 hover:border-gray-7',
        ghost: 'text-gray-12 hover:bg-gray-5',
        link: 'text-gray-12 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
