/**
 * /sitemap.xml  — dynamically generated Shopify sitemap.
 * Falls back to a minimal static sitemap when Storefront API is unavailable.
 */
export async function loader({request, context}) {
  const {storefront} = context;
  const baseUrl = new URL(request.url).origin;

  let productsXml = '';
  let collectionsXml = '';

  try {
    const {products, collections} = await storefront.query(SITEMAP_QUERY, {
      variables: {first: 250},
      cache: storefront.CacheLong(),
    });

    productsXml = (products?.nodes ?? [])
      .map(
        (p) =>
          `  <url><loc>${baseUrl}/products/${p.handle}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
      )
      .join('\n');

    collectionsXml = (collections?.nodes ?? [])
      .map(
        (c) =>
          `  <url><loc>${baseUrl}/collections/${c.handle}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
      )
      .join('\n');
  } catch {
    // Use a minimal static sitemap
    productsXml = '';
    collectionsXml = '';
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/collections</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>${baseUrl}/search</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
${productsXml}
${collectionsXml}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

const SITEMAP_QUERY = `#graphql
  query Sitemap($first: Int!) {
    products(first: $first) {
      nodes { handle }
    }
    collections(first: $first) {
      nodes { handle }
    }
  }
`;
