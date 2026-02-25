import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import newBg from '../assest/preview/new-background.jpeg';

const PromoBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="relative h-[500px] lg:h-[600px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${newBg})`,
        }}
      />
      
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-8">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight promo-text">
              {t('elevateStyle')}<br />{t('withPremium')}
          </h2>
          <p className="text-2xl lg:text-3xl text-gold font-light mb-8" style={{ color: '#FFFFFF' }}>
            {t('completeStyle')}
          </p>
          <button
            className="mt-8 px-10 py-4 border border-white text-white text-sm uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-black transition-all duration-500 bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('product-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('discoverCollection')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
