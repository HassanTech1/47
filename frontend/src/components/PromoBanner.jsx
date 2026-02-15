import React from 'react';
import { promoBannerImage } from '../data/mock';

const PromoBanner = () => {
  return (
    <section className="relative h-[500px] lg:h-[600px] overflow-hidden my-24">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${promoBannerImage})`,
        }}
      />
      
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-8">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight promo-text">
            حقيبتك علينا<br />وملابسك علينا
          </h2>
          <p className="text-2xl lg:text-3xl text-gold font-light mb-8">
            صيفك يكتمل معنا
          </p>
          <button className="cta-button">
            تسوق الآن
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
