import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router';
import {useShopifyCookies} from '@shopify/hydrogen';
import appStyles from '~/styles/app.css?url';

/**
 * @param {import('@shopify/remix-oxygen').LoaderFunctionArgs} args
 */
export async function loader(args) {
  const {storefront, env} = args.context;

  // Fetch shop information for SEO
  const {shop} = await storefront.query(SHOP_QUERY, {
    cache: storefront.CacheLong(),
  });

  return {
    shop,
    storeDomain: env.PUBLIC_STORE_DOMAIN,
  };
}

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
export function meta({data}) {
  return [
    {title: data?.shop?.name ?? '4Seven\'s Fashion'},
    {charset: 'utf-8'},
    {name: 'viewport', content: 'width=device-width,initial-scale=1'},
  ];
}

export function App() {
  useShopifyCookies();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
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

const SHOP_QUERY = `#graphql
  query ShopInfo {
    shop {
      name
      description
      primaryDomain {
        url
      }
      brand {
        logo {
          image {
            url
          }
        }
      }
    }
  }
` ;
