# Google Drive API Setup Guide

This guide will help you set up Google Drive API integration for uploading photos and videos to your birthday website.

## Prerequisites

1. A Google Cloud Console account
2. A Google Drive account
3. Node.js installed on your system

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen if prompted
4. Select "Web application" as the application type
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (for development)
   - Your production domain + `/api/auth/google/callback`
6. Save and note down:
   - Client ID
   - Client Secret

## Step 3: Set Up Google Drive Folder

1. Create a folder in Google Drive where uploaded files will be stored
2. Right-click the folder and select "Get shareable link"
3. Copy the folder ID from the link (the part after `/folders/`)

## Step 4: Get Refresh Token

Run the provided `get_refresh_token.js` script to obtain a refresh token:

```bash
node get_refresh_token.js
```

This will:
1. Open a browser for OAuth consent
2. Generate and display your refresh token

## Step 5: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Google Drive API Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

## Step 6: Set Up Database

Run the SQL script to create the media table:

```sql
-- Run the contents of create_media_table.sql in your Supabase SQL editor
```

## Step 7: Test the Integration

1. Start your Next.js development server
2. Go to the admin panel > Photos & Videos
3. Try uploading some test files
4. Check the Gallery Management tab to see uploaded files

## Troubleshooting

### Common Issues:

1. **"Access blocked: This app's request is invalid"**
   - Make sure your redirect URI matches exactly
   - Check that the OAuth consent screen is configured

2. **"Invalid scope" error**
   - Ensure you have the correct scopes in your OAuth request

3. **Upload fails**
   - Check your Google Drive folder permissions
   - Verify your refresh token is valid
   - Ensure the folder ID is correct

4. **Files not appearing in gallery**
   - Check Supabase database for errors
   - Verify RLS policies are set up correctly

### Refreshing Tokens:

If your refresh token expires, you'll need to get a new one:

1. Delete the old refresh token from your `.env.local`
2. Run `get_refresh_token.js` again
3. Update your environment variables

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your OAuth credentials secure
- Regularly rotate your refresh tokens
- Use environment variables for all sensitive data

## File Upload Limits

- Maximum file size: 100MB per file
- Supported formats:
  - Images: PNG, JPG, JPEG, GIF, WebP
  - Videos: MP4, MOV, AVI, WebM

## Next Steps

Once set up, you can:
- Upload files through the admin interface
- View files in the public gallery
- Feature important photos/videos
- Delete unwanted content