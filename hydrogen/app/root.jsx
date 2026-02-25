import {useState} from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router';
import {useShopifyCookies, useNonce} from '@shopify/hydrogen';
import appStyles from '~/styles/app.css?url';
import {CartProvider} from '~/context/CartContext';
import {AuthProvider} from '~/context/AuthContext';
import {LanguageProvider} from '~/context/LanguageContext';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import CartSidebar from '~/components/CartSidebar';
import AuthModal from '~/components/AuthModal';
import AppAccountPage from '~/components/AccountPage';
import SearchModal from '~/components/SearchModal';
import ProductDetail from '~/components/ProductDetail';

export function links() {
  return [
    {rel: 'stylesheet', href: appStyles},
    {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous'},
  ];
}

/**
 * @param {import('@remix-run/react').MetaArgs} args
 */
export function meta() {
  return [
    {title: "4Seven's Fashion | Premium Saudi Streetwear"},
    {charset: 'utf-8'},
    {name: 'viewport', content: 'width=device-width,initial-scale=1'},
  ];
}

export function App() {
  const nonce = useNonce();
  useShopifyCookies();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountPageOpen, setAccountPageOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <CartProvider>
          <AuthProvider>
            <LanguageProvider>
              <Header
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenAccount={() => setAccountPageOpen(true)}
              />
              <Outlet />
              <Footer />
              <CartSidebar />
              <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
              <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
              <AppAccountPage isOpen={accountPageOpen} onClose={() => setAccountPageOpen(false)} />
            </LanguageProvider>
          </AuthProvider>
        </CartProvider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default App;

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.data?.message ?? error.data;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold mb-4">
            {errorStatus === 404 ? '404 - Not Found' : 'Error'}
          </h1>
          <p className="text-gray-600 mb-8">{errorMessage}</p>
          <a href="/" className="px-6 py-3 bg-black text-white">
            Return Home
          </a>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

