import { NextResponse } from 'next/server';
import { chunkRoutes, getAllSitemapRoutes } from '@/data/cities';

const baseUrl = 'https://birthday.ditvi.org';

export async function GET() {
  const urls = getAllSitemapRoutes();
  const chunks = chunkRoutes(urls, 50000);
  const now = new Date().toISOString();

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${chunks
    .map(
      (_, index) =>
        `  <sitemap>\n    <loc>${baseUrl}/sitemap-${index + 1}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`,
    )
    .join('\n')}\n</sitemapindex>`;

  return new NextResponse(sitemapIndex, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}