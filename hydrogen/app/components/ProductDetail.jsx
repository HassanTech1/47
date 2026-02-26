import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

// Static image imports (Vite-compatible)
import img1   from '../assest/product/1.png';
import img1_1 from '../assest/product/1-1.png';
import img1_2 from '../assest/product/1-2.png';
import img2   from '../assest/product/2.png';
import img2_1 from '../assest/product/2-1.png';
import img2_2 from '../assest/product/2-2.png';
import img2_3 from '../assest/product/2-3.png';
import img3   from '../assest/product/3.png';
import img3_1 from '../assest/product/3-1.png';
import img3_2 from '../assest/product/3-2.png';
import img4   from '../assest/product/4.png';
import img4_1 from '../assest/product/4-1.png';
import img4_2 from '../assest/product/4-2.png';
import img5   from '../assest/product/5.png';
import img5_1 from '../assest/product/5-1.png';
import img5_2 from '../assest/product/5-2.png';
import img5_3 from '../assest/product/5-3.png';
import img6   from '../assest/product/6.png';
import img6_1 from '../assest/product/6-1.jpeg';
import img6_2 from '../assest/product/6-2.png';

const PRODUCT_IMAGES = {
  1: [img1, img1_1, img1_2],
  2: [img2, img2_1, img2_2, img2_3],
  3: [img4, img4_1, img4_2],
  4: [img3, img3_1, img3_2],
  5: [img5, img5_1, img5_2, img5_3],
  6: [img6, img6_1, img6_2],
};

const RECOMMENDED_PRODUCTS = [
  { id: 1, nameEn: 'VVVV PANTS', name: 'بنطال VVVV', price: 179.00, image: img1 },
  { id: 2, nameEn: 'CAN BE HOODY', name: 'هودي CAN BE', price: 249.00, image: img2 },
  { id: 3, nameEn: 'VVVV ZIP-UP', name: 'سحاب VVVV', price: 269.00, image: img4 },
  { id: 4, nameEn: 'T-SHIRT', name: 'تي شيرت', price: 149.00, image: img3 },
  { id: 5, nameEn: 'MY FUTURE IS CALLING', name: 'المستقبل ينادي', price: 269.00, image: img5 },
  { id: 6, nameEn: "4SEVEN'S PANTS", name: "بنطال 4SEVEN'S", price: 179.00, image: img6 },
];

