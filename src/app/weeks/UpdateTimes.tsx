'use client';

import { formatDistance, formatDistanceToNow, nextMonday } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

export function UpdateTimes({ buildDate }: { buildDate: Date }) {
  const getNewFlavorsDistance = useCallback(
    () => formatDistanceToNow(new Date(nextMonday(new Date()).setUTCHours(0, 0, 0, 0)), { addSuffix: true }),
    [],
  );

  const getUpdatedDistance = useCallback(
    () => formatDistance(buildDate, new Date(), { addSuffix: true, includeSeconds: true }),
    [buildDate],
  );

  const [newFlavorsDistance, setNewFlavorsDistance] = useState(getNewFlavorsDistance());
  const [updatedDistance, setUpdatedDistance] = useState('');

  useEffect(() => {
    setUpdatedDistance(getUpdatedDistance());

    const interval = setInterval(() => {
      setNewFlavorsDistance(getNewFlavorsDistance());
      setUpdatedDistance(getUpdatedDistance());
    }, 1000);

    return () => clearInterval(interval);
  }, [getNewFlavorsDistance, getUpdatedDistance]);

  return (
    <div className="text-gray-11 flex justify-between text-sm">
      <span>New flavors {newFlavorsDistance}</span>
      <span>Updated {updatedDistance || '...'}</span>
    </div>
  );
}
