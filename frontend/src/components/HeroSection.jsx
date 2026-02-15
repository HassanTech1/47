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

    // Floating animation for top model
    gsap.to(topModel, {
      y: -30,
      duration: 3,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Floating animation for bottom model (opposite direction)
    gsap.to(bottomModel, {
      y: 30,
      duration: 3.5,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });

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

    // Top model (jacket) - rotate and fade away
    tl.to(topModel, {
      rotationY: 360,
      rotationX: 180,
      scale: 0.3,
      opacity: 0,
      duration: 1,
    }, 0)
    // Bottom model (hoodie) - rotate opposite direction and fade away
    .to(bottomModel, {
      rotationY: -360,
      rotationX: -180,
      scale: 0.3,
      opacity: 0,
      duration: 1,
    }, 0)
    // Reveal promotional text beautifully
    .fromTo(promoText, 
      {
        opacity: 0,
        scale: 0.8,
        y: 100,
        filter: 'blur(10px)'
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power2.out'
      }, 
      0.3
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="hero-section relative h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
    >
      {/* 3D Model - Upper Section (Jacket) - Larger and Floating */}
      <div 
        ref={topModelRef}
        className="absolute top-8 left-1/2 transform -translate-x-1/2 w-[700px] h-[700px] z-20 pointer-events-none floating-model"
        style={{ 
          opacity: 1,
          filter: 'drop-shadow(0 30px 60px rgba(212, 175, 55, 0.4))',
        }}
      >
        <Model3D 
          modelUrl="/models/jacket.obj"
          position="top"
        />
      </div>

      {/* 3D Model - Lower Section (Hoodie) - Larger and Floating */}
      <div 
        ref={bottomModelRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[700px] h-[700px] z-20 pointer-events-none floating-model"
        style={{ 
          opacity: 1,
          filter: 'drop-shadow(0 30px 60px rgba(212, 175, 55, 0.4))',
        }}
      >
        <Model3D 
          modelUrl="/models/hoodie.obj"
          position="bottom"
        />
      </div>

      {/* Promotional Text (Appears Beautifully in Center) */}
      <div 
        ref={promoTextRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-30 opacity-0"
      >
        <div className="text-center px-8 max-w-5xl promo-content-wrapper">
          {/* Main Logo */}
          <div className="mb-8 promo-logo-container">
            <h1 className="text-7xl lg:text-9xl font-bold text-gold promo-title">
              ٧٧٧٧
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4"></div>
          </div>

          {/* Vision Text */}
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 vision-text">
            أسلوب لا يُنسى
          </h2>
          
          <p className="text-2xl lg:text-3xl text-white/90 mb-10 leading-relaxed font-light">
            حيث تلتقي الفخامة بالأناقة العصرية
          </p>

          {/* Promotional Messages */}
          <div className="flex flex-col items-center gap-6 mb-10">
            <div className="promo-message-box">
              <p className="text-2xl lg:text-3xl text-gold font-bold">
                حقيبتك علينا وملابسك علينا
              </p>
            </div>
            
            <div className="promo-message-box">
              <p className="text-xl lg:text-2xl text-white/90">
                صيفك يكتمل معنا
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="cta-button px-16 py-5 text-xl shadow-2xl hover:shadow-gold/50 transition-all duration-300">
            اكتشف المجموعة
          </button>

          {/* Decorative Elements */}
          <div className="mt-10 flex justify-center gap-2">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 left-0 right-0 z-40 flex justify-center">
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
