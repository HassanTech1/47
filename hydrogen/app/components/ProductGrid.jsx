import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

// Images from hydrogen public folder
const pro1 = '/product/1.png';
const pro2 = '/product/2.png';
const pro3 = '/product/3.png';
const pro4 = '/product/4.png';
const pro5 = '/product/5.png';
const pro5back = '/product/5-1.png';
const pro6 = '/product/6.png';
const pro6back = '/preview/6.png';

const prev1 = '/preview/1.png';
const prev2 = '/preview/2.png';
const prev3 = '/preview/3.png';
const prev4 = '/preview/4.png';
const prev5 = '/preview/5.png';
const prev11 = '/product/1-1.png';
const back4 = '/behind/4.png';

export const ProductGrid = ({products: shopifyProducts = [], onProductClick}) => {
  const { openProductDetail } = useCart();
  const { t, language, formatPrice } = useLanguage();

  const productImages = [pro1, pro2, pro4, pro3, pro5, pro6];
  const previewImages = [prev1, prev2, prev4, prev3, prev5, pro6back];
  const backImages = [prev11, null, back4, null, pro5back, pro6back];

  const productNames = [
    "VVVV PANTS",
    "CAN BE HOODY",
    "VVVV ZIP-UP",
    "T-SHIRT",
    "MY FUTURE IS CALLING",
    "4SEVEN'S PANTS"
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

  // Merge Shopify product data (for real variant IDs) with local display assets.
  // When Shopify products are loaded they carry real variant GIDs needed for checkout.
  // When using mock data the GIDs are placeholders that will be replaced once products
  // are added in Shopify Admin.
  const essentialProducts = React.useMemo(() => {
    const result = [];
    for (let index = 0; index < 6; index++) {
      const p = Array.isArray(shopifyProducts) ? shopifyProducts[index] : undefined;
      result.push({
        id: index + 1,
        shopifyId: p?.id ?? null,
        variants: (p?.variants?.nodes ?? []).map((v) => ({
          id: v.id,
          title: v.title,
          availableForSale: v.availableForSale ?? true,
        })),
        variantId: p?.variants?.nodes?.[0]?.id ?? null,
        nameEn: productNames[index] ?? p?.title ?? '',
        name: productNamesAr[index] ?? p?.title ?? '',
        price: parseFloat(p?.priceRange?.minVariantPrice?.amount ?? productPrices[index]),
        image: productImages[index],
        images: [productImages[index]],
        preview: previewImages[index],
        backView: backImages[index],
        badge: t('unisex'),
      });
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopifyProducts, language]);

  const handleProductClick = (product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      openProductDetail(product);
    }
  };

  return (
    <section id="product-grid" className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-wider uppercase">
            {t('essentialCollection')}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {essentialProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="product-card-clean group cursor-pointer"
              onClick={() => handleProductClick(product)}
              data-testid={`product-card-${product.id}`}
            >
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 tracking-wider">
                  {product.badge}
                </span>
              </div>

              <div className="relative aspect-[3/4] bg-gray-50 mb-6 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={language === 'ar' ? product.name : product.nameEn}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="text-center">
                <h3 className="text-sm font-medium text-black mb-2 uppercase tracking-widest">
                  {language === 'ar' ? product.name : product.nameEn}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-base text-black font-semibold">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {[
            { ...essentialProducts[4], badge: t('featured') },
            { ...essentialProducts[5], badge: t('special') }
          ].map((product) => (
            <div
              key={product.id}
              className="product-card-clean group cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 tracking-wider">
                  {product.badge}
                </span>
              </div>

              <div className="relative aspect-[4/3] md:aspect-square lg:aspect-[3/4] bg-gray-50 mb-6 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={language === 'ar' ? product.name : product.nameEn}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="text-center">
                <h3 className="text-sm font-medium text-black mb-2 uppercase tracking-widest">
                  {language === 'ar' ? product.name : product.nameEn}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-base text-black font-semibold">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
