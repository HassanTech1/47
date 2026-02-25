import {useLoaderData, Form, useNavigation} from 'react-router';
import {MOCK_PRODUCTS} from '~/lib/mock-data';
import {useCart} from '~/context/CartContext';

export async function loader({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('q') ?? '';

  if (!searchTerm) {
    return {results: [], searchTerm: ''};
  }

  let results = [];
  try {
    const {products} = await storefront.query(SEARCH_QUERY, {
      variables: {query: searchTerm, first: 20},
      cache: storefront.CacheShort(),
    });
    results = products?.nodes ?? [];
  } catch {
    // Fallback to mock data filtering
    const q = searchTerm.toLowerCase();
    results = MOCK_PRODUCTS.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }

  return {results, searchTerm};
}

export function meta({data}) {
  const term = data?.searchTerm;
  return [{title: term ? `Search: ${term} | 4Seven's` : "Search | 4Seven's"}];
}

export default function SearchPage() {
  const {results, searchTerm} = useLoaderData();
  const navigation = useNavigation();
  const {openProductDetail} = useCart();
  const isSearching = navigation.state === 'loading';

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Search form */}
        <div className="max-w-xl mx-auto mb-12">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-center mb-8">
            Search
          </h1>
          <Form method="get" className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={searchTerm}
              placeholder="Search products…"
              autoFocus
              className="flex-1 border-2 border-black px-4 py-3 text-sm uppercase tracking-wide focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </Form>
        </div>

        {/* Results */}
        {isSearching ? (
          <p className="text-center text-gray-500">Searching…</p>
        ) : searchTerm && results.length === 0 ? (
          <p className="text-center text-gray-500">
            No results found for &quot;{searchTerm}&quot;
          </p>
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-8 text-center">
              {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{searchTerm}&quot;
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => openProductDetail(product)}
                  className="group text-left cursor-pointer"
                >
                  {product.featuredImage && (
                    <div className="aspect-square overflow-hidden bg-gray-50 mb-4">
                      <img
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText ?? product.title}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="text-sm font-medium uppercase tracking-widest mb-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {product.priceRange?.minVariantPrice?.amount}{' '}
                    {product.priceRange?.minVariantPrice?.currencyCode}
                  </p>
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}

const SEARCH_QUERY = `#graphql
  query Search($query: String!, $first: Int!) {
    products(query: $query, first: $first) {
      nodes {
        id
        title
        handle
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 4) {
          nodes {
            id
            title
            availableForSale
          }
        }
      }
    }
  }
`;
