/**
 * Server-side helper for proxying requests to the FastAPI backend.
 * This file must only be imported in .server.ts files or Remix loaders/actions.
 */

export const BACKEND_URL = (process.env.BACKEND_URL ?? '').replace(/\/$/, '');

/**
 * Make a fetch call to the FastAPI backend.
 * Callers can override any header (including Content-Type) via options.headers.
 * Content-Type defaults to application/json only when a body is provided.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const { headers: extraHeaders, body, ...rest } = options;
  const defaultContentType = body !== undefined ? { 'Content-Type': 'application/json' } : {};
  return fetch(`${BACKEND_URL}${path}`, {
    ...rest,
    body,
    headers: {
      ...defaultContentType,
      ...(extraHeaders as Record<string, string> | undefined),
    },
  });
}
