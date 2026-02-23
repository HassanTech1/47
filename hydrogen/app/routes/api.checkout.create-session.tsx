import { json, type ActionFunctionArgs } from '@remix-run/node';
import { apiFetch } from '~/lib/backend.server';

export async function action({ request }: ActionFunctionArgs) {
  const auth = request.headers.get('Authorization') ?? '';
  const body = await request.text();
  const res = await apiFetch('/api/checkout/create-session', {
    method: 'POST',
    headers: { Authorization: auth },
    body,
  });
  const data = await res.json();
  return json(data, { status: res.status });
}
