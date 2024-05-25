import { Skeleton } from '@/components/Skeleton';
import { range } from '@/utils';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <ul className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {range(300).map((i) => (
        <Skeleton key={i} className="h-[277px]" />
      ))}
    </ul>
  );
}
