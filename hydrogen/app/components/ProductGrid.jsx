import React from 'react';
import { products } from '../data/mock';
import { useCart } from '../context/CartContext';

// Images from hydrogen public folder
const pro1 = '/product/1.png';
const pro2 = '/product/2.png';
const pro3 = '/product/3.png';
const pro4 = '/product/4.png';
const pro5 = '/product/5.png';
const pro5back = '/product/5-1.png';
const pro6 = '/product/6.png';
const pro6back = '/preview/6.png';

const prev1 = '/preview/1.png';
const prev2 = '/preview/2.png';
const prev3 = '/preview/3.png';
const prev4 = '/preview/4.png';
const prev5 = '/preview/5.png';
const prev11 = '/product/1-1.png';
const back4 = '/behind/4.png';

export const ProductGrid = () => {
  const { openProductDetail } = useCart();
  const [hoveredProduct, setHoveredProduct] = React.useState(null);

  const productImages = [pro1, pro2, pro3, pro4, pro5, pro6];
  const previewImages = [prev1, prev2, prev3, prev4, prev5, pro6back];
  const backImages = [prev11, null, null, back4, pro5back, pro6back];

  const productNames = [
    "٧٧٧٧ pants",
    "Can be hoody",
    "T-shirt",
    "٧٧٧٧ zip-up",
    "My future is calling",
    "4Seven's pants"
  ];

  const productPrices = [
    179,
    249,
    194,
    269,
    269,
    179
  ];

  const essentialProducts = products.slice(0, 6).map((p, index) => ({
    ...p,
    nameEn: productNames[index],
    price: productPrices[index],
    image: productImages[index],
    images: [productImages[index], productImages[index], productImages[index]],
    preview: previewImages[index],
    backView: backImages[index], 
    badge: "Unisex",
  }));

  const handleProductClick = (product) => {
    openProductDetail(product);
  };

  return (
    <section id="product-grid" className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-wider uppercase">
            4Seven's Essential Collection
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {essentialProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="product-card-clean group cursor-pointer"
              onClick={() => handleProductClick(product)}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              data-testid={`product-card-${product.id}`}
            >
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 tracking-wider">
                  {product.badge}
                </span>
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
                <div className="flex items-center justify-center gap-2">
                  <p className="text-base text-black font-semibold">
                    {product.price}.00 SAR
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {[
            { ...essentialProducts[4], badge: 'Featured' },
            { ...essentialProducts[5], badge: 'Special' }
          ].map((product) => (
            <div
              key={product.id}
              className="product-card-clean group cursor-pointer"
              onClick={() => handleProductClick(product)}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 tracking-wider">
                  {product.badge}
                </span>
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
                <div className="flex items-center justify-center gap-2">
                  <p className="text-base text-black font-semibold">
                    {product.price}.00 SAR
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
import React from 'react';
import { products } from '../data/mock';
import { useCart } from '../context/CartContext';
import pro1 from '../assest/product/1.png';
import pro2 from '../assest/product/2.png';
import pro3 from '../assest/product/3.png';
import pro4 from '../assest/product/4.png';
import pro5 from '../assest/product/5.png';
import pro5back from '../assest/product/5-1.png';
import pro6 from '../assest/product/6.png';
import pro6back from '../assest/preview/6.png';

import prev1 from '../assest/preview/1.png';
import prev2 from '../assest/preview/2.png';
import prev3 from '../assest/preview/3.png';
import prev4 from '../assest/preview/4.png';
import prev5 from '../assest/preview/5.png';
import prev11 from '../assest/product/1-1.png';
import back4 from '../behind/4.png';

const ProductGrid = () => {
  const { openProductDetail } = useCart();
  const [hoveredProduct, setHoveredProduct] = React.useState(null);

  // Simplified products for clean display
  const productImages = [pro1, pro2, pro3, pro4, pro5, pro6];
  const previewImages = [prev1, prev2, prev3, prev4, prev5, pro6back];
  const backImages = [prev11, null, null, back4, pro5back, pro6back]; // Added back view for product 4
  
  const productNames = [
    "٧٧٧٧ pants",
    "Can be hoody",
    "T-shirt",
    "٧٧٧٧ zip-up",
    "My future is calling",
    "4Seven's pants"
  ];

  const productPrices = [
    179,
    249,
    194,
    269,
    269,
    179
  ];

  const essentialProducts = products.slice(0, 6).map((p, index) => ({
    ...p,
    nameEn: productNames[index],
    price: productPrices[index],
    image: productImages[index], // Use the new image as the main image too
    images: [productImages[index], productImages[index], productImages[index]],
    preview: previewImages[index],
    backView: backImages[index], 
    badge: "Unisex",
  }));

  const handleProductClick = (product) => {
    openProductDetail(product);
  };

  return (
    <section id="product-grid" className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-wider uppercase">
            4Seven's Essential Collection
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {essentialProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="product-card-clean group cursor-pointer"
              onClick={() => handleProductClick(product)}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              data-testid={`product-card-${product.id}`}
            >
              {/* Badge */}
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 tracking-wider">
                  {product.badge}
                </span>
              </div>

              {/* Product Image */}
              <div className="relative h-44 sm:h-56 lg:h-96 lg:bg-transparent bg-gray-50 mb-6 overflow-hidden flex items-center justify-center">
                <img
                  src={hoveredProduct === product.id ? product.preview : product.images[0]}
                  alt={product.nameEn}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h3 className="text-sm font-medium text-black mb-2 uppercase tracking-widest">
                  {product.nameEn}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-base text-black font-semibold">
                    {product.price}.00 SAR
                  </p>
                </div>
                
                {/* Color Swatches */}
              </div>
            </div>
          ))}
        </div>
        {/* Bottom 2-Column Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {[
            { ...essentialProducts[4], badge: 'Featured' },
            { ...essentialProducts[5], badge: 'Special' }
          ].map((product) => (
            <div
              key={product.id}
              className="product-card-clean group cursor-pointer"
              onClick={() => handleProductClick(product)}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Badge */}
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 tracking-wider">
                  {product.badge}
                </span>
              </div>

              {/* Product Image */}
              <div className="relative h-44 sm:h-56 lg:h-96 lg:bg-transparent bg-gray-50 mb-6 overflow-hidden flex items-center justify-center">
                <img
                  src={hoveredProduct === product.id ? product.preview : product.images[0]}
                  alt={product.nameEn}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h3 className="text-sm font-medium text-black mb-2 uppercase tracking-widest">
                  {product.nameEn}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-base text-black font-semibold">
                    {product.price}.00 SAR
                  </p>
                </div>
                
                {/* Color Swatches */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
