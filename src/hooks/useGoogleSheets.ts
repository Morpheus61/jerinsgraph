import { useState, useEffect } from 'react';
import { getGoogleSheetsData, listSpreadsheets } from '../utils/googleSheetsService';
import { useAuth } from './useAuth';

export function useGoogleSheets() {
  const [spreadsheets, setSpreadsheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchSpreadsheets = async () => {
      if (!accessToken) {
        setError(new Error('Not authenticated'));
        setLoading(false);
        return;
      }

      try {
        const sheets = await listSpreadsheets(accessToken);
        setSpreadsheets(sheets || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch spreadsheets'));
        setLoading(false);
      }
    };

    fetchSpreadsheets();
  }, [accessToken]);

  const getSheetData = async (spreadsheetId: string, range: string) => {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    return await getGoogleSheetsData(accessToken, range);
  };

  return { spreadsheets, loading, error, getSheetData };
}
