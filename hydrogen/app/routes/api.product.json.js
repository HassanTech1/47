export async function loader({request, context}) {
  const url = new URL(request.url);
  const handle = url.searchParams.get('handle');
  const id = url.searchParams.get('id');

  if (!handle && !id) {
    return new Response(JSON.stringify({error: 'missing handle or id'}), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const PRODUCT_QUERY = `#graphql
    query ProductForModal($handle: String, $id: ID) {
      product(handle: $handle, id: $id) {
        id
        handle
        title
        description
        featuredImage { url altText width height }
        images(first: 10) { nodes { url altText width height } }
        variants(first: 50) {
          nodes {
            id
            title
            availableForSale
            price { amount currencyCode }
            selectedOptions { name value }
            quantityAvailable
          }
        }
      }
    }
  `;

  try {
    const variables = {};
    if (handle) variables.handle = handle;
    if (id) variables.id = id;

    const {product} = await context.storefront.query(PRODUCT_QUERY, {
      variables,
      cache: context.storefront.CacheShort(),
    });

    return new Response(JSON.stringify({product}), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({error: err.message}), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
