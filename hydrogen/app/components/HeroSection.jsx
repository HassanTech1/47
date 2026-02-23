import React from 'react';
// Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Swiper modules
import { Autoplay, EffectFade } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

// Images served from hydrogen `public` folder
const hero1 = '/head/4.jpeg';
const img1 = '/head/1.png';
const img2 = '/head/2.jpeg';
const img3 = '/head/3.jpeg';

export const HeroSection = () => {
  const slides = [
    {
      img: hero1,
      title: "Creativity",
      subtitle: "With  4seven's products",
      desc: "٧"
    },
    {
      img: img2,
      title: "Elegance",
      subtitle: "Shine with our collection",
      desc: "٧٧"
    },
    {
      img: img3,
      title: "Preparation",
      subtitle: "Embrace your future ",
      desc: "٧٧٧"
    },
    {
      img: img1,
      title: "Fashion",
      subtitle: "Luxurious design from the other side",
      desc: "٧٧٧٧"
    }
  ];

  return (
    <div id="hero" className="hero-section relative w-full h-[100vh] bg-black">
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={2500}
        loop={true}
        allowTouchMove={false}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full overflow-hidden">
             {({ isActive }) => (
               <>
                  <img 
                    src={slide.img} 
                    alt={slide.title} 
                    className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className={`absolute inset-0 flex flex-col items-center justify-center text-center text-white transition-all duration-1000 delay-300 ease-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                      <div className="text-white/80 tracking-[0.3em] text-xs font-bold border-b border-white/20 pb-2 mb-6">
                        {slide.desc}
                      </div>

                      <h1 className="text-7xl md:text-9xl font-serif font-bold leading-none tracking-tighter mix-blend-overlay mb-4" style={{ fontFamily: '"Dancing Script", cursive' }}>
                        {slide.title}
                      </h1>
                      <p className="text-xl md:text-2xl font-light tracking-[0.5em] uppercase border-t border-white/30 pt-4 inline-block">
                        {slide.subtitle}
                      </p>
                  </div>
               </>
             )}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm tracking-widest uppercase animate-bounce z-20 pointer-events-none">
            Scroll to Explore
      </div>
    </div>
  );
};

export default HeroSection;
import React from 'react';
// Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Swiper modules
import { Autoplay, EffectFade } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

// Images
import hero1 from '../assest/head/4.jpeg';
import img1 from '../assest/head/1.png';
import img2 from '../assest/head/2.jpeg';
import img3 from '../assest/head/3.jpeg';

const HeroSection = () => {
    // Array of images with corresponding text content
  const slides = [
    {
      img: hero1,
      title: "Creativity",
      subtitle: "With  4seven's products",
      desc: "٧"
    },
    {
      img: img2,
      title: "Elegance",
      subtitle: "Shine with our collection",
      desc: "٧٧"
    },
    {
      img: img3,
      title: "Preparation",
      subtitle: "Embrace your future ",
      desc: "٧٧٧"
    },
    {
      img: img1,
      title: "Fashion",
      subtitle: "Luxurious design from the other side",
      desc: "٧٧٧٧"
    }
  ];

  return (
    <div id="hero" className="hero-section relative w-full h-[100vh] bg-black">
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={2500} /* Slower, calmer transition */
        loop={true}
        allowTouchMove={false} /* Disable swiping by hand for a pure background feel */
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full overflow-hidden">
             {/* Slide Content */}
             {({ isActive }) => (
               <>
                  <img 
                    src={slide.img} 
                    alt={slide.title} 
                    className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30"></div>
                  
                  {/* Text Content with Animation based on isActive state */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center text-center text-white transition-all duration-1000 delay-300 ease-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                      
                      {/* Top Tag */}
                      <div className="text-white/80 tracking-[0.3em] text-xs font-bold border-b border-white/20 pb-2 mb-6">
                        {slide.desc}
                      </div>

                      {/* Main Title */}
                      <h1 className="text-7xl md:text-9xl font-serif font-bold leading-none tracking-tighter mix-blend-overlay mb-4" style={{ fontFamily: '"Dancing Script", cursive' }}>
                        {slide.title}
                      </h1>
                      
                      {/* Subtitle */}
                      <p className="text-xl md:text-2xl font-light tracking-[0.5em] uppercase border-t border-white/30 pt-4 inline-block">
                        {slide.subtitle}
                      </p>
                  </div>
               </>
             )}
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Scroll Indicator (Static on top of slider) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm tracking-widest uppercase animate-bounce z-20 pointer-events-none">
            Scroll to Explore
      </div>
    </div>
  );
};


export default HeroSection;
