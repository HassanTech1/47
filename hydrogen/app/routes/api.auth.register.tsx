import { json, type ActionFunctionArgs } from '@remix-run/node';
import { apiFetch } from '~/lib/backend.server';

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.text();
  const res = await apiFetch('/api/auth/register', { method: 'POST', body });
  const data = await res.json();
  return json(data, { status: res.status });
}
