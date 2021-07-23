import { useEffect, useState } from 'react';
import { Storage } from '../backgound';

export const useKeys = () => {
  const [keys, setKeys] = useState<any[]>();

  useEffect(() => {
    const getAllDbKeys = async () => {
      const keys = await Storage.getAllKeys();

      setKeys(keys);
    };

    getAllDbKeys();
  }, []);

  return keys;
};
