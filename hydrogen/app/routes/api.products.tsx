import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { apiFetch } from '~/lib/backend.server';

/**
 * GET /api/products
 * Forwards to `/api/products/search` when a `q` query param is present,
 * otherwise to `/api/products`. Both endpoints share the same query-string
 * format (category, min_price, max_price).
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.searchParams.has('q')
    ? `/api/products/search${url.search}`
    : `/api/products${url.search}`;
  const res = await apiFetch(path);
  const data = await res.json();
  return json(data, { status: res.status });
}
