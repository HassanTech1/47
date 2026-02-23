
import {useLoaderData} from 'react-router';
import {useState} from 'react';
import {MOCK_PRODUCTS} from '~/lib/mock-data';
import {Header} from '~/components/Header';
import {HeroSection} from '~/components/HeroSection';
import {PromoBanner} from '~/components/PromoBanner';
import {ProductGrid} from '~/components/ProductGrid';
import {LifestyleSection} from '~/components/LifestyleSection';
import {Footer} from '~/components/Footer';
import {CartDrawer} from '~/components/CartDrawer';

/**
 * @param {import('@shopify/remix-oxygen').LoaderFunctionArgs} args
 */
export async function loader({context}) {
  const {storefront, cart} = context;

  // Fetch shop info
  const {shop} = await storefront.query(SHOP_QUERY, {
    cache: storefront.CacheLong(),
  });

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

  return {products, cart: cartData, shop};
}

export default function Homepage() {
  const {products, cart, shop} = useLoaderData();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <Header
        shop={shop}
        cartCount={cart?.totalQuantity ?? 0}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main>
        <HeroSection />
        <PromoBanner />
        <ProductGrid products={products} />
        <LifestyleSection />
      </main>

      <Footer />

      <CartDrawer
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Search modal placeholder */}
      {isSearchOpen && (
        <SearchModal onClose={() => setIsSearchOpen(false)} products={products} />
      )}
    </>
  );
}

/**
 * Simple inline search modal.
 */
function SearchModal({onClose, products}) {
  const [query, setQuery] = useState('');
  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <div
        className="fixed inset-0 z-[110] bg-black/50"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 right-0 z-[120] bg-white p-6 shadow-xl">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center gap-4 border-b-2 border-black pb-4 mb-6">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 text-lg outline-none"
            />
            <button onClick={onClose} className="text-sm uppercase tracking-widest">
              Close
            </button>
          </div>

          {query && (
            <ul className="space-y-4">
              {filtered.length === 0 ? (
                <p className="text-gray-500">No results for &ldquo;{query}&rdquo;</p>
              ) : (
                filtered.map((product) => (
                  <li key={product.id}>
                    <a
                      href={`/products/${product.handle}`}
                      className="flex items-center gap-4 hover:bg-gray-50 p-2 transition-colors"
                      onClick={onClose}
                    >
                      {product.featuredImage && (
                        <img
                          src={product.featuredImage.url}
                          alt={product.title}
                          className="w-12 h-12 object-cover bg-gray-100"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-gray-500">
                          {product.priceRange.minVariantPrice.amount}{' '}
                          {product.priceRange.minVariantPrice.currencyCode}
                        </p>
                      </div>
                    </a>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </>
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
