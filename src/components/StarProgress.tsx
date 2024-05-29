import { cn, formatNumber, range } from '@/lib/utils';
import { StarIcon } from '@heroicons/react/20/solid';

interface StarProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  averageRating: number;
  totalReviews: number;
}

export function StarProgress({ className, averageRating, totalReviews }: StarProgressProps) {
  return (
    <div className={cn(className, 'flex items-center gap-2')}>
      <div className="relative">
        <div className="absolute w-[100px]">
          <div className="overflow-hidden" style={{ width: `${(averageRating / 5) * 100}%` }}>
            <div className="flex text-gray-950 dark:text-white w-[100px]">
              {range(5).map((i) => (
                <StarIcon key={i} className="size-5" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex text-gray-300 dark:text-gray-700">
          {range(5).map((i) => (
            <StarIcon key={i} className="size-5" />
          ))}
        </div>
      </div>

      <div className="flex items-center mt-1 font-medium">
        <div className="text-xs">{averageRating} Avg</div>
        <span>⋅</span>
        <div className="text-xs">{formatNumber(totalReviews)} Reviews</div>
      </div>
    </div>
  );
}
