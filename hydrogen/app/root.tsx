import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import React from 'react';

import tailwindStyles from '~/styles/tailwind.css?url';
import appStyles from '~/styles/app.css?url';

import { CartProvider } from '~/context/CartContext';
import { AuthProvider } from '~/context/AuthContext';
import { LanguageProvider } from '~/context/LanguageContext';
import ProductDetail from '~/components/ProductDetail';
import CartSidebar from '~/components/CartSidebar';
import AuthModal from '~/components/AuthModal';
import SearchModal from '~/components/SearchModal';
import AccountPage from '~/components/AccountPage';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Playfair+Display:wght@400;600;700&family=Dancing+Script:wght@400;700&display=swap',
  },
  { rel: 'stylesheet', href: tailwindStyles },
  { rel: 'stylesheet', href: appStyles },
];

export default function App() {
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [searchModalOpen, setSearchModalOpen] = React.useState(false);
  const [accountPageOpen, setAccountPageOpen] = React.useState(false);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <div className="App">
                <Outlet
                  context={{
                    onOpenAuth: () => setAuthModalOpen(true),
                    onOpenSearch: () => setSearchModalOpen(true),
                    onOpenAccount: () => setAccountPageOpen(true),
                  }}
                />
                <ProductDetail />
                <CartSidebar />
                <AuthModal
                  isOpen={authModalOpen}
                  onClose={() => setAuthModalOpen(false)}
                />
                <SearchModal
                  isOpen={searchModalOpen}
                  onClose={() => setSearchModalOpen(false)}
                />
                <AccountPage
                  isOpen={accountPageOpen}
                  onClose={() => setAccountPageOpen(false)}
                />
              </div>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
