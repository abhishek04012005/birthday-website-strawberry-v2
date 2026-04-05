import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_DRIVE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const range = request.headers.get('range');

    if (!range) {
      return NextResponse.json({ error: 'Range header required' }, { status: 400 });
    }

    // Get file metadata from Drive
    const file = await drive.files.get({
      fileId: id,
      fields: 'size,mimeType',
    });

    const fileSize = parseInt(file.data.size!);
    const mimeType = file.data.mimeType!;

    // Parse range header
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    // Get partial file content
    const response = await drive.files.get({
      fileId: id,
      alt: 'media',
    }, {
      headers: {
        Range: `bytes=${start}-${end}`,
      },
      responseType: 'stream',
    });

    // Return chunk with appropriate headers
    const headers = new Headers();
    headers.set('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Length', chunkSize.toString());
    headers.set('Content-Type', mimeType);

    return new NextResponse(response.data as any, {
      status: 206,
      headers,
    });
  } catch (error) {
    console.error('Streaming error:', error);
    return NextResponse.json(
      { error: 'Failed to stream video' },
      { status: 500 }
    );
  }
}