/**
 * HeroSection component adapted for Shopify Hydrogen.
 * Uses Unsplash images (same as original) since local images
 * need to be uploaded to Shopify CDN or served from public directory.
 */
export function HeroSection() {
  const slides = [
    {
      img: 'https://images.unsplash.com/photo-1659687887656-db3a55ca2b17?w=1920&q=85',
      title: 'Creativity',
      subtitle: "With 4seven's products",
      desc: '٧',
    },
    {
      img: 'https://images.unsplash.com/photo-1765292783735-7e3b69bae41a?w=1920&q=85',
      title: 'Elegance',
      subtitle: 'Shine with our collection',
      desc: '٧٧',
    },
    {
      img: 'https://images.unsplash.com/photo-1770022006565-1217f8c78ba1?w=1920&q=85',
      title: 'Style',
      subtitle: 'Define your identity',
      desc: '٧٧٧',
    },
  ];

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-black">
      {/* Static hero with first slide (Swiper removed for SSR compatibility) */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === 0 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{zIndex: idx === 0 ? 1 : 0}}
        >
          <img
            src={slide.img}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <p className="text-lg tracking-[0.3em] uppercase mb-4 opacity-80">
              {slide.subtitle}
            </p>
            <h1 className="text-6xl lg:text-9xl font-bold tracking-widest mb-6">
              {slide.title}
            </h1>
            <p className="text-4xl opacity-60">{slide.desc}</p>
            <a
              href="#product-grid"
              className="mt-12 px-8 py-3 border-2 border-white text-white text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('product-grid');
                if (el) el.scrollIntoView({behavior: 'smooth'});
              }}
            >
              Shop Now
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}
