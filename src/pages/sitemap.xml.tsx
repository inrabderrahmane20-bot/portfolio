import type { GetServerSideProps } from 'next';
import { workItems } from '@/lib/content';

const siteUrl = 'https://www.devariam.com';
const indexablePaths = [
  '/',
  '/about',
  '/services',
  '/fr/services',
  '/es/services',
  '/ar/services',
  '/work',
  ...workItems.map((item) => `/work/${item.slug}`),
  '/resume',
  '/contact',
];
const serviceAlternates = [
  { language: 'en', path: '/services' },
  { language: 'fr', path: '/fr/services' },
  { language: 'es', path: '/es/services' },
  { language: 'ar', path: '/ar/services' },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const urls = indexablePaths
    .map((path) => {
      const alternates = serviceAlternates.some((alternate) => alternate.path === path)
        ? serviceAlternates
            .map(
              ({ language, path: alternatePath }) =>
                `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(`${siteUrl}${alternatePath}`)}" />`,
            )
            .join('\n') +
          `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${siteUrl}/services`)}" />`
        : '';
      return `  <url>\n    <loc>${escapeXml(`${siteUrl}${path}`)}</loc>${alternates ? `\n${alternates}\n  ` : ''}\n  </url>`;
    })
    .join('\n');

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate');
  res.write(
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
      'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
      `${urls}\n` +
      '</urlset>',
  );
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
