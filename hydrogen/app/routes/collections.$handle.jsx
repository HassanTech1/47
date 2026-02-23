
import {useLoaderData} from 'react-router';
import {useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {MOCK_PRODUCTS} from '~/lib/mock-data';
import {Header} from '~/components/Header';
import {Footer} from '~/components/Footer';
import {CartDrawer} from '~/components/CartDrawer';

/**
 * @param {import('@shopify/remix-oxygen').LoaderFunctionArgs} args
 */
export async function loader({params, context}) {
  const {handle} = params;
  const {storefront, cart} = context;

  let products = MOCK_PRODUCTS;
  let collectionTitle = '4Seven\'s Collection';

  try {
    const {collection} = await storefront.query(COLLECTION_QUERY, {
      variables: {handle, first: 20},
      cache: storefront.CacheShort(),
    });

    if (collection) {
      collectionTitle = collection.title;
      products = collection.products.nodes;
    }
  } catch (error) {
    console.warn('Using mock data for collection:', handle);
  }

  const cartData = await cart.get();

  return {products, collectionTitle, cart: cartData};
}

export default function CollectionPage() {
  const {products, collectionTitle, cart} = useLoaderData();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Header onOpenCart={() => setIsCartOpen(true)} onOpenSearch={() => {}} />

      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Title */}
          <div className="text-center py-12 border-b-2 border-black mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold uppercase tracking-widest">
              {collectionTitle}
            </h1>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                prefetch="intent"
                className="group"
              >
                <div className="relative bg-gray-50 aspect-square overflow-hidden mb-4">
                  {product.featuredImage ? (
                    <Image
                      data={product.featuredImage}
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <h3 className="text-sm font-medium uppercase tracking-widest mb-1 text-center">
                  {product.title}
                </h3>
                <p className="text-sm text-center font-semibold">
                  <Money data={product.priceRange.minVariantPrice} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <CartDrawer
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}

export function meta({data}) {
  return [
    {
      title: data?.collectionTitle
        ? `${data.collectionTitle} | 4Seven's`
        : "4Seven's Collection",
    },
  ];
}

const COLLECTION_QUERY = `#graphql
  query Collection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      products(first: $first) {
        nodes {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;
