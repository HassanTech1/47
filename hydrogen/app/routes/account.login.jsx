import {redirect} from 'react-router';

/**
 * /account/login
 *
 * The store uses a custom AuthModal for sign-in (shown from the Header).
 * This route redirects back to the account page so any backlinks
 * (e.g. from Shopify order confirmation emails) land somewhere useful.
 */
export async function loader() {
  return redirect('/account');
}

export async function action() {
  return redirect('/account');
}
