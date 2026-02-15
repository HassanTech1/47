import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../data/mock';

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Simplified products for clean display
  const essentialProducts = products.slice(0, 8).map((p, i) => ({
    ...p,
    images: [p.image, p.image, p.image], // In real app, multiple images
    badge: "Unisex",
  }));

  const handleProductClick = (product, index) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const nextImage = (e, product) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e, product) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-wider uppercase">
            ESSENTIALS
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {essentialProducts.map((product, index) => (
            <div
              key={product.id}
              className="product-card-clean group cursor-pointer"
              onClick={() => handleProductClick(product, index)}
            >
              {/* Badge */}
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 tracking-wider">
                  {product.badge}
                </span>
              </div>

              {/* Product Image with Carousel */}
              <div className="relative h-96 bg-gray-50 mb-6 overflow-hidden">
                <img
                  src={product.images[selectedProduct?.id === product.id ? currentImageIndex : 0]}
                  alt={product.nameEn}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Carousel Navigation - Shows on hover */}
                {selectedProduct?.id === product.id && product.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => prevImage(e, product)}
                      className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => nextImage(e, product)}
                      className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
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
                  {product.isNew && (
                    <p className="text-sm text-gray-400 line-through">
                      {(product.price * 1.2).toFixed(2)} SAR
                    </p>
                  )}
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
