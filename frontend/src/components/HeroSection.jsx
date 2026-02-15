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
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const topModel = topModelRef.current;
    const bottomModel = bottomModelRef.current;
    const promoText = promoTextRef.current;
    const leftButton = leftButtonRef.current;
    const rightButton = rightButtonRef.current;

    // Gentle floating animation for top model (jacket - top right)
    gsap.to(topModel, {
      y: -20,
      duration: 3,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Gentle floating animation for bottom model (hoodie - bottom left)
    gsap.to(bottomModel, {
      y: 20,
      duration: 3.5,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Scroll animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: false,
      }
    });

    // Models fade and scale down
    tl.to(topModel, {
      scale: 0.4,
      opacity: 0,
      duration: 1,
    }, 0)
    .to(bottomModel, {
      scale: 0.4,
      opacity: 0,
      duration: 1,
    }, 0)
    // Buttons drag apart to sides
    .to(leftButton, {
      x: '-40vw',
      opacity: 0,
      duration: 1,
    }, 0)
    .to(rightButton, {
      x: '40vw',
      opacity: 0,
      duration: 1,
    }, 0)
    // Reveal promotional text in center
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
      className="hero-section relative h-screen w-full overflow-hidden"
    >
      {/* Split Background - Red Left, Black Right */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 top-0 w-1/2 h-full bg-red-600"></div>
        <div className="absolute right-0 top-0 w-1/2 h-full bg-black"></div>
      </div>

      {/* 3D Model - Top Right (Jacket) - Dark Red on Black Background */}
      <div 
        ref={topModelRef}
        className="absolute top-8 right-8 w-[600px] h-[600px] z-20 pointer-events-none"
        style={{ 
          opacity: 1,
          filter: 'drop-shadow(0 30px 60px rgba(139, 0, 0, 0.5))',
        }}
      >
        <Model3D 
          modelUrl="/models/jacket.obj"
          position="top"
          color="#8B0000"
        />
      </div>

      {/* 3D Model - Bottom Left (Hoodie) - White on Red Background */}
      <div 
        ref={bottomModelRef}
        className="absolute bottom-12 left-8 w-[600px] h-[600px] z-20 pointer-events-none"
        style={{ 
          opacity: 1,
          filter: 'drop-shadow(0 30px 60px rgba(255, 255, 255, 0.5))',
        }}
      >
        <Model3D 
          modelUrl="/models/hoodie.obj"
          position="bottom"
          color="#FFFFFF"
        />
      </div>

      {/* Split Buttons - Initially Visible, Drag Apart on Scroll */}
      <div className="absolute inset-0 flex items-center justify-center z-40 gap-12 pointer-events-auto">
        {/* Left Button - "Take Code 7777" */}
        <button ref={leftButtonRef} className="split-button left-button group" style={{ opacity: 1 }}>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold mb-3">لك</p>
            <p className="text-sm lg:text-base opacity-90 group-hover:opacity-100 transition-opacity">
              خذ الكود 7777
            </p>
          </div>
        </button>

        {/* Right Button - "Enter Your Code" */}
        <button ref={rightButtonRef} className="split-button right-button group" style={{ opacity: 1 }}>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold mb-3">لي</p>
            <p className="text-sm lg:text-base opacity-90 group-hover:opacity-100 transition-opacity">
              أدخل الكود الخاص بك
            </p>
          </div>
        </button>
      </div>

      {/* Promotional Text (Hidden Initially, Appears When Buttons Separate) */}
      <div 
        ref={promoTextRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-30 opacity-0"
      >
        <div className="text-center px-8 max-w-5xl promo-content-wrapper">
          {/* Main Logo */}
          <div className="mb-8 promo-logo-container">
            <h1 className="text-7xl lg:text-9xl font-bold text-white promo-title">
              ٧٧٧٧
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-4"></div>
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
              <p className="text-2xl lg:text-3xl text-white font-bold">
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
          <button className="cta-button px-16 py-5 text-xl shadow-2xl hover:shadow-white/50 transition-all duration-300">
            اكتشف المجموعة
          </button>

          {/* Decorative Elements */}
          <div className="mt-10 flex justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
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
