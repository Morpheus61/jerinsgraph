import { useState, useEffect } from 'react';
import { getGoogleSheetsData, initGoogleSheetsAuth } from '../utils/googleSheetsService';

export function useGoogleSheets(range: string) {
  const [data, setData] = useState<any[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await initGoogleSheetsAuth();
        const result = await getGoogleSheetsData(range);
        setData(result || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  return { data, loading, error };
}
