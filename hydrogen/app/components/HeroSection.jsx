import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { useLanguage } from '../context/LanguageContext';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import hero1 from '../assest/head/4.jpeg';
import img1 from '../assest/head/1.png';
import img2 from '../assest/head/2.jpg';
import img3 from '../assest/head/3.jpg';

const slideKeys = [
  { img: hero1, titleKey: 'creativity', subKey: 'creativitySub', desc: '٧' },
  { img: img2, titleKey: 'elegance', subKey: 'eleganceSub', desc: '٧٧' },
  { img: img3, titleKey: 'preparation', subKey: 'preparationSub', desc: '٧٧٧' },
  {
    img: img1,
    titleKey: 'fashion',
    subKey: 'fashionSub',
    desc: '٧٧٧٧',
  },
];

const HeroSection = () => {
  const { t, language } = useLanguage();

  return (
  <div id="hero" className="hero-section relative w-full h-[100vh] bg-black">
    {/* Custom styles for Swiper pagination */}
    <style>{`
      .hero-section .swiper-pagination {
        position: static;
        display: flex;
        gap: 8px;
        width: auto;
      }
      .hero-section .swiper-pagination-bullet {
        width: 8px;
        height: 8px;
        background-color: rgba(255, 255, 255, 0.5);
        opacity: 1;
        transition: all 0.3s ease;
      }
      .hero-section .swiper-pagination-bullet-active {
        width: 24px;
        border-radius: 4px;
        background-color: white;
      }
    `}</style>

    <Swiper
      key={language}
      modules={[Autoplay, EffectFade, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      speed={2500}
      loop
      allowTouchMove={false}
      autoplay={{
        delay: 6000,
        disableOnInteraction: false,
      }}
      pagination={{
        el: '.swiper-pagination-custom',
        clickable: true,
      }}
      className="w-full h-full"
    >
      {slideKeys.map((slide, index) => (
        <SwiperSlide key={index} className="relative w-full h-full overflow-hidden">
          {({ isActive }) => (
            <>
              <img
                src={slide.img}
                alt={t(slide.titleKey)}
                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center text-center text-white transition-all duration-1000 delay-300 ease-out ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="text-white/80 tracking-[0.3em] text-xs font-bold border-b border-white/20 pb-2 mb-6">
                  {slide.desc}
                </div>

                <h1
                  className="text-7xl md:text-9xl font-serif font-bold leading-none tracking-tighter mix-blend-overlay mb-4"
                  style={{ fontFamily: '"Dancing Script", cursive' }}
                >
                  {t(slide.titleKey)}
                </h1>
                <p 
                  className="text-xl md:text-2xl font-light tracking-[0.5em] uppercase border-t border-white/30 pt-4 inline-block"
                  style={{ fontFamily: '"Dancing Script", cursive' }}
                >
                  {t(slide.subKey)}
                </p>
              </div>
            </>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
    
    {/* Container for bottom controls */}
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
      <div className="text-white/70 text-sm tracking-widest uppercase animate-bounce">
        {t('scrollToExplore')}
      </div>
      <div className="swiper-pagination-custom" />
    </div>
  </div>
);
};

export default HeroSection;
