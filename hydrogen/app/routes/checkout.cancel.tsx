import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: "Checkout Cancelled — 4Seven's" }];
};

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-2xl font-bold mb-4">Checkout Cancelled</h1>
      <p className="text-gray-600 mb-8">Your order was not completed.</p>
      <Link
        to="/"
        className="px-8 py-3 bg-black text-white font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
