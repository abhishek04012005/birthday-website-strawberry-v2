import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import { google } from 'googleapis';
import { supabase } from '@/lib/supabase';

const requiredEnv = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REFRESH_TOKEN',
  'GOOGLE_DRIVE_REDIRECT_URI',
  'GOOGLE_DRIVE_FOLDER_ID',
];

function getDriveClient() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required Google Drive environment variables: ${missing.join(', ')}`);
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_DRIVE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

export async function GET(request: NextRequest) {
  try {
    const drive = getDriveClient();
    const about = await drive.about.get({
      fields: 'storageQuota(limit,usage,usageInDrive,usageInDriveTrash)',
    });

    const quota = about.data.storageQuota || {};
    const limit = Number(quota.limit || 0);
    const usage = Number(quota.usage || 0);
    const remaining = limit > 0 ? Math.max(limit - usage, 0) : 0;

    return NextResponse.json({
      limit,
      usage,
      remaining,
      usageInDrive: Number(quota.usageInDrive || 0),
      usageInDriveTrash: Number(quota.usageInDriveTrash || 0),
    });
  } catch (error) {
    console.error('Storage info error:', error);
    return NextResponse.json({ error: 'Failed to retrieve storage information' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedFiles = [];
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID!;

    if (!folderId) {
      return NextResponse.json({ error: 'Google Drive folder ID is not configured' }, { status: 500 });
    }

    const drive = getDriveClient();

    for (const file of files) {
      try {
        // Upload to Google Drive
        const fileMetadata = {
          name: file.name,
          parents: [folderId],
        };

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const media = {
          mimeType: file.type,
          body: Readable.from(fileBuffer),
        };

        const driveResponse = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: 'id',
        });

        // Make file publicly accessible
        await drive.permissions.create({
          fileId: driveResponse.data.id!,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });

        // Get public URL
        const result = await drive.files.get({
          fileId: driveResponse.data.id!,
          fields: 'webViewLink, webContentLink',
        });

        // Determine file type
        const fileType = file.type.startsWith('image/') ? 'image' : 'video';

        // Save to Supabase
        const { data, error } = await supabase
          .from('media')
          .insert({
            alt: file.name,
            badge: '',
            text: file.name,
            type: fileType,
            drive_file_id: driveResponse.data.id,
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          continue;
        }

        uploadedFiles.push(data);
      } catch (fileError) {
        console.error(`Error uploading ${file.name}:`, fileError);
        continue;
      }
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      uploadedCount: uploadedFiles.length,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}