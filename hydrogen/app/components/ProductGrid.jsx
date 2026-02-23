import {useState} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

/**
 * ProductGrid component for Shopify Hydrogen.
 * Accepts products from Shopify Storefront API.
 *
 * @param {{products: import('~/lib/mock-data').MOCK_PRODUCTS}} props
 */
export function ProductGrid({products}) {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  if (!products || products.length === 0) {
    return (
      <section id="product-grid" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">No products found.</p>
        </div>
      </section>
    );
  }

  const topProducts = products.slice(0, 4);
  const bottomProducts = products.slice(4, 6);
  const badgeMap = ['Unisex', 'Unisex', 'Unisex', 'Unisex', 'Featured', 'Special'];

  return (
    <section id="product-grid" className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-wider uppercase">
            4Seven&apos;s Essential Collection
          </h2>
        </div>

        {/* Top 4 products */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {topProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              badge={badgeMap[index] ?? 'Unisex'}
              isHovered={hoveredProduct === product.id}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            />
          ))}
        </div>

        {/* Bottom 2 products */}
        {bottomProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {bottomProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                badge={badgeMap[4 + index] ?? 'Special'}
                isHovered={hoveredProduct === product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Single product card.
 */
function ProductCard({product, badge, isHovered, onMouseEnter, onMouseLeave}) {
  const image = product.featuredImage;

  return (
    <div
      className="product-card-clean group cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid={`product-card-${product.id}`}
    >
      {/* Badge */}
      <div className="text-center mb-4">
        <span className="text-sm text-gray-500 tracking-wider">{badge}</span>
      </div>

      {/* Image */}
      <Link to={`/products/${product.handle}`} prefetch="intent">
        <div className="relative h-44 sm:h-56 lg:h-96 bg-gray-50 mb-6 overflow-hidden flex items-center justify-center">
          {image ? (
            <Image
              data={image}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 ${
                isHovered ? 'scale-105' : ''
              }`}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="text-sm font-medium text-black mb-2 uppercase tracking-widest">
            {product.title}
          </h3>
          <p className="text-base text-black font-semibold">
            <Money data={product.priceRange.minVariantPrice} />
          </p>
        </div>
      </Link>
    </div>
  );
}
