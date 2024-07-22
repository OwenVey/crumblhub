import { cn, formatNumber, range } from '@/lib/utils';
import { StarIcon } from 'lucide-react';

interface StarProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  averageRating: number;
  totalReviews: number;
}

export function StarProgress({ className, averageRating, totalReviews }: StarProgressProps) {
  return (
    <div className={cn(className, 'flex items-center gap-2')}>
      <div className="relative">
        <div className="absolute w-[80px]">
          <div className="overflow-hidden" style={{ width: `${(averageRating / 5) * 100}%` }}>
            <div className="text-gray-12 flex w-[80px]">
              {range(5).map((i) => (
                <StarIcon key={i} className="size-4" fill="currentColor" />
              ))}
            </div>
          </div>
        </div>

        <div className="text-gray-7 flex">
          {range(5).map((i) => (
            <StarIcon key={i} className="size-4" fill="currentColor" />
          ))}
        </div>
      </div>

      <div className="mt-1 flex items-center font-medium">
        <div className="text-xs">{averageRating} Avg</div>
        <span className="mx-0.5">⋅</span>
        <div className="text-xs">{formatNumber(totalReviews)} Reviews</div>
      </div>
    </div>
  );
}
