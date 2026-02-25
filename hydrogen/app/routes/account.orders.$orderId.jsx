import {useLoaderData, Link} from 'react-router';

export async function loader({params, context}) {
  const {orderId} = params;
  const {storefront} = context;

  let order = null;
  try {
    // Customer account orders require a customer access token.
    // For now we attempt to query via the Storefront API using the order ID.
    // In a full implementation this would use the Customer Account API.
    const numericId = orderId.replace(/\D/g, '');
    const gid = `gid://shopify/Order/${numericId}`;

    const {node} = await storefront.query(ORDER_QUERY, {
      variables: {id: gid},
      cache: storefront.CacheNone(),
    });
    order = node;
  } catch {
    // Storefront not configured or order not accessible
  }

  return {order, orderId};
}

export function meta({data}) {
  return [
    {
      title: data?.orderId
        ? `Order #${data.orderId} | 4Seven's`
        : "Order | 4Seven's",
    },
  ];
}

export default function OrderDetail() {
  const {order, orderId} = useLoaderData();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <div className="mb-8">
          <Link
            to="/account"
            className="text-sm text-gray-500 hover:text-black uppercase tracking-widest"
          >
            ← Back to Account
          </Link>
        </div>

        <h1 className="text-3xl font-bold uppercase tracking-widest mb-8 border-b-2 border-black pb-6">
          Order #{orderId}
        </h1>

        {order ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <p className="font-medium">{order.fulfillmentStatus ?? '—'}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="font-medium">
                  {order.processedAt
                    ? new Date(order.processedAt).toLocaleDateString()
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 uppercase tracking-wider mb-1">Total</p>
                <p className="font-medium">
                  {order.totalPrice?.amount} {order.totalPrice?.currencyCode}
                </p>
              </div>
            </div>

            {order.lineItems?.nodes?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">
                  Items
                </h2>
                <ul className="space-y-4">
                  {order.lineItems.nodes.map((item) => (
                    <li key={item.title} className="flex justify-between text-sm">
                      <span>
                        {item.title}{' '}
                        <span className="text-gray-400">× {item.quantity}</span>
                      </span>
                      <span>
                        {item.discountedTotalPrice?.amount}{' '}
                        {item.discountedTotalPrice?.currencyCode}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-6">
              Order details are not available. Please check your confirmation email
              or contact us.
            </p>
            <a
              href="mailto:info@4sevens.sa"
              className="inline-block px-8 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

const ORDER_QUERY = `#graphql
  query Order($id: ID!) {
    node(id: $id) {
      ... on Order {
        id
        fulfillmentStatus
        processedAt
        totalPrice {
          amount
          currencyCode
        }
        lineItems(first: 20) {
          nodes {
            title
            quantity
            discountedTotalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
