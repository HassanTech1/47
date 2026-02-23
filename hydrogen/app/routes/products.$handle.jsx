
import {useLoaderData, useNavigate} from 'react-router';
import {useState} from 'react';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import {ChevronLeft, ChevronRight, Plus, Minus, X} from 'lucide-react';
import {MOCK_PRODUCTS} from '~/lib/mock-data';
import {Header} from '~/components/Header';
import {Footer} from '~/components/Footer';
import {CartDrawer} from '~/components/CartDrawer';

/**
 * @param {import('@shopify/remix-oxygen').LoaderFunctionArgs} args
 */
export async function loader({params, context}) {
  const {handle} = params;
  const {storefront, cart} = context;

  let product = null;

  // Fetch shop info
  const {shop} = await storefront.query(SHOP_QUERY, {
    cache: storefront.CacheLong(),
  });

  // Try fetching from Shopify
  try {
    const {product: shopifyProduct} = await storefront.query(
      PRODUCT_QUERY,
      {
        variables: {handle},
        cache: storefront.CacheShort(),
      },
    );
    product = shopifyProduct;
  } catch (error) {
    // Fall back to mock data
    console.warn('Using mock data for product:', handle);
  }

  // Fallback: find in mock data
  if (!product) {
    product = MOCK_PRODUCTS.find((p) => p.handle === handle);
  }

  if (!product) {
    throw new Response('Product not found', {status: 404});
  }

  const cartData = await cart.get();

  return {product, cart: cartData, shop};
}

export async function action({request, context}) {
  const {cart} = context;
  const formData = await request.formData();
  const {action: cartAction, inputs} = CartForm.getFormInput(formData);

  if (!cartAction) {
    throw new Error('No cartAction defined');
  }

  let result;
  switch (cartAction) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    default:
      throw new Error(`Unknown action: ${cartAction}`);
  }

  return result;
}

export default function ProductPage() {
  const {product, cart, shop} = useLoaderData();
  const navigate = useNavigate();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const variants = product.variants?.nodes ?? [];
  const selectedVariant = variants[selectedVariantIndex] ?? variants[0];
  const images = product.images?.nodes ?? (product.featuredImage ? [product.featuredImage] : []);
  const currentImage = images[currentImageIndex] ?? product.featuredImage;

  const sizes = variants.map((v) => v.title);

  return (
    <>
      <Header 
        shop={shop}
        cartCount={cart?.totalQuantity ?? 0}
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenSearch={() => setIsSearchOpen(true)} 
      />

      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <a href="/" className="hover:text-black">Home</a>
            <span className="mx-2">/</span>
            <span>{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              {/* Main image */}
              <div className="relative bg-gray-50 aspect-square overflow-hidden">
                {currentImage ? (
                  <Image
                    data={currentImage}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}

                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((i) =>
                          i === 0 ? images.length - 1 : i - 1,
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((i) => (i + 1) % images.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-16 h-16 bg-gray-50 overflow-hidden border-2 transition-colors ${
                        currentImageIndex === idx
                          ? 'border-black'
                          : 'border-transparent'
                      }`}
                    >
                      <Image
                        data={img}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold uppercase tracking-widest mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="mb-6">
                {selectedVariant?.price ? (
                  <Money
                    data={selectedVariant.price}
                    className="text-2xl font-semibold"
                  />
                ) : (
                  <Money
                    data={product.priceRange.minVariantPrice}
                    className="text-2xl font-semibold"
                  />
                )}
              </div>

              {/* Size selection */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-widest mb-3 font-medium">
                    Size: <span className="font-bold">{selectedVariant?.title}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((variant, idx) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantIndex(idx)}
                        disabled={!variant.availableForSale}
                        className={`min-w-[48px] px-3 py-2 border text-sm uppercase transition-all ${
                          selectedVariantIndex === idx
                            ? 'border-black bg-black text-white'
                            : variant.availableForSale
                            ? 'border-gray-300 hover:border-black'
                            : 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                        }`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-8">
                <p className="text-sm uppercase tracking-widest font-medium">
                  Quantity:
                </p>
                <div className="flex items-center border border-black">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              {selectedVariant && (
                <CartForm
                  route="/cart"
                  action={CartForm.ACTIONS.LinesAdd}
                  inputs={{
                    lines: [
                      {
                        merchandiseId: selectedVariant.id,
                        quantity,
                      },
                    ],
                  }}
                >
                  <button
                    type="submit"
                    disabled={!selectedVariant.availableForSale}
                    className="w-full py-4 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
                  >
                    {selectedVariant.availableForSale ? 'Add to Cart' : 'Sold Out'}
                  </button>
                </CartForm>
              )}

              {/* Description accordion */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <button
                  onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                  className="flex items-center justify-between w-full text-sm uppercase tracking-widest font-medium py-2"
                >
                  <span>Description</span>
                  <span>{isDescriptionOpen ? '−' : '+'}</span>
                </button>
                {isDescriptionOpen && (
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                    {product.description || 'Premium quality product from 4Seven\'s collection.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <CartDrawer
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Search modal */}
      {isSearchOpen && (
        <SearchModal 
          onClose={() => setIsSearchOpen(false)} 
        />
      )}
    </>
  );
}

/**
 * Search modal component
 */
function SearchModal({onClose}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    // For now, use mock data - you can replace with real search later
    const mockResults = MOCK_PRODUCTS.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setResults(mockResults);
    setLoading(false);
  };

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
              onChange={(e) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search products..."
              className="flex-1 text-lg outline-none"
            />
            <button onClick={onClose} className="text-sm uppercase tracking-widest hover:text-gray-600">
              Close
            </button>
          </div>

          {loading && (
            <p className="text-gray-500">Searching...</p>
          )}

          {!loading && query && (
            <ul className="space-y-4">
              {results.length === 0 ? (
                <p className="text-gray-500">No results for &ldquo;{query}&rdquo;</p>
              ) : (
                results.map((product) => (
                  <li key={product.id}>
                    <a
                      href={`/products/${product.handle}`}
                      className="flex items-center gap-4 hover:bg-gray-50 p-2 transition-colors rounded"
                      onClick={onClose}
                    >
                      {product.featuredImage && (
                        <img
                          src={product.featuredImage.url}
                          alt={product.title}
                          className="w-16 h-16 object-cover bg-gray-100 rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.title}</p>
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

export function meta({data}) {
  return [
    {title: data?.product?.title ? `${data.product.title} | 4Seven's` : "4Seven's"},
    {name: 'description', content: data?.product?.description ?? ''},
  ];
}

const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
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
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
      variants(first: 20) {
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
    }
  }
`;

const SHOP_QUERY = `#graphql
  query ShopInfo {
    shop {
      name
      description
    }
  }
`;
