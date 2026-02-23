/**
 * PromoBanner component for Shopify Hydrogen.
 */
export function PromoBanner() {
  return (
    <section className="relative w-full h-64 md:h-96 overflow-hidden bg-gray-100">
      <img
        src="https://images.unsplash.com/photo-1770022006565-1217f8c78ba1?w=1920&q=80"
        alt="4Seven's Lifestyle"
        className="w-full h-full object-cover object-center"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
        <p className="text-xs tracking-[0.4em] uppercase mb-4">New Collection</p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-widest uppercase">
          4Seven&apos;s Essential
        </h2>
        <p className="mt-4 text-sm tracking-wider opacity-80">
          Unisex · Premium Quality · Saudi Arabia
        </p>
      </div>
    </section>
  );
}
