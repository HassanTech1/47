import { json, type ActionFunctionArgs } from '@remix-run/node';
import { apiFetch } from '~/lib/backend.server';

export async function action({ request }: ActionFunctionArgs) {
  const auth = request.headers.get('Authorization') ?? '';
  // FastAPI expects query params for name/phone on PUT /api/auth/profile
  const body = await request.text();
  let search = '';
  try {
    const { name, phone } = JSON.parse(body) as { name?: string; phone?: string };
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (phone) params.set('phone', phone);
    search = params.toString() ? `?${params.toString()}` : '';
  } catch {
    // fall back to forwarding any existing query string
    search = new URL(request.url).search;
  }
  const res = await apiFetch(`/api/auth/profile${search}`, {
    method: 'PUT',
    headers: { Authorization: auth },
  });
  const data = await res.json();
  return json(data, { status: res.status });
}
