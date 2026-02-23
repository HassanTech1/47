import React from 'react';
import { products } from '~/data/mock';
import { useCart } from '~/context/CartContext';
import pro1 from '@assets/product/1.png';
import pro2 from '@assets/product/2.png';
import pro3 from '@assets/product/3.png';
import pro4 from '@assets/product/4.png';
import pro5 from '@assets/product/5.png';
import pro5back from '@assets/product/5-1.png';
import pro6 from '@assets/product/6.png';
import pro6back from '@assets/preview/6.png';
import prev1 from '@assets/preview/1.png';
import prev2 from '@assets/preview/2.png';
import prev3 from '@assets/preview/3.png';
import prev4 from '@assets/preview/4.png';
import prev5 from '@assets/preview/5.png';
import prev11 from '@assets/product/1-1.png';
import back4 from '@behind/4.png';

const ProductGrid = () => {
  const { openProductDetail } = useCart();
  const [hoveredProduct, setHoveredProduct] = React.useState(null);

  const productImages = [pro1, pro2, pro3, pro4, pro5, pro6];
  const previewImages = [prev1, prev2, prev3, prev4, prev5, pro6back];
  const backImages = [prev11, null, null, back4, pro5back, pro6back];

  const productNames = [
    '٧٧٧٧ pants',
    'Can be hoody',
    'T-shirt',
    '٧٧٧٧ zip-up',
    'My future is calling',
    "4Seven's pants",
  ];

  const productPrices = [179, 249, 194, 269, 269, 179];

  const essentialProducts = products.slice(0, 6).map((p, index) => ({
    ...p,
    nameEn: productNames[index],
    price: productPrices[index],
    image: productImages[index],
    images: [productImages[index], productImages[index], productImages[index]],
    preview: previewImages[index],
    backView: backImages[index],
    badge: 'Unisex',
  }));

  return (
    <section id="product-grid" className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-wider uppercase">
            4Seven&apos;s Essential Collection
          </h2>
        </div>

        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {essentialProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="product-card-clean group cursor-pointer"
              onClick={() => openProductDetail(product)}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              data-testid={`product-card-${product.id}`}
            >
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 tracking-wider">{product.badge}</span>
              </div>
              <div className="relative h-44 sm:h-56 lg:h-96 lg:bg-transparent bg-gray-50 mb-6 overflow-hidden flex items-center justify-center">
                <img
                  src={hoveredProduct === product.id ? product.preview : product.images[0]}
                  alt={product.nameEn}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-black mb-2 uppercase tracking-widest">
                  {product.nameEn}
                </h3>
                <p className="text-base text-black font-semibold">{product.price}.00 SAR</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 2-Column Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {[
            { ...essentialProducts[4], badge: 'Featured' },
            { ...essentialProducts[5], badge: 'Special' },
          ].map((product) => (
            <div
              key={product.id}
              className="product-card-clean group cursor-pointer"
              onClick={() => openProductDetail(product)}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 tracking-wider">{product.badge}</span>
              </div>
              <div className="relative h-44 sm:h-56 lg:h-96 lg:bg-transparent bg-gray-50 mb-6 overflow-hidden flex items-center justify-center">
                <img
                  src={hoveredProduct === product.id ? product.preview : product.images[0]}
                  alt={product.nameEn}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-black mb-2 uppercase tracking-widest">
                  {product.nameEn}
                </h3>
                <p className="text-base text-black font-semibold">{product.price}.00 SAR</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
