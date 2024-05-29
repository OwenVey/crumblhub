import { Skeleton } from '@/components/ui/Skeleton';
import { range } from '@/lib/utils';

export default function Loading() {
  return (
    <ul className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {range(300).map((i) => (
        <Skeleton key={i} className="h-[277px]" />
      ))}
    </ul>
  );
}
