import React, { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { products } from '../data/mock';

const ProductGrid = () => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (productId) => {
    setCart(prev => [...prev, productId]);
    // Show toast notification (simplified)
    console.log('Product added to cart');
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 section-title">
            مجموعة الصيف
          </h2>
          <p className="text-gray-600 text-lg">
            اكتشف أحدث صيحات الموضة
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {product.isNew && (
                  <span className="absolute top-4 right-4 bg-gold text-black px-3 py-1 text-xs font-bold rounded-full">
                    جديد
                  </span>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`icon-button ${
                      wishlist.includes(product.id) ? 'bg-gold text-black' : 'bg-white text-black'
                    }`}
                    aria-label="Add to Wishlist"
                  >
                    <Heart className="w-5 h-5" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="icon-button bg-white text-black"
                    aria-label="Add to Cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 text-center">
                <h3 className="text-lg font-bold mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  {product.nameEn}
                </p>
                <p className="text-xl font-bold text-gold">
                  {product.price} ر.س
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
