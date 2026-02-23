import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: "Page Not Found — 4Seven's" }];
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-8xl font-bold text-black mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-4 uppercase tracking-widest">Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-black text-white font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
