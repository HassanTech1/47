import {redirect} from 'react-router';

/**
 * /account/authorize
 *
 * OAuth callback endpoint used by Shopify's Customer Account API
 * (the new customer accounts experience).
 *
 * This store currently uses a custom AuthModal with email/password.
 * If you migrate to Shopify's new customer accounts, replace this
 * loader with the full OAuth code-exchange flow using:
 *   context.customerAccount.authorize()
 *
 * For now we redirect to /account so the URL resolves gracefully.
 */
export async function loader({request, context}) {
  // Attempt Customer Account API authorization if available
  if (context.customerAccount?.authorize) {
    try {
      return await context.customerAccount.authorize();
    } catch (err) {
      console.warn('Customer Account authorize failed:', err.message);
    }
  }

  return redirect('/account');
}
