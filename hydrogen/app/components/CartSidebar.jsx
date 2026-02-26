import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const CartSidebar = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const { t, language, formatPrice } = useLanguage();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    openProductDetail,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsRedirecting(true);
    setIsCartOpen(false);
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
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        // Fallback to a generic cart page if API fails
        navigate('/cart');
      }
    } catch {
      navigate('/cart');
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[90] transition-opacity"
        onClick={() => setIsCartOpen(false)}
        data-testid="cart-overlay"
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[95] shadow-2xl transform transition-transform duration-300 overflow-y-auto"
        data-testid="cart-sidebar"
        dir="ltr"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium uppercase tracking-wide">
            {t('shoppingCart')} ({cartItems.length})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            data-testid="close-cart-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="px-6 py-4">
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-gray-500 text-lg">{t('cartEmpty')}</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-black underline hover:text-gray-600 transition-colors"
                >
                  {t('continueShopping')}
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex gap-4"
                      data-testid={`cart-item-${index}`}
                    >
                      {/* Product Image */}
                      <div className="w-20 h-28 bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.nameEn}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium uppercase tracking-wide">
                              {language === 'ar' && item.name ? item.name : (item.nameEn || item.name)}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {t('size')}: {item.size}
                            </p>
                          </div>
                          <p className="text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border border-gray-300">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              data-testid={`decrease-qty-${index}`}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              data-testid={`increase-qty-${index}`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-xs text-gray-500 underline hover:text-black transition-colors"
                            data-testid={`remove-item-${index}`}
                          >
                            {t('remove')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* You May Like Section Removed */}

                {/* Subtotal & Checkout */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium uppercase">{t('subtotal')}:</span>
                    <span className="text-lg font-medium">{formatPrice(getCartTotal())}</span>
                  </div>

                  <div className="text-center my-4">
                    {getCartTotal() >= 475 ? (
                      <p className="text-green-600 font-semibold text-sm">
                        {t('freeDeliveryCongrats')}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        {t('freeDeliveryMsg')} {formatPrice(475)}
                      </p>
                    )}
                  </div>

                  <button className="text-xs text-gray-500 underline mb-6">
                    {t('orderNote')}
                  </button>

                  <button
                    onClick={handleCheckout}
                    disabled={isRedirecting}
                    className="w-full py-4 bg-black text-white font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    data-testid="checkout-btn"
                  >
                    {isRedirecting ? '...' : t('checkout')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer (Fixed at bottom) */}
        {cartItems.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-medium">
              <span className="uppercase tracking-widest">{t('subtotal')}</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            <p className="text-xs text-gray-500 text-center tracking-wider">
              {t('shippingCalculated')}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
