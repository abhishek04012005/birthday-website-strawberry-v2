import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabaseServer = getSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    let query = supabaseServer
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) {
      const details =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : JSON.stringify(error);

      console.error('Supabase error:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch media',
          details,
        },
        { status: 500 }
      );
    }

    const transformed = (data ?? []).map((item: any) => {
      const driveId = item.drive_file_id;
      const url = item.url
        ? item.url
        : driveId
        ? item.type === 'image'
          ? `https://lh3.googleusercontent.com/d/${encodeURIComponent(driveId)}?sz=0`
          : `/api/media/stream/${encodeURIComponent(driveId)}`
        : undefined;
      const filename = item.filename || item.alt || item.text || 'Uploaded media';
      return {
        ...item,
        url,
        filename,
      };
    });

    return NextResponse.json(transformed);
  } catch (error) {
    const details =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : JSON.stringify(error);

    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details },
      { status: 500 }
    );
  }
}