import {useLoaderData} from 'react-router';

export async function loader({params, context}) {
  const {pageHandle} = params;
  const {storefront} = context;

  let page = null;
  try {
    const {page: shopifyPage} = await storefront.query(PAGE_QUERY, {
      variables: {handle: pageHandle},
      cache: storefront.CacheLong(),
    });
    page = shopifyPage;
  } catch {
    // Storefront not configured
  }

  if (!page) {
    throw new Response('Page not found', {status: 404});
  }

  return {page};
}

export function meta({data}) {
  return [
    {title: data?.page?.title ? `${data.page.title} | 4Seven's` : "4Seven's"},
  ];
}

export default function Page() {
  const {page} = useLoaderData();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-8 border-b-2 border-black pb-6">
          {page.title}
        </h1>
        <div
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{__html: page.body}}
        />
      </div>
    </main>
  );
}

const PAGE_QUERY = `#graphql
  query Page($handle: String!) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;
