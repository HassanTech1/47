import {useLoaderData, Link} from 'react-router';
import {MOCK_PRODUCTS} from '~/lib/mock-data';

export async function loader({context}) {
  const {storefront} = context;

  let collections = [];
  try {
    const {collections: shopifyCollections} = await storefront.query(
      COLLECTIONS_QUERY,
      {variables: {first: 20}, cache: storefront.CacheShort()},
    );
    collections = shopifyCollections?.nodes ?? [];
  } catch {
    // Storefront not configured — return a single synthetic collection
    collections = [
      {
        id: 'mock-all',
        handle: 'all',
        title: "4Seven's Essential Collection",
        description: 'Our complete collection of premium streetwear pieces.',
        image: null,
        products: {nodes: MOCK_PRODUCTS},
      },
    ];
  }

  return {collections};
}

export function meta() {
  return [{title: "Collections | 4Seven's"}];
}

export default function CollectionsIndex() {
  const {collections} = useLoaderData();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center py-12 border-b-2 border-black mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold uppercase tracking-widest">
            Collections
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.handle}`}
              className="group block border border-gray-200 hover:border-black transition-colors p-6"
            >
              {collection.image && (
                <img
                  src={collection.image.url}
                  alt={collection.image.altText ?? collection.title}
                  className="w-full h-56 object-cover mb-4"
                />
              )}
              <h2 className="text-xl font-bold uppercase tracking-widest mb-2 group-hover:underline">
                {collection.title}
              </h2>
              {collection.description && (
                <p className="text-gray-600 text-sm">{collection.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query Collections($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        description
        image {
          url
          altText
        }
      }
    }
  }
`;
