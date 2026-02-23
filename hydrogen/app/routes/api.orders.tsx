import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { apiFetch } from '~/lib/backend.server';

/** GET /api/orders */
export async function loader({ request }: LoaderFunctionArgs) {
  const auth = request.headers.get('Authorization') ?? '';
  const res = await apiFetch('/api/orders', { headers: { Authorization: auth } });
  const data = await res.json();
  return json(data, { status: res.status });
}
