import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-200 bg-white hover:border-gray-300 px-3 py-2 text-sm focus-visible:ring-gray-950 focus-visible:border-gray-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-gray-800 dark:hover:border-gray-700 dark:bg-gray-900 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-50 dark:focus-visible:border-gray-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };