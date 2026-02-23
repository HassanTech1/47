import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { useCart } from '~/context/CartContext';
import { useNavigate } from '@remix-run/react';

// Import all product images using Vite's import.meta.glob (replaces Webpack's require.context)
const allProductImages = import.meta.glob(
  '/frontend/src/assest/product/*.{png,jpg,jpeg,svg}',
  { eager: true },
);

const ProductDetail = () => {
  const navigate = useNavigate();
  const { selectedProduct, closeProductDetail, addToCart, setIsCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState('M/15');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);

  // Zoom State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [hadPan, setHadPan] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const sizes = ['S/10', 'M/15', 'L/5', 'XL / 5'];

  // Generate multiple images from local assets using import.meta.glob
  const productImages = React.useMemo(() => {
    if (!selectedProduct) return [];

    try {
      const matchingImages = Object.entries(allProductImages)
        .filter(([path]) => {
          const fileName = path.split('/').pop() || '';
          return fileName.match(
            new RegExp(`^${selectedProduct.id}(\\.|(-[0-9]+\\.))`),
          );
        })
        .sort(([pathA], [pathB]) => {
          const nameA = pathA.split('/').pop() || '';
          const nameB = pathB.split('/').pop() || '';
          const isMainA = !nameA.includes('-');
          const isMainB = !nameB.includes('-');
          if (isMainA && !isMainB) return -1;
          if (!isMainA && isMainB) return 1;
          const getSeq = (name) => {
            const match = name.match(/-(\d+)\./);
            return match ? parseInt(match[1], 10) : 0;
          };
          return getSeq(nameA) - getSeq(nameB);
        })
        .map(([, mod]) => (mod).default || mod);

      if (matchingImages.length > 0) return matchingImages;
    } catch (error) {
      console.error('Error processing product images:', error);
    }

    return [
      selectedProduct.image,
      selectedProduct.backView || selectedProduct.preview || selectedProduct.image,
      selectedProduct.preview || selectedProduct.image,
    ];
  }, [selectedProduct]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (selectedProduct) {
        document.body.style.overflow = 'hidden';
        setCurrentImageIndex(0);
        setSelectedSize('M/15');
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  const handleMouseMove = (e) => {
    if (isPanning) {
      const x = e.clientX - panStart.x;
      const y = e.clientY - panStart.y;
      if (Math.abs(x) > 2 || Math.abs(y) > 2) setHadPan(true);
      setPanOffset({ x, y });
      return;
    }
    if (zoomLevel <= 1) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
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

  const handleAddToCart = () => {
    addToCart({ ...selectedProduct, color: selectedColor }, selectedSize, 1);
    setIsCartOpen(true);
    closeProductDetail();
  };

  const handleBuyNow = () => {
    addToCart({ ...selectedProduct, color: selectedColor }, selectedSize, 1);
    closeProductDetail();
    navigate('/checkout');
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
        <button
          onClick={closeProductDetail}
          className="fixed top-6 right-6 z-[110] w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
          data-testid="close-product-detail"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="min-h-screen flex flex-col lg:flex-row">
          {/* Left — Image Gallery */}
          <div className="lg:w-1/2 relative bg-white flex flex-col lg:flex-row h-[65vh] lg:h-[calc(100vh-140px)]">
            {/* Thumbnails */}
            <div className="hidden lg:flex flex-col gap-4 p-4 items-center overflow-y-auto w-24 border-r border-gray-100">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-16 h-20 flex-shrink-0 overflow-hidden border transition-all ${
                    currentImageIndex === index
                      ? 'border-black opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
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

            {/* Main Image */}
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
              onMouseLeave={() => {
                handleMouseUp();
                setZoomLevel(1);
              }}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={(e) => {
                handleTouchMove(e);
                e.preventDefault();
              }}
              onTouchEnd={handleTouchEnd}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                data-testid="prev-image-btn"
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
                  transition: isPanning ? 'none' : 'transform 0.1s ease-linear',
                }}
                draggable={false}
                data-testid="product-main-image"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                data-testid="next-image-btn"
              >
                <ChevronRight className="w-6 h-6 text-black" />
              </button>
              <div className="lg:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
                {productImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImageIndex === index ? 'bg-black' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right — Product Info */}
          <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center" dir="ltr">
            <h1
              className="text-2xl lg:text-3xl font-medium tracking-wide uppercase mb-2"
              data-testid="product-name"
            >
              {selectedProduct.nameEn}
            </h1>
            <p className="text-lg text-gray-700 mb-8" data-testid="product-price">
              {selectedProduct.price.toFixed(2)} SAR
            </p>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Size</span>
                <button className="text-sm text-gray-500 underline hover:text-black transition-colors">
                  Size guide
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

            <button
              onClick={handleAddToCart}
              className="w-full py-4 border-2 border-black bg-white text-black font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-all mb-4"
              data-testid="add-to-cart-btn"
            >
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-4 bg-white text-black font-medium uppercase tracking-wider hover:underline transition-all mb-8"
              data-testid="buy-now-btn"
            >
              BUY IT NOW
            </button>

            <div className="border-t border-gray-200">
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                  className="w-full py-4 flex items-center justify-between text-left"
                  data-testid="description-toggle"
                >
                  <span className="font-medium">Description</span>
                  <Plus
                    className={`w-4 h-4 transition-transform ${isDescriptionOpen ? 'rotate-45' : ''}`}
                  />
                </button>
                {isDescriptionOpen && (
                  <div className="pb-4 text-gray-600 text-sm leading-relaxed">
                    <p>
                      {selectedProduct.nameEn} - Premium quality fashion item from the 7777
                      collection. Made with the finest materials for ultimate comfort and style.
                    </p>
                  </div>
                )}
              </div>
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setIsCareOpen(!isCareOpen)}
                  className="w-full py-4 flex items-center justify-between text-left"
                  data-testid="care-toggle"
                >
                  <span className="font-medium uppercase">CARE AND MAINTENANCE</span>
                  <Plus
                    className={`w-4 h-4 transition-transform ${isCareOpen ? 'rotate-45' : ''}`}
                  />
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
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-[130] bg-white/95 backdrop-blur-sm flex flex-col">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-[140] w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
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
              setZoomPos({
                x: ((e.clientX - left) / width) * 100,
                y: ((e.clientY - top) / height) * 100,
              });
              setZoomLevel((prev) => (prev > 1 ? 1 : 2.5));
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={(e) => {
              handleTouchMove(e);
              e.preventDefault();
            }}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[135] w-12 h-16 flex items-center justify-center hover:bg-gray-50 transition-colors"
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
                transition: isPanning ? 'none' : 'transform 0.1s ease-linear',
              }}
              draggable={false}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[135] w-12 h-16 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 py-5 bg-white border-t border-gray-100">
            {productImages.map((img, index) => (
              <button key={index} onClick={() => setCurrentImageIndex(index)}>
                <div
                  className={`w-16 h-16 overflow-hidden transition-all ${
                    currentImageIndex === index ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
