import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Model3D from './Model3D';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef(null);
  const topModelRef = useRef(null);
  const bottomModelRef = useRef(null);
  const promoTextRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const topModel = topModelRef.current;
    const bottomModel = bottomModelRef.current;
    const promoText = promoTextRef.current;

    // Synchronized scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: false,
      }
    });

    // Move top model (jacket) to the left and scale down
    tl.to(topModel, {
      x: '-50vw',
      scale: 0.8,
      rotation: -15,
      duration: 1,
    }, 0)
    // Move bottom model (hoodie) to the right and scale down
    .to(bottomModel, {
      x: '50vw',
      scale: 0.8,
      rotation: 15,
      duration: 1,
    }, 0)
    // Reveal promotional text in center
    .to(promoText, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
    }, 0.3);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="hero-section relative h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
    >
      {/* 3D Model - Upper Section (Jacket) */}
      <div 
        ref={topModelRef}
        className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] z-20 pointer-events-none"
      >
        <Model3D 
          modelUrl="/models/jacket.obj"
          position="top"
        />
      </div>

      {/* 3D Model - Lower Section (Hoodie) */}
      <div 
        ref={bottomModelRef}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] z-20 pointer-events-none"
      >
        <Model3D 
          modelUrl="/models/hoodie.obj"
          position="bottom"
        />
      </div>

      {/* Promotional Text (Opens in Center) */}
      <div 
        ref={promoTextRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 opacity-0 scale-90"
        style={{ transform: 'translateY(50px)' }}
      >
        <div className="text-center px-8 max-w-4xl">
          <h1 className="text-6xl lg:text-8xl font-bold text-gold mb-8 promo-title animate-pulse">
            ٧٧٧٧
          </h1>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 vision-text">
            أسلوب لا يُنسى
          </h2>
          <p className="text-2xl lg:text-3xl text-white/90 mb-8 leading-relaxed">
            حيث تلتقي الفخامة بالأناقة العصرية
          </p>
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl lg:text-2xl text-gold font-semibold">
              حقيبتك علينا وملابسك علينا
            </p>
            <p className="text-lg lg:text-xl text-white/80">
              صيفك يكتمل معنا
            </p>
            <button className="cta-button mt-6 px-12 py-4 text-xl">
              اكتشف المجموعة
            </button>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center">
        <div className="text-center">
          <p className="text-lg lg:text-xl text-white/70 tracking-widest">
            مجموعة صيف ٢٠٢٥
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
