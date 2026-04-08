import { NextResponse } from 'next/server';
import { chunkRoutes, getAllSitemapRoutes, getSitemapPriority } from '@/data/cities';

const baseUrl = 'https://birthday.ditvi.org';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const urls = getAllSitemapRoutes();
  const chunks = chunkRoutes(urls, 50000);

  // Since we only have 1 chunk, return the first chunk
  const now = new Date().toISOString();
  const urlset = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${chunks[0]
    .map(
      (url) =>
        `  <url>\n    <loc>${escapeXml(`${baseUrl}${url}`)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${getSitemapPriority(url).toFixed(1)}</priority>\n  </url>`,
    )
    .join('\n')}\n</urlset>`;

  return new NextResponse(urlset, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}