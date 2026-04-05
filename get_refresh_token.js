const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const open = require('open');
const destroyer = require('server-destroy');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/auth/google/callback'
);

const scopes = [
  'https://www.googleapis.com/auth/drive.file'
];

async function getRefreshToken() {
  return new Promise((resolve, reject) => {
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });

    console.log('Opening browser for OAuth consent...');
    console.log('If browser doesn\'t open automatically, visit:', authorizeUrl);

    const server = http.createServer(async (req, res) => {
      try {
        if (req.url.indexOf('/api/auth/google/callback') > -1) {
          const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
          const code = qs.get('code');

          console.log('Authorization code received, exchanging for tokens...');

          res.end('Authentication successful! You can close this window.');

          server.destroy();

          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);

          console.log('\n=== GOOGLE DRIVE API SETUP COMPLETE ===');
          console.log('Add these values to your .env.local file:');
          console.log('');
          console.log(`GOOGLE_CLIENT_ID=${process.env.GOOGLE_CLIENT_ID}`);
          console.log(`GOOGLE_CLIENT_SECRET=${process.env.GOOGLE_CLIENT_SECRET}`);
          console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
          console.log('');
          console.log('You can now close this terminal.');

          resolve(tokens.refresh_token);
        }
      } catch (e) {
        reject(e);
      }
    }).listen(3000, () => {
      open(authorizeUrl, { wait: false });
    });

    destroyer(server);
  });
}

if (require.main === module) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables');
    console.error('Example:');
    console.error('GOOGLE_CLIENT_ID=your_client_id GOOGLE_CLIENT_SECRET=your_secret node get_refresh_token.js');
    process.exit(1);
  }

  getRefreshToken().catch(console.error);
}

module.exports = { getRefreshToken };