import React from 'react';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import parisImage from '../assest/preview/p-15.png';

const LifestyleSection = () => {
  const { t } = useLanguage();

  return (
    <section id="catalog" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-black">
             {t('aboutTitleSection')}
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
             {t('aboutDesc1')}
            </p>
            <p className="text-gray-600 text-lg mb-12 leading-relaxed">
             {t('aboutDesc2')}
            </p>
            
            {/* Features Icons */}
            <div className="flex flex-wrap gap-8 lg:gap-16">
                {/* Feature 1 */}
                <div className="flex flex-col items-center text-center">
                    <ShieldCheck className="w-12 h-12 text-black mb-4" />
                    <h3 className="font-bold text-lg mb-1">{t('highQuality')}</h3>
                    <p className="text-gray-500 text-sm">{t('premiumFabrics')}</p>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col items-center text-center">
                    <Truck className="w-12 h-12 text-black mb-4" />
                    <h3 className="font-bold text-lg mb-1">{t('fastShipping')}</h3>
                    <p className="text-gray-500 text-sm">{t('freeDelivery')}</p>
                </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="order-1 lg:order-2">
            <div className="relative h-[500px] lg:h-[600px] overflow-hidden border-4 border-black rounded-none shadow-none">
              <img
                src={parisImage}
                alt="About 4Seven"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default LifestyleSection;
