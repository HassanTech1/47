/**
 * /robots.txt  — tells search engines which paths to crawl.
 */
export async function loader({request}) {
  const baseUrl = new URL(request.url).origin;

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

Disallow: /admin
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /api/
Disallow: /.well-known/
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
