import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { apiFetch } from '~/lib/backend.server';

/** GET /api/wishlist */
export async function loader({ request }: LoaderFunctionArgs) {
  const auth = request.headers.get('Authorization') ?? '';
  const res = await apiFetch('/api/wishlist', { headers: { Authorization: auth } });
  const data = await res.json();
  return json(data, { status: res.status });
}

/** POST /api/wishlist/add */
export async function action({ request }: ActionFunctionArgs) {
  const auth = request.headers.get('Authorization') ?? '';
  const body = await request.text();
  const res = await apiFetch('/api/wishlist/add', {
    method: 'POST',
    headers: { Authorization: auth },
    body,
  });
  const data = await res.json();
  return json(data, { status: res.status });
}
