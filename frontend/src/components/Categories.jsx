import React from 'react';
import { useCart } from '../context/CartContext';
import pro1 from '../assest/product/1.png';
import pro2 from '../assest/product/2.png';
import pro3 from '../assest/product/3.png';
import pro4 from '../assest/product/4.png';
import prev1 from '../assest/preview/1.png';
import prev2 from '../assest/preview/2.png';
import prev3 from '../assest/preview/3.png';
import prev4 from '../assest/preview/4.png';
import back4 from '../behind/4.png';
import prev11 from '../assest/product/1-1.png';

const Categories = () => {
  const { openProductDetail } = useCart();
  const [hovered, setHovered] = React.useState(null);

  // Use the actual 4Seven's products with local images
  const products = [
    {
      id: 1,
      nameEn: "٧٧٧٧ pants",
      price: 179,
      image: pro1,
      preview: prev1,
      backView: prev11,
      images: [pro1, pro1, pro1],
      badge: "New arrival",
      category: "pants",
    },
    {
      id: 2,
      nameEn: "Can be hoody",
      price: 249,
      image: pro2,
      preview: prev2,
      backView: null,
      images: [pro2, pro2, pro2],
      badge: "New arrival",
      category: "jackets",
    },
    {
      id: 3,
      nameEn: "T-shirt",
      price: 194,
      image: pro3,
      preview: prev3,
      backView: null,
      images: [pro3, pro3, pro3],
      badge: "New arrival",
      category: "shirts",
    },
    {
      id: 4,
      nameEn: "٧٧٧٧ zip-up",
      price: 269,
      image: pro4,
      preview: prev4,
      backView: back4,
      images: [pro4, pro4, pro4],
      badge: "New arrival",
      category: "jackets",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-wider uppercase">
            New Arrivals
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card-clean group cursor-pointer bg-white"
              onClick={() => openProductDetail(product)}
              onMouseEnter={() => setHovered(product.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Product Image */}
              <div className="relative h-64 lg:h-96 overflow-hidden bg-gray-50 mb-4 flex items-center justify-center">
                <img
                  src={hovered === product.id ? product.preview : product.image}
                  alt={product.nameEn}
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-xs text-gray-600 tracking-wider">
                    {product.badge}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center px-2">
                <h3 className="text-sm font-medium text-black mb-1 uppercase tracking-widest">
                  {product.nameEn}
                </h3>
                <p className="text-base text-black font-semibold">
                  {product.price}.00 SAR
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
