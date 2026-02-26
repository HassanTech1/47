import {useLoaderData} from 'react-router';
import {MOCK_PRODUCTS} from '~/lib/mock-data';
import HeroSection from '~/components/HeroSection';
import PromoBanner from '~/components/PromoBanner';
import ProductGrid from '~/components/ProductGrid';
import LifestyleSection from '~/components/LifestyleSection';
import ProductDetail from '~/components/ProductDetail';
import React from 'react';

/**
 * @param {import('@shopify/remix-oxygen').LoaderFunctionArgs} args
 */
export async function loader({context}) {
  const {storefront, cart} = context;

  // Fetch shop info — wrapped in try/catch because MiniOxygen preview runtime
  // may not support Headers.getSetCookie() used internally by the storefront client.
  let shop = null;
  try {
    const result = await storefront.query(SHOP_QUERY, {
      cache: storefront.CacheLong(),
    });
    shop = result.shop;
  } catch (err) {
    console.warn('Could not fetch shop info, using defaults:', err.message);
  }

  // Fetch products from Shopify, fall back to mock data
  let products = MOCK_PRODUCTS;
  try {
    const {products: shopifyProducts} = await storefront.query(
      HOMEPAGE_PRODUCTS_QUERY,
      {
        variables: {first: 6},
        cache: storefront.CacheShort(),
      },
    );
    if (shopifyProducts?.nodes?.length > 0) {
      products = shopifyProducts.nodes;
    }
  } catch (error) {
    // Storefront not configured — use mock data
    console.warn('Shopify Storefront not configured, using mock data:', error.message);
  }

  const cartData = await cart.get();

  return {products, cart: cartData, shop}; // shop may be null if Shopify not reachable
}

export default function Homepage() {
  const {products} = useLoaderData();
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  return (
    <main>
      <HeroSection />
      <PromoBanner />
      <ProductGrid products={products} onProductClick={handleProductClick} />
      <LifestyleSection />
      {selectedProduct && (
        <div style={{position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)'}}>
          <div style={{position: 'relative', margin: '40px auto', maxWidth: 900}}>
            <ProductDetail product={selectedProduct} onClose={handleCloseDetail} />
          </div>
        </div>
      )}
    </main>
  );
}

const SHOP_QUERY = `#graphql
  query ShopInfo {
    shop {
      name
      description
    }
  }
`;

export function meta() {
  return [
    {title: "4Seven's Fashion | Premium Saudi Streetwear"},
    {
      name: 'description',
      content: "Shop 4Seven's premium unisex fashion collection. Free delivery on orders above 475 SAR.",
    },
  ];
}

const HOMEPAGE_PRODUCTS_QUERY = `#graphql
  query HomepageProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
          width
          height
        }
        variants(first: 10) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
        tags
      }
    }
  }
`;
