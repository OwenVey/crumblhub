import { Skeleton } from '@/components/ui/skeleton';
import { range } from '@/lib/utils';

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-[60px]" />
      <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {range(300).map((i) => (
          <Skeleton key={i} className="h-[347px]" />
        ))}
      </ul>
    </div>
  );
}
