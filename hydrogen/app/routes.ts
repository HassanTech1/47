import {type RouteConfig, route, index} from '@react-router/dev/routes';

export default [
  // Home
  index('./routes/_index.jsx'),

  // Products & Collections
  route('products/:handle', './routes/products.$handle.jsx'),
  route('collections', './routes/collections._index.jsx'),
  route('collections/:handle', './routes/collections.$handle.jsx'),

  // Cart & Checkout
  route('cart', './routes/cart.jsx'),
  route('checkout', './routes/checkout.jsx'),
  route('checkout/result', './routes/checkout.result.jsx'),
  route('api/checkout', './routes/api.checkout.jsx'),
  route('api/hyperpay', './routes/api.hyperpay.jsx'),
  route('api/shipping', './routes/api.shipping.jsx'),

  // Account
  route('account', './routes/account.jsx'),
  route('account/login', './routes/account.login.jsx'),
  route('account/authorize', './routes/account.authorize.jsx'),
  route('account/orders/:orderId', './routes/account.orders.$orderId.jsx'),

  // CMS Pages & Policies
  route('pages/:pageHandle', './routes/pages.$pageHandle.jsx'),
  route('policies/:policyHandle', './routes/policies.$policyHandle.jsx'),

  // Search
  route('search', './routes/search.jsx'),

  // SEO
  route('sitemap.xml', './routes/[sitemap.xml].jsx'),
  route('robots.txt', './routes/[robots.txt].jsx'),
] satisfies RouteConfig;
