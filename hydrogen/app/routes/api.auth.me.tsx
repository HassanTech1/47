import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { apiFetch } from '~/lib/backend.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const auth = request.headers.get('Authorization') ?? '';
  const res = await apiFetch('/api/auth/me', { headers: { Authorization: auth } });
  const data = await res.json();
  return json(data, { status: res.status });
}
