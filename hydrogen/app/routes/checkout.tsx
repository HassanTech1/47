import type { MetaFunction } from '@remix-run/node';
import CheckoutPage from '~/components/CheckoutPage';

export const meta: MetaFunction = () => {
  return [{ title: "Checkout — 4Seven's" }];
};

export default function Checkout() {
  return <CheckoutPage />;
}
