import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
];

const credentials = {
  client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  redirect_uris: [import.meta.env.VITE_REDIRECT_URI || "https://visionary-buttercream-de5137.netlify.app"]
};

export async function getGoogleSheetsData(accessToken: string, spreadsheetId: string, range: string = 'A1:Z1000') {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw error;
  }
}

export async function listAllSpreadsheets(accessToken: string) {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: 'v3', auth });
    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet'",
      fields: 'files(id, name, webViewLink)',
      orderBy: 'modifiedTime desc'
    });

    return response.data.files;
  } catch (error) {
    console.error('Error listing spreadsheets:', error);
    throw error;
  }
}

export async function getSpreadsheetInfo(accessToken: string, spreadsheetId: string) {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching spreadsheet info:', error);
    throw error;
  }
}

export async function initGoogleSheetsAuth() {
  const auth = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris[0]
  );

  return new Promise((resolve, reject) => {
    // Generate the url that will be used for authorization
    const authUrl = auth.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    // Open the authorization url
    window.open(authUrl, '_blank');

    // Handle the OAuth 2.0 server response
    window.addEventListener('message', async (event) => {
      if (event.data.type === 'oauth-callback') {
        try {
          const { code } = event.data;
          const { tokens } = await auth.getToken(code);
          auth.setCredentials(tokens);
          resolve(auth);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}
