import {data as routerData} from 'react-router';

const json = (payload, init) => routerData(payload, init);

/**
 * POST /api/checkout
 *
 * 1. Fetches real products from the Shopify Storefront API.
 * 2. Matches each cart item to a real Shopify variant by title + size.
 * 3. Creates a Shopify cart and returns the hosted checkout URL.
 *
 * Body: { items: [{ nameEn?, name?, variantId?, size?, quantity? }] }
 */
export async function action({request, context}) {
  const {env} = context;

  let items;
  try {
    ({items} = await request.json());
  } catch {
    return json({error: 'Invalid JSON body'}, {status: 400});
  }

  if (!Array.isArray(items) || items.length === 0) {
    return json({error: 'No items provided'}, {status: 400});
  }

  const storeDomain = env?.PUBLIC_STORE_DOMAIN ?? '4sevens-2.myshopify.com';
  const storefrontToken = env?.PUBLIC_STOREFRONT_API_TOKEN ?? '';
  const apiVersion = env?.PUBLIC_STOREFRONT_API_VERSION ?? '2025-01';
  const endpoint = `https://${storeDomain}/api/${apiVersion}/graphql.json`;

  // ── Step 1: Fetch real Shopify products ──────────────────────────────────
  let shopifyProducts = [];
  try {
    shopifyProducts = await fetchShopifyProducts(endpoint, storefrontToken);
  } catch (err) {
    console.warn('Could not fetch Shopify products for variant lookup:', err.message);
  }

  // ── Step 2: Resolve a real variantId for each cart item ──────────────────
  const lines = items
    .map((item) => {
      let variantId = null;

      // Try title-based match against real Shopify products first
      if (shopifyProducts.length > 0) {
        variantId = findVariantId(
          shopifyProducts,
          item.nameEn ?? item.name ?? '',
          item.size ?? '',
        );
      }

      // FALLBACK: ONLY use the provided variantId if it looks like a real GID from a real loader
      // and we are NOT using mock data. If we couldn't match by title above, it's safer to fail 
      // with a clear message than to send a mock "15" ID that Shopify will reject.
      if (
        !variantId &&
        item.variantId &&
        String(item.variantId).startsWith('gid://shopify/ProductVariant/') &&
        !String(item.variantId).match(/\/(\d+)$/) // IDs like /1, /2 are likely mock
      ) {
        variantId = item.variantId;
      }

      if (!variantId) return null;

      return {
        merchandiseId: variantId,
        quantity: Math.max(1, Number(item.quantity) || 1),
        attributes: item.size ? [{key: 'Size', value: String(item.size)}] : [],
      };
    })
    .filter(Boolean);

  if (lines.length === 0) {
    const msg =
      shopifyProducts.length === 0
        ? 'Could not connect to Shopify Storefront API. Check your environment variables.'
        : 'Product mismatch: The items in your cart do not match any products in your Shopify store. ' +
          'Ensure the product titles in Shopify match the English names used in the app.';
    console.warn('[api/checkout]', msg);
    return json({error: msg, fallback: '/cart'}, {status: 422});
  }

  // ── Step 3: Create Shopify cart ──────────────────────────────────────────
  try {
    const gqlResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({query: CART_CREATE_MUTATION, variables: {lines}}),
    });

    if (!gqlResponse.ok) {
      const text = await gqlResponse.text();
      console.error('Shopify API error:', gqlResponse.status, text);
      return json(
        {error: `Storefront API returned ${gqlResponse.status}`, fallback: '/cart'},
        {status: 500},
      );
    }

    const {data: gqlData, errors: gqlErrors} = await gqlResponse.json();

    if (gqlErrors?.length) {
      console.error('GraphQL errors:', gqlErrors);
      return json({error: gqlErrors[0]?.message, fallback: '/cart'}, {status: 400});
    }

    const userErrors = gqlData?.cartCreate?.userErrors ?? [];
    if (userErrors.length) {
      console.error('Cart userErrors:', userErrors);
      return json({error: userErrors[0]?.message, fallback: '/cart'}, {status: 400});
    }

    const checkoutUrl = gqlData?.cartCreate?.cart?.checkoutUrl;
    if (!checkoutUrl) {
      return json({error: 'Shopify did not return a checkout URL', fallback: '/cart'}, {status: 500});
    }

    return json({checkoutUrl});
  } catch (err) {
    console.error('Checkout creation error:', err.message);
    return json({error: err.message, fallback: '/cart'}, {status: 500});
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function fetchShopifyProducts(endpoint, storefrontToken) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({query: PRODUCTS_QUERY}),
  });
  if (!response.ok) return [];
  const {data} = await response.json();
  return data?.products?.nodes ?? [];
}

/**
 * Match a cart item (by nameEn + size) to a real Shopify variant.
 * Tries exact title match first, then partial, then falls back to first variant.
 */
function findVariantId(shopifyProducts, nameEn, size) {
  const nameLower = nameEn.toLowerCase().trim();

  let product =
    shopifyProducts.find((p) => p.title.toLowerCase().trim() === nameLower) ??
    shopifyProducts.find(
      (p) =>
        p.title.toLowerCase().includes(nameLower) ||
        nameLower.includes(p.title.toLowerCase()),
    );

  if (!product) return null;

  const sizeLower = (size ?? '').toLowerCase().trim();
  // Some sizes stored as "M/15" — use the code before the slash
  const sizeCode = sizeLower.split('/')[0].trim();

  const variant =
    product.variants.nodes.find((v) => v.title.toLowerCase().trim() === sizeLower) ??
    (sizeCode
      ? product.variants.nodes.find(
          (v) =>
            v.title.toLowerCase().trim() === sizeCode ||
            v.title.toLowerCase().startsWith(sizeCode),
        )
      : null) ??
    product.variants.nodes.find((v) => v.availableForSale) ??
    product.variants.nodes[0];

  return variant?.id ?? null;
}

// ── GraphQL ───────────────────────────────────────────────────────────────────

const CART_CREATE_MUTATION = `#graphql
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const PRODUCTS_QUERY = `#graphql
  query AllProducts {
    products(first: 20) {
      nodes {
        id
        title
        handle
        variants(first: 10) {
          nodes {
            id
            title
            availableForSale
          }
        }
      }
    }
  }
`;
