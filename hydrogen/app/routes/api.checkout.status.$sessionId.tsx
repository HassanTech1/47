import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { apiFetch } from '~/lib/backend.server';

export async function loader({ params }: LoaderFunctionArgs) {
  const { sessionId } = params;
  const res = await apiFetch(`/api/checkout/status/${sessionId}`);
  const data = await res.json();
  return json(data, { status: res.status });
}
