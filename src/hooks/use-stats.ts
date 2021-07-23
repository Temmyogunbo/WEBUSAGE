import { useEffect, useState } from 'react';
import { IStats } from '../types';
import { Storage } from '../backgound';

export const useStats = (key: string) => {
  const [stats, setStats] = useState<IStats>();

  useEffect(() => {
    const getStats = async () => {
      if (key) {
        const stats = await Storage.getStats(key);

        setStats(stats);
      }
    };

    getStats();
  }, [key]);

  return stats;
};
