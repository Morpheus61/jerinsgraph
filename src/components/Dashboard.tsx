import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getGoogleSheetsData, listAllSpreadsheets } from '../utils/googleSheetsService';
import { Loader2 } from 'lucide-react';

interface Spreadsheet {
  id: string;
  name: string;
  webViewLink: string;
}

export const Dashboard = () => {
  const { user, handleLogout, accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [sheetData, setSheetData] = useState<any[][]>([]);

  useEffect(() => {
    const fetchSpreadsheets = async () => {
      if (!accessToken) {
        setError(new Error('Not authenticated'));
        setLoading(false);
        return;
      }

      try {
        const files = await listAllSpreadsheets(accessToken);
        setSpreadsheets(files || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch spreadsheets'));
        setLoading(false);
      }
    };

    fetchSpreadsheets();
  }, [accessToken]);

  useEffect(() => {
    const fetchSheetData = async () => {
      if (!selectedSheet || !accessToken) return;

      try {
        setLoading(true);
        const data = await getGoogleSheetsData(accessToken, selectedSheet);
        setSheetData(data || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch sheet data'));
        setLoading(false);
      }
    };

    fetchSheetData();
  }, [selectedSheet, accessToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">Jerin's Graph Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="ml-2 text-sm text-gray-300">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Select Spreadsheet</h2>
            <div className="grid gap-4">
              {spreadsheets.map((sheet) => (
                <button
                  key={sheet.id}
                  onClick={() => setSelectedSheet(sheet.id)}
                  className={`p-4 rounded-lg border ${
                    selectedSheet === sheet.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-gray-700 hover:border-indigo-500/50 hover:bg-gray-700/50'
                  } transition-colors`}
                >
                  <div className="font-medium text-white">{sheet.name}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    <a
                      href={sheet.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open in Google Sheets
                    </a>
                  </div>
                </button>
              ))}
              {spreadsheets.length === 0 && (
                <div className="text-gray-400 text-center py-4">
                  No spreadsheets found. Make sure you have access to some Google Sheets.
                </div>
              )}
            </div>
          </div>

          {selectedSheet && sheetData.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-white mb-4">Spreadsheet Data</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      {sheetData[0]?.map((header: string, index: number) => (
                        <th
                          key={index}
                          className="py-2 px-4 bg-gray-700/50 text-gray-300 font-medium border-b border-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheetData.slice(1).map((row: string[], rowIndex: number) => (
                      <tr key={rowIndex}>
                        {row.map((cell: string, cellIndex: number) => (
                          <td
                            key={cellIndex}
                            className="py-2 px-4 border-b border-gray-700 text-gray-300"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};