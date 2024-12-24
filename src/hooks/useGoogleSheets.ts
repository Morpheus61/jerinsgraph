import { useState, useEffect } from 'react';
import { getGoogleSheetsData, listAllSpreadsheets } from '../utils/googleSheetsService';
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
        console.log('Fetching spreadsheets with access token:', !!accessToken);
        const sheets = await listAllSpreadsheets(accessToken);
        console.log('Received spreadsheets:', sheets);
        setSpreadsheets(sheets || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching spreadsheets:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch spreadsheets'));
      } finally {
        setLoading(false);
      }
    };

    fetchSpreadsheets();
  }, [accessToken]);

  const getSheetData = async (_spreadsheetId: string, range: string) => {
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    return await getGoogleSheetsData(accessToken, range);
  };

  return { spreadsheets, loading, error, getSheetData };
}
