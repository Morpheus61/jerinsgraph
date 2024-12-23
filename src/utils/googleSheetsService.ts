import { google } from 'googleapis';

const SPREADSHEET_ID = '1YOzEDIfoec-nbJ9d7dLoO87-8SjWPEfY4MaO1dH499E';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const credentials = {
  client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  redirect_uris: [import.meta.env.VITE_REDIRECT_URI || "https://visionary-buttercream-de5137.netlify.app"]
};

export async function getGoogleSheetsData(range: string) {
  try {
    const auth = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uris[0]
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    return response.data.values;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
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
