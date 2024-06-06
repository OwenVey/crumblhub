'use client';

import { formatDistance } from 'date-fns';
import { useEffect, useState } from 'react';

export function TimeUpdated({ buildDate }: { buildDate: Date }) {
  const [timeDistance, setTimeDistance] = useState('');

  useEffect(() => {
    const updateTimeDistance = () =>
      setTimeDistance(formatDistance(buildDate, new Date(), { addSuffix: true, includeSeconds: true }));

    updateTimeDistance();

    const distanceInterval = setInterval(updateTimeDistance, 1000);

    return () => clearInterval(distanceInterval);
  }, [buildDate]);

  return <div className="text-gray-11 text-sm">Updated {timeDistance || '...'}</div>;
}
