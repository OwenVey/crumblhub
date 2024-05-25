import { Skeleton } from '@/components/Skeleton';
import { range } from '@/utils';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <ul className="flex flex-col gap-4">
      {range(300).map((i) => (
        <Skeleton key={i} className="h-[544px] sm:h-[412px] lg:h-[256px]" />
      ))}
    </ul>
  );
}
