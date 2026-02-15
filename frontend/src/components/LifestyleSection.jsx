import React from 'react';
import { lifestyleImage } from '../data/mock';

const LifestyleSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 section-title">
              أزياء متناسقة<br />للأزواج العصريين
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              اكتشف مجموعتنا الحصرية من الأزياء المتناسقة التي تجمع بين الأناقة والراحة. 
              صُممت خصيصاً للأزواج الذين يبحثون عن التميز والتناغم في إطلالاتهم.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gold rounded-full"></span>
                <span className="text-gray-700">تصاميم حصرية ومحدودة</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gold rounded-full"></span>
                <span className="text-gray-700">أقمشة فاخرة عالية الجودة</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gold rounded-full"></span>
                <span className="text-gray-700">قصات عصرية تناسب جميع المناسبات</span>
              </li>
            </ul>
            <button className="cta-button">
              اكتشف المجموعة
            </button>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden lifestyle-image">
              <img
                src={lifestyleImage}
                alt="Matching Couple Outfits"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;
