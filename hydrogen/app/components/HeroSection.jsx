import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

// Images — resolved via the @assets alias (points to frontend/src/assest)
import hero1 from '@assets/head/4.jpeg';
import img1 from '@assets/head/1.png';
import img2 from '@assets/head/2.jpeg';
import img3 from '@assets/head/3.jpeg';

const HeroSection = () => {
  const slides = [
    {
      img: hero1,
      title: 'Creativity',
      subtitle: 'With 4seven\'s products',
      desc: '٧',
    },
    {
      img: img2,
      title: 'Elegance',
      subtitle: 'Shine with our collection',
      desc: '٧٧',
    },
    {
      img: img3,
      title: 'Preparation',
      subtitle: 'Embrace your future',
      desc: '٧٧٧',
    },
    {
      img: img1,
      title: 'Fashion',
      subtitle: 'Luxurious design from the other side',
      desc: '٧٧٧٧',
    },
  ];


  // Animation timing constants for staggered entrance
  const HERO_DELAYS = {
    tag:      { active: '200ms',  inactive: '0ms' },
    title:    { active: '480ms',  inactive: '0ms' },
    divider:  { active: '920ms',  inactive: '0ms' },
    subtitle: { active: '780ms',  inactive: '0ms' },
    button:   { active: '1080ms', inactive: '0ms' },
  };

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
        autoplay={{ delay: 6000, disableOnInteraction: false }}
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
                <div className="absolute inset-0 bg-black/30" />
                {/* Text Content — each element animates independently */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">

                  {/* Arabic counter tag — slides down from above */}
                  <div
                    className="text-white/80 tracking-[0.3em] text-xs font-bold pb-2 mb-6"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(-18px)',
                      transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
                      transitionDelay: isActive ? HERO_DELAYS.tag.active : HERO_DELAYS.tag.inactive,
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    {slide.desc}
                  </div>

                  {/* Main Title — slides up, letter-spacing compresses in */}
                  <h1
                    className="font-serif font-bold leading-none mix-blend-overlay mb-4"
                    style={{
                      fontFamily: '"Dancing Script", cursive',
                      fontSize: 'clamp(4rem, 12vw, 9rem)',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.96)',
                      letterSpacing: isActive ? '-0.02em' : '0.18em',
                      transition: 'opacity 0.9s ease-out, transform 0.9s ease-out, letter-spacing 0.9s ease-out',
                      transitionDelay: isActive ? HERO_DELAYS.title.active : HERO_DELAYS.title.inactive,
                    }}
                  >
                    {slide.title}
                  </h1>

                  {/* Animated divider line — expands from centre */}
                  <div
                    style={{
                      width: '6rem',
                      height: '1px',
                      background: 'rgba(255,255,255,0.4)',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.6s ease-out',
                      transitionDelay: isActive ? HERO_DELAYS.divider.active : HERO_DELAYS.divider.inactive,
                      marginBottom: '1rem',
                    }}
                  />

                  {/* Subtitle — slides up from below */}
                  <p
                    className="font-light uppercase"
                    style={{
                      fontSize: 'clamp(0.85rem, 2vw, 1.5rem)',
                      letterSpacing: '0.45em',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(22px)',
                      transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
                      transitionDelay: isActive ? HERO_DELAYS.subtitle.active : HERO_DELAYS.subtitle.inactive,
                      marginBottom: '2.5rem',
                    }}
                  >
                    {slide.subtitle}
                  </p>

                  {/* CTA Button — fades up last */}
                  <button
                    onClick={() => {
                      if (typeof document !== 'undefined') {
                        const el = document.getElementById('product-grid');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
                      transition: 'opacity 0.7s ease-out, transform 0.7s ease-out, background 0.3s',
                      transitionDelay: isActive ? HERO_DELAYS.button.active : HERO_DELAYS.button.inactive,
                      padding: '0.75rem 2.5rem',
                      border: '1.5px solid rgba(255,255,255,0.85)',
                      background: 'transparent',
                      color: 'white',
                      fontSize: '0.7rem',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                    className="hero-cta-btn"
                  >
                    Shop Now
                  </button>
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
