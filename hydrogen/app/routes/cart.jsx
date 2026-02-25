import {useLoaderData} from 'react-router';
import {useState} from 'react';
import {data} from 'react-router';
import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Plus, Minus, X} from 'lucide-react';
import {useCart} from '~/context/CartContext';
import {useLanguage} from '~/context/LanguageContext';

/**
 * Cart page for Shopify Hydrogen.
 * Also handles cart mutations via actions.
 *
 * @param {import('@shopify/remix-oxygen').LoaderFunctionArgs} args
 */
export async function loader({context}) {
  const {cart, storefront} = context;

  let shop = null;
  try {
    const result = await storefront.query(SHOP_QUERY, {
      cache: storefront.CacheLong(),
    });
    shop = result.shop;
  } catch (err) {
    console.warn('Could not fetch shop info for cart:', err.message);
  }

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
  return <ClientCartPage />;
}

/**
 * Client-side cart page — reads from CartContext (localStorage).
 * The loader's server-side Shopify cart is intentionally not used here
 * because items are added client-side via CartContext before any Shopify
 * sync. The CHECKOUT button calls /api/checkout which creates the Shopify
 * cart and returns the hosted-checkout URL.
 */
function ClientCartPage() {
  const {cartItems, updateQuantity, removeFromCart, getCartTotal} = useCart();
  const {t, language, formatPrice} = useLanguage();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const total = getCartTotal();

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsRedirecting(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            nameEn: item.nameEn ?? item.name ?? '',
            variantId: item.variantId ?? null,
            quantity: item.quantity ?? 1,
            size: item.size ?? '',
          })),
        }),
      });
      const responseData = await res.json();
      if (responseData.checkoutUrl) {
        window.location.href = responseData.checkoutUrl;
      } else {
        setCheckoutError(responseData.error ?? 'تعذّر إنشاء الطلب، يرجى المحاولة مجدداً.');
        setIsRedirecting(false);
      }
    } catch {
      setCheckoutError('خطأ في الشبكة، يرجى المحاولة مجدداً.');
      setIsRedirecting(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-12 pt-8">
          {t('shoppingCart')}
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-8">{t('cartEmpty')}</p>
            <a
              href="/"
              className="px-8 py-3 border-2 border-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              {t('continueShopping')}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Line items */}
            <div className="lg:col-span-2 space-y-8">
              {cartItems.map((item) => (
                <ClientCartLine
                  key={`${item.id}-${item.size}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  t={t}
                  language={language}
                  formatPrice={formatPrice}
                />
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="border-2 border-black p-6">
                <h2 className="text-lg font-bold uppercase tracking-widest mb-6">
                  {t('orderSummary')}
                </h2>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">{t('subtotal')}</span>
                  <span className="text-xl font-bold">{formatPrice(getCartTotal())}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6">
                  {t('shippingCalculated')}
                </p>

                <button
                  onClick={handleCheckout}
                  disabled={isRedirecting}
                  className="block w-full py-4 bg-black text-white text-center text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isRedirecting ? '...' : t('checkout')}
                </button>

                {checkoutError && (
                  <p className="mt-3 text-xs text-red-600">{checkoutError}</p>
                )}

                {checkoutError && (
                  <p className="mt-4 text-xs text-red-600 leading-relaxed">
                    {checkoutError}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ClientCartLine({item, onUpdateQuantity, onRemove, t, language, formatPrice}) {
  return (
    <div className="flex gap-6 border-b border-gray-100 pb-8">
      {/* Image */}
      <div className="w-24 h-32 bg-gray-50 flex-shrink-0 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.nameEn ?? item.name ?? 'Product'}
            className="w-full h-full object-contain"
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
              {language === 'ar' && item.name ? item.name : (item.nameEn || item.name || 'Product')}
            </p>
            {item.size && (
              <p className="text-sm text-gray-500 mb-3">{t('size')}: {item.size}</p>
            )}
          </div>
          <button
            onClick={() => onRemove(item.id, item.size)}
            aria-label="Remove item"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-black transition-colors" />
          </button>
        </div>

        <p className="text-sm font-semibold mb-4">
          {formatPrice(item.price * item.quantity)}
        </p>

        {/* Quantity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpdateQuantity(item.id, item.size, Math.max((item.quantity ?? 1) - 1, 0))}
            className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm w-8 text-center">{item.quantity ?? 1}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.size, (item.quantity ?? 1) + 1)}
            className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CartLine({line}) {
  // Legacy Shopify server-cart line — kept for reference but not rendered.
  // The active cart page uses ClientCartLine with CartContext data.
  return null;
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