const ProductDetail = ({product: propProduct, onClose: propOnClose}) => {
  const { selectedProduct: contextProduct, closeProductDetail: contextClose, addToCart, setIsCartOpen, openProductDetail } = useCart();
  
  // Prefer props if passed, otherwise use context. This makes the component more flexible.
  const selectedProduct = propProduct ?? contextProduct;
  const closeProductDetail = propOnClose ?? contextClose;
  const { t, language, formatPrice } = useLanguage();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  
  // Zoom State
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = no zoom, >1 zoomed
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [hadPan, setHadPan] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Black', hex: '#000000', border: 'border-gray-200' },
    { name: 'White', hex: '#ffffff', border: 'border-gray-300' },
    { name: 'Beige', hex: '#E1C699', border: 'border-transparent' },
  ];

  // Get product images from static map
  const productImages = React.useMemo(() => {
    if (!selectedProduct) return [];
    const images = PRODUCT_IMAGES[selectedProduct.id];
    if (images && images.length > 0) return images;
    return [
      selectedProduct.image,
      selectedProduct.backView || selectedProduct.preview || selectedProduct.image,
    ].filter(Boolean);
  }, [selectedProduct]);

  // Recommended Items (Before early return)
  const recommendedItems = React.useMemo(() => {
    return RECOMMENDED_PRODUCTS.filter((p) => p.id !== selectedProduct?.id).slice(0, 3);
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0);
      setSelectedSize('M');
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const x = e.clientX - panStart.x;
      const y = e.clientY - panStart.y;
      // mark that a pan occurred
      if (Math.abs(x) > 2 || Math.abs(y) > 2) setHadPan(true);
      setPanOffset({ x, y });
      return;
    }
    if (zoomLevel <= 1) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    setHadPan(false);
  };

  const handleMouseUp = () => {
    if (!isPanning) return;
    setIsPanning(false);
    // small delay to let click event read hadPan
    setTimeout(() => setHadPan(false), 50);
  };

  const handleTouchStart = (e) => {
    if (zoomLevel <= 1) return;
    const t = e.touches[0];
    setIsPanning(true);
    setPanStart({ x: t.clientX - panOffset.x, y: t.clientY - panOffset.y });
    setHadPan(false);
  };

  const handleTouchMove = (e) => {
    if (!isPanning) return;
    const t = e.touches[0];
    const x = t.clientX - panStart.x;
    const y = t.clientY - panStart.y;
    if (Math.abs(x) > 2 || Math.abs(y) > 2) setHadPan(true);
    setPanOffset({ x, y });
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    setTimeout(() => setHadPan(false), 50);
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(3, +(prev + 0.5).toFixed(2)));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(1, +(prev - 0.5).toFixed(2)));
  };

  // Helper: resolve the Shopify variant GID for the currently selected size.
  // Falls back to the product-level variantId (first variant) if no match found.
  const resolveVariantId = (size) => {
    const nodes = selectedProduct?.variants?.nodes ?? [];
    if (nodes.length === 0) return selectedProduct?.variantId ?? null;
    // Try exact title match first, then case-insensitive, then first available
    const exact = nodes.find((v) => v.title === size);
    if (exact) return exact.id;
    const loose = nodes.find((v) => v.title?.toUpperCase() === size?.toUpperCase());
    return loose ? loose.id : (nodes[0]?.id ?? selectedProduct?.variantId ?? null);
  };

  const handleAddToCart = () => {
    const variantId = resolveVariantId(selectedSize);
    addToCart({ ...selectedProduct, color: selectedColor, variantId }, selectedSize, 1);
    setIsCartOpen(true);
    closeProductDetail();
  };

  const handleBuyNow = async () => {
    const variantId = resolveVariantId(selectedSize);
    const item = { ...selectedProduct, color: selectedColor, variantId };
    addToCart(item, selectedSize, 1);
    
    // Direct redirect to checkout for "Buy It Now"
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          items: [{
            nameEn: item.nameEn ?? item.name ?? '',
            variantId: variantId,
            quantity: 1,
            size: selectedSize,
          }]
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setIsCartOpen(true);
      }
    } catch {
      setIsCartOpen(true);
    }
  };

  const openLightbox = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setIsPanning(false);
    setHadPan(false);
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] bg-white overflow-y-auto"
        data-testid="product-detail-modal"
      >
      {/* Close Button */}
      <button
        onClick={closeProductDetail}
        className="fixed top-6 right-6 z-[110] w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
        data-testid="close-product-detail"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Image Gallery */}
        <div className="lg:w-1/2 relative bg-white flex flex-col lg:flex-row h-[65vh] lg:h-[calc(100vh-140px)]">
          
          {/* Thumbnails - Vertical on Left (Desktop) / Hidden or Horizontal on Mobile if needed */}
          <div className="hidden lg:flex flex-col gap-4 p-4 items-center overflow-y-auto w-24 border-r border-gray-100">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-16 h-20 flex-shrink-0 overflow-hidden border transition-all ${
                  currentImageIndex === index ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image Slider */}
          <div
            className={`relative flex-1 flex items-center justify-center bg-white overflow-hidden ${
              zoomLevel > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
            }`}
            onClick={() => {
              if (hadPan) return;
              openLightbox();
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { handleMouseUp(); setZoomLevel(1); }}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={(e) => { handleTouchMove(e); e.preventDefault(); }}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              data-testid="prev-image-btn"
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>

            {/* Product Image */}
            <img
              src={productImages[currentImageIndex]}
              alt={selectedProduct.nameEn}
              className="max-h-full max-w-full object-contain select-none"
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transition: isPanning ? 'none' : 'transform 0.1s ease-linear'
              }}
              draggable={false}
              data-testid="product-main-image"
            />

            {/* Right Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              data-testid="next-image-btn"
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </button>

            {/* Mobile Thumbnails (Horizontal Bottom) - Visible only on small screens */}
             <div className="lg:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
               {productImages.map((_, index) => (
                 <div 
                   key={index}
                   className={`w-2 h-2 rounded-full transition-colors ${currentImageIndex === index ? 'bg-black' : 'bg-gray-300'}`}
                 />
               ))}
             </div>
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center" dir="ltr">
          {/* Product Name & Price */}
          <h1 
            className="text-2xl lg:text-3xl font-medium tracking-wide uppercase mb-2"
            data-testid="product-name"
          >
            {language === 'ar' && selectedProduct.name ? selectedProduct.name : selectedProduct.nameEn}
          </h1>
          <p 
            className="text-lg text-gray-700 mb-8"
            data-testid="product-price"
          >
            {formatPrice(selectedProduct.price)}
          </p>

          <div className="mb-8">
            {/* Color selection removed */}
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">{t('size')}</span>
              <button 
                className="text-sm text-gray-500 underline hover:text-black transition-colors"
                onClick={() => {
                  setIsSizeGuideOpen(true);
                  const el = document.getElementById('size-guide-toggle');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('sizeGuide')}
              </button>
            </div>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-12 px-4 w-auto border-2 flex items-center justify-center text-sm font-medium transition-all ${
                    selectedSize === size
                      ? 'border-black bg-white'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  data-testid={`size-${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full py-4 border-2 border-black bg-white text-black font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-all mb-4"
            data-testid="add-to-cart-btn"
          >
            {t('addToCart')}
          </button>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="w-full py-4 bg-white text-black font-medium uppercase tracking-wider hover:underline transition-all mb-8"
            data-testid="buy-now-btn"
          >
            {t('buyItNow')}
          </button>

          {/* Accordion Sections */}
          <div className="border-t border-gray-200">
            {/* Description */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                className="w-full py-4 flex items-center justify-between text-left"
                data-testid="description-toggle"
              >
                <span className="font-medium">{t('description')}</span>
                <Plus className={`w-4 h-4 transition-transform ${isDescriptionOpen ? 'rotate-45' : ''}`} />
              </button>
              {isDescriptionOpen && (
                <div className="pb-4 text-gray-600 text-sm leading-relaxed">
                  <p>{language === 'ar' && selectedProduct.name ? selectedProduct.name : selectedProduct.nameEn} - Premium quality fashion item from the 7777 collection. 
                  Made with the finest materials for ultimate comfort and style. 
                  Perfect for both casual and formal occasions.</p>
                </div>
              )}
            </div>

            {/* Care & Maintenance */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => setIsCareOpen(!isCareOpen)}
                className="w-full py-4 flex items-center justify-between text-left"
                data-testid="care-toggle"
              >
                <span className="font-medium uppercase">{t('careAndMaintenance')}</span>
                <Plus className={`w-4 h-4 transition-transform ${isCareOpen ? 'rotate-45' : ''}`} />
              </button>
              {isCareOpen && (
                <div className="pb-4 text-gray-600 text-sm leading-relaxed">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Machine wash cold with like colors</li>
                    <li>Do not bleach</li>
                    <li>Tumble dry low</li>
                    <li>Cool iron if needed</li>
                    <li>Do not dry clean</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Size Guide */}
            <div className="border-b border-gray-200">
              <button
                id="size-guide-toggle"
                onClick={() => setIsSizeGuideOpen(!isSizeGuideOpen)}
                className="w-full py-4 flex items-center justify-between text-left"
                data-testid="size-guide-toggle"
              >
                <span className="font-medium uppercase">{t('sizeGuide')}</span>
                <Plus className={`w-4 h-4 transition-transform ${isSizeGuideOpen ? 'rotate-45' : ''}`} />
              </button>
              {isSizeGuideOpen && (
                <div className="pb-6 pt-2 overflow-x-auto">
                  <div className="min-w-[300px]">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="py-2 font-semibold uppercase text-gray-400 text-[10px] tracking-widest">{language === 'ar' ? 'المقاس' : 'SIZE'}</th>
                          <th className="py-2 font-semibold uppercase text-gray-400 text-[10px] tracking-widest">{selectedProduct.nameEn.toLowerCase().includes('pants') ? (language === 'ar' ? 'الخصر' : 'WAIST') : (language === 'ar' ? 'الصدر' : 'CHEST')}</th>
                          <th className="py-2 font-semibold uppercase text-gray-400 text-[10px] tracking-widest">{language === 'ar' ? 'الطول' : 'LENGTH'}</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600">
                        {(selectedProduct.nameEn.toLowerCase().includes('pants') ? [
                          { s: 'XS', v1: '31.5', v2: '101' },
                          { s: 'S', v1: '34', v2: '102' },
                          { s: 'M', v1: '36.5', v2: '103' },
                          { s: 'L', v1: '39', v2: '104' },
                          { s: 'XL', v1: '41.5', v2: '105' },
                          { s: 'XXL', v1: '44', v2: '106' },
                          { s: 'XXXL', v1: '46.5', v2: '107' }
                        ] : [
                          { s: 'XS', v1: '57.5', v2: '63' },
                          { s: 'S', v1: '60', v2: '65' },
                          { s: 'M', v1: '62.5', v2: '67' },
                          { s: 'L', v1: '65', v2: '69' },
                          { s: 'XL', v1: '67.5', v2: '71' },
                          { s: 'XXL', v1: '70', v2: '73' },
                          { s: 'XXXL', v1: '72.5', v2: '75' }
                        ]).map((row, i) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="py-3 font-medium text-black">{row.s}</td>
                            <td className="py-3">{row.v1} cm</td>
                            <td className="py-3">{row.v2} cm</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 flex justify-center opacity-40">
                      {selectedProduct.nameEn.toLowerCase().includes('pants') ? (
                        <svg width="80" height="100" viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M30 10 H70 L85 110 H65 L50 40 L35 110 H15 L30 10 Z" />
                          <path d="M30 30 H70" strokeDasharray="2 2" />
                          <text x="50" y="25" fontSize="8" textAnchor="middle" fill="currentColor">WAIST</text>
                          <path d="M10 10 V110" strokeDasharray="2 2" />
                          <text x="5" y="60" fontSize="8" textAnchor="middle" transform="rotate(-90 5 60)" fill="currentColor">LENGTH</text>
                        </svg>
                      ) : (
                        <svg width="100" height="100" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M40 20 L20 40 L30 50 L40 45 V100 H80 V45 L90 50 L100 40 L80 20 H40 Z" />
                          <path d="M40 40 H80" strokeDasharray="2 2" />
                          <text x="60" y="35" fontSize="8" textAnchor="middle" fill="currentColor">CHEST</text>
                          <path d="M85 20 V100" strokeDasharray="2 2" />
                          <text x="95" y="60" fontSize="8" textAnchor="middle" transform="rotate(90 95 60)" fill="currentColor">LENGTH</text>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* You May Also Like */}
          {recommendedItems.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-6 uppercase tracking-wider text-center">{t('youMayAlsoLike')}</h3>
              <div className="grid grid-cols-3 gap-4">
                {recommendedItems.map((p) => (
                  <div 
                    key={p.id} 
                    className="cursor-pointer group flex flex-col items-center text-center" 
                    onClick={() => {
                      openProductDetail(p);
                    }}
                  >
                    <div className="aspect-[3/4] overflow-hidden mb-3 bg-gray-100 w-full max-w-[140px] mx-auto shadow-sm">
                      <img 
                        src={p.image} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        alt={p.nameEn} 
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wide">
                        {language === 'ar' && p.name ? p.name : p.nameEn}
                      </p>
                      <p className="text-xs text-gray-500">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Lightbox Overlay */}
      {showLightbox && (
        <div className="fixed inset-0 z-[130] bg-white/95 backdrop-blur-sm flex flex-col">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-[140] w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className={`relative flex-1 flex items-center justify-center overflow-hidden bg-white ${
              zoomLevel > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
            }`}
            onClick={(e) => {
              if (hadPan) return;
              const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - left) / width) * 100;
              const y = ((e.clientY - top) / height) * 100;
              setZoomPos({ x, y });
              setZoomLevel((prev) => (prev > 1 ? 1 : 2.5));
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={(e) => { handleTouchMove(e); e.preventDefault(); }}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[135] w-12 h-16 flex items-center justify-center hover:bg-gray-50 transition-colors"
              data-testid="lightbox-prev-image-btn"
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>

            <img
              src={productImages[currentImageIndex]}
              alt={selectedProduct.nameEn}
              className="max-h-full max-w-full object-contain select-none"
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transition: isPanning ? 'none' : 'transform 0.1s ease-linear'
              }}
              draggable={false}
            />

            {/* Right Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[135] w-12 h-16 flex items-center justify-center hover:bg-gray-50 transition-colors"
              data-testid="lightbox-next-image-btn"
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </button>

            {zoomLevel <= 1 && (
              <div className="absolute top-4 right-4 bg-white/90 rounded px-2 py-1 text-xs font-medium pointer-events-none">
                 Zoom 
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex items-center justify-center gap-4 py-5 bg-white border-t border-gray-100">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className="flex flex-col items-center gap-1 focus:outline-none"
              >
                <div className={`w-16 h-16 overflow-hidden transition-all ${
                  currentImageIndex === index ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                }`}>
                  <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-contain" />
                </div>
                <span className={`block h-[2px] w-full transition-all ${
                  currentImageIndex === index ? 'bg-black' : 'bg-transparent'
                }`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
