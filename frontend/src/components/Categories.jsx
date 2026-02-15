import React from 'react';
import { categories } from '../data/mock';

const Categories = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 section-title">
            التصنيفات
          </h2>
          <p className="text-gray-600 text-lg">
            اكتشف مجموعتنا الفاخرة
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card group cursor-pointer"
            >
              <div className="relative h-80 overflow-hidden rounded-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${category.image})`,
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <span className="text-gold text-sm uppercase tracking-wider">
                    {category.nameEn}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
