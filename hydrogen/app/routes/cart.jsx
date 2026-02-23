
import {useLoaderData} from 'react-router';
import {useState} from 'react';
import {data} from 'react-router';
import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Plus, Minus, X} from 'lucide-react';
import {Header} from '~/components/Header';
import {Footer} from '~/components/Footer';
import {MOCK_PRODUCTS} from '~/lib/mock-data';

/**
 * Cart page for Shopify Hydrogen.
 * Also handles cart mutations via actions.
 *
 * @param {import('@shopify/remix-oxygen').LoaderFunctionArgs} args
 */
export async function loader({context}) {
  const {cart, storefront} = context;
  
  const {shop} = await storefront.query(SHOP_QUERY, {
    cache: storefront.CacheLong(),
  });
  
  const cartData = await cart.get();
  return {cart: cartData, shop};
}

export async function action({request, context}) {
  const {cart} = context;

  const formData = await request.formData();
  const {action: cartAction, inputs} = CartForm.getFormInput(formData);

  if (!cartAction) {
    throw new Error('No cartAction defined');
  }

  let status = 200;
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
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;
      const discountCodes = formDiscountCode ? [formDiscountCode] : [];
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    default:
      throw new Error(`${cartAction} cart action is not defined`);
  }

  const headers = cart.setCartId(result.cart.id);

  const {cart: cartResult, errors} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId: result.cart.id,
      },
    },
    {status, headers},
  );
}

export default function CartPage() {
  const {cart, shop} = useLoaderData();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const lines = cart?.lines?.nodes ?? [];
  const totalAmount = cart?.cost?.totalAmount;

  return (
    <>
      <Header 
        shop={shop}
        cartCount={cart?.totalQuantity ?? 0}
        onOpenCart={() => {}} 
        onOpenSearch={() => setIsSearchOpen(true)} 
      />

      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-12 pt-8">
            Shopping Cart
          </h1>

          {lines.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-8">Your cart is empty</p>
              <a
                href="/"
                className="px-8 py-3 border-2 border-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all"
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Line items */}
              <div className="lg:col-span-2 space-y-8">
                {lines.map((line) => (
                  <CartLine key={line.id} line={line} />
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="border-2 border-black p-6">
                  <h2 className="text-lg font-bold uppercase tracking-widest mb-6">
                    Order Summary
                  </h2>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Subtotal</span>
                    {totalAmount && <Money data={totalAmount} className="text-sm font-semibold" />}
                  </div>
                  <p className="text-xs text-gray-500 mb-6">
                    Shipping calculated at checkout
                  </p>

                  <a
                    href={cart?.checkoutUrl ?? '/checkout'}
                    className="block w-full py-4 bg-black text-white text-center text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
                  >
                    Checkout
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function CartLine({line}) {
  const {id, merchandise, quantity, cost} = line;
  const {product, title, image} = merchandise;

  return (
    <div className="flex gap-6 border-b border-gray-100 pb-8">
      {/* Image */}
      <div className="w-24 h-32 bg-gray-50 flex-shrink-0">
        {image ? (
          <Image
            data={image}
            width={96}
            height={128}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <p className="font-medium uppercase tracking-wide mb-1">
              {product.title}
            </p>
            <p className="text-sm text-gray-500 mb-3">{title}</p>
          </div>
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesRemove}
            inputs={{lineIds: [id]}}
          >
            <button type="submit" aria-label="Remove item">
              <X className="w-5 h-5 text-gray-400 hover:text-black transition-colors" />
            </button>
          </CartForm>
        </div>

        <Money data={cost.totalAmount} className="text-sm font-semibold mb-4" />

        {/* Quantity */}
        <div className="flex items-center gap-3">
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesUpdate}
            inputs={{lines: [{id, quantity: Math.max(quantity - 1, 0)}]}}
          >
            <button
              type="submit"
              className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
          </CartForm>

          <span className="text-sm w-8 text-center">{quantity}</span>

          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesUpdate}
            inputs={{lines: [{id, quantity: quantity + 1}]}}
          >
            <button
              type="submit"
              className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </CartForm>
        </div>
      </div>

      {/* Search modal */}
      {isSearchOpen && (
        <SearchModal onClose={() => setIsSearchOpen(false)} />
      )}
    </div>
  );
}

/**
 * Search modal component
 */
function SearchModal({onClose}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    const mockResults = MOCK_PRODUCTS.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setResults(mockResults);
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

          {query && (
            <ul className="space-y-4">
              {results.length === 0 ? (
                <p className="text-gray-500">No results for &ldquo;{query}&rdquo;</p>
              ) : (
                results.map((product) => (
                  <li key={product.id}>
                    <a
                      href={`/products/${product.handle}`}
                      className="flex items-center gap-4 hover:bg-gray-50 p-2 transition-colors rounded"
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

export function meta() {
  return [{title: "Cart | 4Seven's"}];
}

const SHOP_QUERY = `#graphql
  query ShopInfo {
    shop {
      name
      description
    }
  }
`;
