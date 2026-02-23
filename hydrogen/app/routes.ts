import {type RouteConfig, route, index} from '@react-router/dev/routes';

export default [
  index('./routes/_index.jsx'),
  route('products/:handle', './routes/products.$handle.jsx'),
  route('collections/:handle', './routes/collections.$handle.jsx'),
  route('cart', './routes/cart.jsx'),
  route('account', './routes/account.jsx'),
] satisfies RouteConfig;
