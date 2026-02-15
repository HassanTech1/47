import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Model3D from './Model3D';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef(null);
  const topModelRef = useRef(null);
  const bottomModelRef = useRef(null);
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const topModel = topModelRef.current;
    const bottomModel = bottomModelRef.current;
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

    // Scroll animation timeline - Extended for smoother, longer animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=150%', // Extended scroll distance (150% of viewport height)
        scrub: 1.5, // Slightly smoother scrubbing
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
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="hero-section relative w-full overflow-hidden"
      style={{ minHeight: '200vh' }}
    >
      {/* Split Background - Red Left, Black Right */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 top-0 w-1/2 h-full bg-red-600"></div>
        <div className="absolute right-0 top-0 w-1/2 h-full bg-black"></div>
        {/* Vertical line in center */}
        <div className="absolute left-1/2 top-0 w-px h-full bg-white/30 transform -translate-x-1/2"></div>
      </div>

      {/* Center Branding - Always Visible */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-15 text-center">
        <h1 className="text-9xl lg:text-[12rem] font-bold text-white hero-logo mb-6">
          ٧٧٧٧
        </h1>
        <p className="text-3xl lg:text-4xl text-white/90 font-light tracking-widest">
          PREMIUM FASHION
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>
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

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        {/* Left side (red) decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-black/20 rounded-full blur-2xl" style={{ animationDelay: '1s' }}></div>
        
        {/* Right side (black) decorative elements */}
        <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-red-600/10 rounded-full blur-3xl"></div>
        
        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/70 text-sm tracking-widest">SCROLL</p>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full"></div>
          </div>
        </div>
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
