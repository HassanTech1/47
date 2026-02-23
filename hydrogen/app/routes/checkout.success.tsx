import type { MetaFunction } from '@remix-run/node';
import CheckoutSuccess from '~/components/CheckoutSuccess';

export const meta: MetaFunction = () => {
  return [{ title: "Order Confirmed — 4Seven's" }];
};

export default function CheckoutSuccessRoute() {
  return <CheckoutSuccess />;
}
