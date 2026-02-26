import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { products } from '../data/mock';

// Import images to match ProductGrid
import pro1 from '../assest/product/1.png';
import pro2 from '../assest/product/2.png';
import pro3 from '../assest/product/3.png';
import pro4 from '../assest/product/4.png';
import pro5 from '../assest/product/5.png';
import pro5back from '../assest/product/5-1.png';
import pro6 from '../assest/product/6.png';
import pro6back from '../assest/preview/6.png';

import prev1 from '../assest/preview/1.png';
import prev2 from '../assest/preview/2.png';
import prev3 from '../assest/preview/3.png';
import prev4 from '../assest/preview/4.png';
import prev5 from '../assest/preview/5.png';
import prev11 from '../assest/product/1-1.png';
const back4 = '/behind/4.png'; // served from public/behind/4.png

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const inputRef = useRef(null);
  const { openProductDetail } = useCart();
  const { t, language, formatPrice } = useLanguage();

  // Reconstruct essentialProducts locally
  const productImages = [pro1, pro2, pro4, pro3, pro5, pro6];
  const previewImages = [prev1, prev2, prev4, prev3, prev5, pro6back];
  const backImages = [prev11, null, back4, null, pro5back, pro6back];
  
  const productNames = [
    "VVVV pants",
    "Can be hoody",
    "VVVV zip-up",
    "T-shirt",
    "My future is calling",
    "4Seven's pants"
  ];

  const productNamesAr = [
    "بنطال VVVV",
    "هودي CAN BE",
    "سحاب VVVV",
    "تي شيرت",
    "المستقبل ينادي",
    "بنطال 4SEVEN'S"
  ];

  const productPrices = [179, 249, 269, 149, 269, 179];

  const essentialProducts = products.slice(0, 6).map((p, index) => ({
    ...p,
    nameEn: productNames[index],
    name: productNamesAr[index], // Add Arabic name here
    price: productPrices[index],
    image: productImages[index],
    images: [productImages[index], productImages[index], productImages[index]],
    preview: previewImages[index],
    backView: backImages[index], 
    badge: t("unisex"),
  }));

  // const categories = [
  //   { id: '', name: 'All', nameAr: 'الكل' },
  //   { id: 'bags', name: 'Bags', nameAr: 'حقائب' },
  //   { id: 'shirts', name: 'Shirts', nameAr: 'قمصان' },
  //   { id: 'jackets', name: 'Jackets', nameAr: 'جاكيتات' },
  //   { id: 'pants', name: 'Pants', nameAr: 'بناطيل' },
  // ];
  
  // Use local products for search instead of API
  useEffect(() => {
    const handleSearch = () => {
      // Show all if no query/category, or filter
      // If user wants search behavior (empty initially), allow that. 
      // But typically "I want these elements" implies availability.
      // Let's default to showing them if category is selected, or if query is typed.
      // Or maybe just show them all if nothing is typed? 
      // Let's stick to standard search: Type to find. 
      // BUT if I select "Bags", I expect to see bags.
      
      let filtered = essentialProducts;

      if (!query && !selectedCategory) {
         setResults(filtered); // Show all by default to let user see "these elements"
         setLoading(false);
         return;
      }

      if (selectedCategory) {
         filtered = filtered.filter(p => p.category === selectedCategory);
      }

      if (query.trim()) {
        const q = query.toLowerCase();
        filtered = filtered.filter(product => {
          const nameEn = product.nameEn?.toLowerCase() || '';
          const nameAr = product.name?.toLowerCase() || '';
          return nameEn.includes(q) || nameAr.includes(q);
        });
      }

      setResults(filtered);
      setLoading(false);
    };

    const debounce = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounce);
  }, [query, selectedCategory]);


  const handleProductClick = (product) => {
    openProductDetail(product);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-white" data-testid="search-modal">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-lg`}
                data-testid="search-input"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              data-testid="close-search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 lg:px-8 py-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-gray-200 border-t-black rounded-full" />
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {results.length} {results.length !== 1 ? t('productsFound') : t('productFound')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(product)}
                  data-testid={`search-result-${product.id}`}
                >
                  <div className="relative h-64 bg-gray-50 mb-4 overflow-hidden rounded-lg flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.nameEn}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isNew && (
                      <span className={`absolute top-2 ${language === 'ar' ? 'right-2' : 'left-2'} bg-black text-white text-xs px-2 py-1 rounded`}>
                        {t('newBadge')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium uppercase tracking-wide mb-1">
                    {language === 'ar' && product.name ? product.name : product.nameEn}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatPrice(product.price)}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : query || selectedCategory ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('noProducts')}</p>
            <p className="text-gray-400 text-sm mt-2">{t('tryDifferent')}</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('startTyping')}</p>
            <p className="text-gray-400 text-sm mt-2">{t('searchDesc')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
