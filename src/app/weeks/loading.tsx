import { Skeleton } from '@/components/ui/skeleton';
import { range } from '@/lib/utils';

export default function Loading() {
  return (
    <ul className="flex flex-col gap-4">
      {range(300).map((i) => (
        <Skeleton key={i} className="h-[570px] sm:h-[414px] lg:h-[234px]" />
      ))}
    </ul>
  );
}
