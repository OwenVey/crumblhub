import { Skeleton } from '@/components/Skeleton';
import { range } from '@/lib/utils';

export default function Loading() {
  return (
    <ul className="flex flex-col gap-4">
      {range(300).map((i) => (
        <Skeleton key={i} className="h-[544px] sm:h-[412px] lg:h-[256px]" />
      ))}
    </ul>
  );
}
