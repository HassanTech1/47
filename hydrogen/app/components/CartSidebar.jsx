import React from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useNavigate } from '@remix-run/react';
import { useCart } from '~/context/CartContext';

const CartSidebar = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
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
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[95] flex flex-col shadow-2xl"
        data-testid="cart-sidebar"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold uppercase tracking-wide">
            Your Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            data-testid="close-cart-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg mb-4">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-sm underline hover:text-black transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${index}`} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-50 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image || item.images?.[0]}
                      alt={item.nameEn}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm font-medium uppercase tracking-wide">{item.nameEn}</h3>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-gray-400 hover:text-black transition-colors ml-2"
                        data-testid={`remove-item-${item.id}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Size: {item.size}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          data-testid={`decrease-qty-${item.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          data-testid={`increase-qty-${item.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold">
                        {(item.price * item.quantity).toFixed(2)} SAR
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-lg font-semibold">{getCartTotal().toFixed(2)} SAR</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-black text-white font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors mb-3"
              data-testid="checkout-btn"
            >
              Checkout
            </button>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full py-3 border border-black text-black font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
