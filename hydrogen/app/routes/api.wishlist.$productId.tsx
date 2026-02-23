import { json, type ActionFunctionArgs } from '@remix-run/node';
import { apiFetch } from '~/lib/backend.server';

/** DELETE /api/wishlist/:productId */
export async function action({ request, params }: ActionFunctionArgs) {
  const auth = request.headers.get('Authorization') ?? '';
  const { productId } = params;
  const res = await apiFetch(`/api/wishlist/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: auth },
  });
  const data = await res.json();
  return json(data, { status: res.status });
}
