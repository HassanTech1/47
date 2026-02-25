import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { categories } from '../data/mock';

const Categories = () => {
  const { t } = useLanguage();

  // Product items with prices
  const products = [
    {
      id: 1,
      nameKey: "premiumCottonShirt",
      nameEn: "PREMIUM COTTON SHIRT",
      price: "450.00",
      image: categories[2].image, // Shirts image
      badgeKey: "newArrival",
    },
    {
      id: 2,
      nameKey: "classicDenimJeans",
      nameEn: "CLASSIC DENIM JEANS",
      price: "580.00",
      image: categories[3].image, // Pants/Jeans image
      badgeKey: "newArrival",
    },
    {
      id: 3,
      nameKey: "sportHoodie",
      nameEn: "SPORT HOODIE",
      price: "520.00",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
      badgeKey: "newArrival",
    },
    {
      id: 4,
      nameKey: "casualShirt",
      nameEn: "CASUAL SHIRT",
      price: "390.00",
      image: categories[2].image,
      badgeKey: "newArrival",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="category-product-card group cursor-pointer bg-white"
            >
              {/* Product Image */}
              <div className="relative h-96 overflow-hidden bg-gray-50 mb-4">
                <img
                  src={product.image}
                  alt={product.nameEn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-xs text-gray-600 tracking-wider">
                    {t(product.badgeKey)}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center px-2">
                <h3 className="text-sm font-medium text-black mb-1 uppercase tracking-widest">
                  {t(product.nameKey)}
                </h3>
                <p className="text-base text-black font-semibold">
                  {product.price} SAR
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
