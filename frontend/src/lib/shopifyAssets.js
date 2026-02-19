/**
 * Returns the URL for a Shopify theme asset by filename.
 *
 * In production (Shopify), window.shopifyAssetsUrl is set by layout/theme.liquid
 * to the CDN base URL for the theme's assets folder.
 * In development (React dev server), it falls back to the public folder URL.
 *
 * @param {string} filename - The asset filename (e.g., 'hero.jpg')
 * @returns {string} The resolved asset URL
 */
export function getAssetUrl(filename) {
  if (window.shopifyAssetsUrl) {
    return window.shopifyAssetsUrl + filename;
  }
  return (process.env.PUBLIC_URL ? process.env.PUBLIC_URL + '/' : '/') + filename;
}
