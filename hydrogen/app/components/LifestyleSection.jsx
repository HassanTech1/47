/**
 * LifestyleSection component for Shopify Hydrogen.
 */
export function LifestyleSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[500px] overflow-hidden bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1770022006565-1217f8c78ba1?w=1200&q=85"
              alt="4Seven's Lifestyle"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-4">
              The 4Seven&apos;s Story
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
              Where Style
              <br />
              Meets Identity
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              4Seven&apos;s was born from a passion for authentic self-expression. Each
              piece in our collection is designed to empower the individual, blending
              contemporary streetwear with premium craftsmanship.
            </p>
            <a
              href="/collections/all"
              className="inline-block px-8 py-3 border-2 border-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 self-start"
            >
              Explore Collection
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
