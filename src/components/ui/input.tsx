import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'border-gray-6 bg-card hover:border-gray-7 focus-visible:ring-gray-12 focus-visible:border-gray-12 placeholder:text-gray-10 flex h-10 w-full rounded-lg border py-2 px-3 text-sm outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
