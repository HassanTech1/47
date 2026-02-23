import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: "Maintenance — 4Seven's" }];
};

export default function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-4xl font-bold mb-4 tracking-widest uppercase">Coming Soon</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        We are currently performing scheduled maintenance. We&apos;ll be back shortly.
      </p>
      <Link
        to="/"
        className="px-8 py-3 border border-white text-white font-medium uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
