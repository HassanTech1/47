import {useState} from 'react';
import {X, ChevronLeft, ChevronRight, Plus, Minus} from 'lucide-react';
import {Image, Money, CartForm} from '@shopify/hydrogen';

/**
 * Cart Drawer component for Shopify Hydrogen.
 * Uses Hydrogen's CartForm for add/remove actions.
 *
 * @param {{cart: any, isOpen: boolean, onClose: () => void}} props
 */
export function CartDrawer({cart, isOpen, onClose}) {
  const lines = cart?.lines?.nodes ?? [];
  const totalAmount = cart?.cost?.totalAmount;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[100] transition-transform duration-300 shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b-2 border-black">
            <h2 className="text-lg font-bold uppercase tracking-widest">
              Shopping Cart ({cart?.totalQuantity ?? 0})
            </h2>
            <button onClick={onClose} aria-label="Close cart">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free shipping bar */}
          <FreeShippingBar total={totalAmount} />

          {/* Line items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {lines.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <ul className="space-y-6">
                {lines.map((line) => (
                  <CartLineItem key={line.id} line={line} />
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {lines.length > 0 && (
            <div className="px-6 py-6 border-t-2 border-black">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-medium uppercase tracking-widest">
                  Subtotal
                </span>
                {totalAmount && (
                  <span className="text-lg font-bold">
                    <Money data={totalAmount} />
                  </span>
                )}
              </div>
              <a
                href={cart?.checkoutUrl ?? '/checkout'}
                className="block w-full py-4 bg-black text-white text-center text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Free shipping progress bar.
 */
function FreeShippingBar({total}) {
  const FREE_SHIPPING_THRESHOLD = 475;
  const current = total ? parseFloat(total.amount) : 0;
  const progress = Math.min((current / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - current, 0);

  return (
    <div className="px-6 py-3 bg-gray-50 border-b">
      {remaining > 0 ? (
        <p className="text-xs text-center mb-2">
          Add{' '}
          <span className="font-semibold text-green-600">
            {remaining.toFixed(2)} SAR
          </span>{' '}
          more for free shipping
        </p>
      ) : (
        <p className="text-xs text-center mb-2 text-green-600 font-semibold">
          🎉 You qualify for free shipping!
        </p>
      )}
      <div className="w-full bg-gray-200 h-1 rounded-full">
        <div
          className="bg-black h-1 rounded-full transition-all duration-300"
          style={{width: `${progress}%`}}
        />
      </div>
    </div>
  );
}

/**
 * Single cart line item.
 */
function CartLineItem({line}) {
  const {id, merchandise, quantity, cost} = line;
  const {product, title, image} = merchandise;

  return (
    <li className="flex gap-4">
      {/* Image */}
      <div className="w-20 h-24 bg-gray-50 flex-shrink-0 overflow-hidden">
        {image ? (
          <Image
            data={image}
            width={80}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <p className="text-sm font-medium uppercase tracking-wide mb-1">
          {product.title}
        </p>
        <p className="text-xs text-gray-500 mb-2">{title}</p>
        <Money
          data={cost.totalAmount}
          className="text-sm font-semibold"
        />

        {/* Quantity controls */}
        <div className="flex items-center gap-3 mt-3">
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesUpdate}
            inputs={{
              lines: [{id, quantity: Math.max(quantity - 1, 0)}],
            }}
          >
            <button
              type="submit"
              aria-label="Decrease quantity"
              className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
          </CartForm>

          <span className="text-sm w-6 text-center">{quantity}</span>

          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesUpdate}
            inputs={{
              lines: [{id, quantity: quantity + 1}],
            }}
          >
            <button
              type="submit"
              aria-label="Increase quantity"
              className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </CartForm>

          {/* Remove */}
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesRemove}
            inputs={{lineIds: [id]}}
          >
            <button
              type="submit"
              aria-label="Remove item"
              className="ml-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </CartForm>
        </div>
      </div>
    </li>
  );
}
