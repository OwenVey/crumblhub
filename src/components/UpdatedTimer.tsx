'use client';

import { formatDistance } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

export function UpdatedTimer({ buildDate }: { buildDate: Date }) {
  const getUpdatedDistance = useCallback(
    () => formatDistance(buildDate, new Date(), { addSuffix: true, includeSeconds: true }),
    [buildDate],
  );

  const [updatedDistance, setUpdatedDistance] = useState('');

  useEffect(() => {
    setUpdatedDistance(getUpdatedDistance());

    const interval = setInterval(() => {
      setUpdatedDistance(getUpdatedDistance());
    }, 1000);

    return () => clearInterval(interval);
  }, [getUpdatedDistance]);

  return <span className="text-gray-11 text-sm">Updated {updatedDistance || '...'}</span>;
}
