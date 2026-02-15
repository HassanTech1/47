import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroImages } from '../data/mock';
import Model3D from './Model3D';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef(null);
  const leftSideRef = useRef(null);
  const rightSideRef = useRef(null);
  const leftImageRef = useRef(null);
  const rightImageRef = useRef(null);
  const visionTextRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const leftSide = leftSideRef.current;
    const rightSide = rightSideRef.current;
    const leftImage = leftImageRef.current;
    const rightImage = rightImageRef.current;
    const visionText = visionTextRef.current;

    // Initial diagonal split setup
    gsap.set(leftSide, { 
      clipPath: 'polygon(0 0, 60% 0, 40% 100%, 0 100%)'
    });
    
    gsap.set(rightSide, { 
      clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 40% 100%)'
    });

    // Parallax animation on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: false,
      }
    });

    // Transform diagonal to vertical split
    tl.to(leftSide, {
      clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
      duration: 1,
    }, 0)
    .to(rightSide, {
      clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
      duration: 1,
    }, 0)
    // Move images horizontally (parallax)
    .to(leftImage, {
      x: -100,
      duration: 1,
    }, 0)
    .to(rightImage, {
      x: 100,
      duration: 1,
    }, 0)
    // Reveal vision text
    .to(visionText, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
    }, 0.3);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="hero-section relative h-screen w-full overflow-hidden"
    >
      {/* 3D Models - Upper Section */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 z-30 pointer-events-none">
        <Model3D 
          modelUrl="/models/hoodie.obj"
          position="top"
        />
      </div>

      {/* 3D Models - Lower Section */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 z-30 pointer-events-none">
        <Model3D 
          modelUrl="/models/jacket.obj"
          position="bottom"
        />
      </div>

      {/* Vision Text (revealed behind images) */}
      <div 
        ref={visionTextRef}
        className="absolute inset-0 flex items-center justify-center z-0 opacity-0 scale-95"
      >
        <div className="text-center px-8">
          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-6 vision-text">
            أسلوب لا يُنسى
          </h2>
          <p className="text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto">
            حيث تلتقي الفخامة بالأناقة العصرية
          </p>
        </div>
      </div>

      {/* Left Side - Diagonal Split */}
      <div 
        ref={leftSideRef}
        className="absolute inset-0 z-10"
      >
        <div 
          ref={leftImageRef}
          className="w-full h-full bg-cover bg-center hero-image"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${heroImages.left})`,
          }}
        />
      </div>

      {/* Right Side - Diagonal Split */}
      <div 
        ref={rightSideRef}
        className="absolute inset-0 z-10"
      >
        <div 
          ref={rightImageRef}
          className="w-full h-full bg-cover bg-center hero-image"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${heroImages.right})`,
          }}
        />
      </div>

      {/* Overlay Text */}
      <div className="absolute inset-0 z-20 flex items-end justify-center pb-20">
        <div className="text-center">
          <h3 className="text-2xl lg:text-3xl font-light text-white tracking-widest animate-pulse">
            مجموعة صيف ٢٠٢٥
          </h3>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
