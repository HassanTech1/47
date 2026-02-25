import {useLoaderData} from 'react-router';

const POLICY_HANDLES = {
  'privacy-policy': 'privacyPolicy',
  'refund-policy': 'refundPolicy',
  'shipping-policy': 'shippingPolicy',
  'terms-of-service': 'termsOfService',
  'terms-of-sale': 'termsOfSale',
  'legal-notice': 'legalNotice',
  'subscription-policy': 'subscriptionPolicy',
};

export async function loader({params, context}) {
  const {policyHandle} = params;
  const {storefront} = context;

  const gqlKey = POLICY_HANDLES[policyHandle];
  if (!gqlKey) {
    throw new Response('Policy not found', {status: 404});
  }

  let policy = null;
  try {
    const {shop} = await storefront.query(POLICY_QUERY(gqlKey), {
      cache: storefront.CacheLong(),
    });
    policy = shop?.[gqlKey];
  } catch {
    // Storefront not configured
  }

  if (!policy) {
    throw new Response('Policy not found', {status: 404});
  }

  return {policy};
}

export function meta({data}) {
  return [
    {title: data?.policy?.title ? `${data.policy.title} | 4Seven's` : "4Seven's"},
  ];
}

export default function PolicyPage() {
  const {policy} = useLoaderData();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-8 border-b-2 border-black pb-6">
          {policy.title}
        </h1>
        <div
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{__html: policy.body}}
        />
      </div>
    </main>
  );
}

/** Build GraphQL query dynamically based on which policy field we want */
function POLICY_QUERY(field) {
  return `#graphql
    query Policy {
      shop {
        ${field} {
          id
          title
          body
          handle
          url
        }
      }
    }
  `;
}
