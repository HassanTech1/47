import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    newsletterTitle: "BE PART OF THE 7777 COMMUNITY",
    newsletterDesc: "Subscribe for early access, runway previews, and exclusive offers.",
    newBadge: "NEW",

    emailPlaceholder: "Your email",
    subscribeBtn: "SUBSCRIBE",
    aboutTitle: "ABOUT 7777",
    contactUs: "CONTACT US",
    termsConditions: "TERMS & CONDITIONS",
    privacyPolicy: "PRIVACY POLICY",
    returnsExchanges: "RETURNS & EXCHANGES",
    shippingPolicy: "SHIPPING POLICY",
    clientServicesTitle: "CLIENT SERVICES",
    onlineReturn: "ONLINE RETURN",
    storeLocator: "STORE LOCATOR",
    trackOrder: "TRACK ORDER",
    eGiftCard: "E GIFT CARD",
    faq: "FAQ",
    copyright: "© 2026 7777 fashion.",
    alertMessage: "Thanks for joining the 7777 community!",
    // Header
    home: "Home",
    allProducts: "All products",
    catalog: "Catalog",
    contact: "Contact",
    myAccount: "My Account",
    login: "Log in",
    freeDeliveryMsg: "Free delivery for orders above",
    freeDeliveryCongrats: "Congratulations! You got free delivery! 🎉",
    // Product
    addToCart: "ADD TO CART",
    buyItNow: "BUY IT NOW",
    description: "Description",
    careAndMaintenance: "CARE AND MAINTENANCE",
    youMayAlsoLike: "YOU MAY ALSO LIKE",
    size: "Size",
    sizeGuide: "Size guide",
    // Cart
    shoppingCart: "Shopping Cart",
    checkout: "CHECKOUT",
    subtotal: "SUBTOTAL",
    cartEmpty: "Your cart is empty",
    continueShopping: "Continue Shopping",
    remove: "Remove",
    orderNote: "Order note",
    // Hero
    creativity: "Creativity",
    creativitySub: "With 4seven's products",
    elegance: "Elegance",
    eleganceSub: "Shine with our collection",
    preparation: "Preparation",
    preparationSub: "Embrace your future",
    fashion: "Fashion",
    fashionSub: "Luxurious design from the other side",
    shopNow: "SHOP NOW",
    scrollToExplore: "Scroll to Explore",
    // Checkout
    shippingInfo: "Shipping Information",
    payment: "Payment",
    contactInfo: "Contact Information",
    shippingAddress: "Shipping Address",
    shippingMethod: "Shipping Method",
    proceedToPayment: "Proceed to Secure Payment",
    secureTransaction: "All transactions are secure and encrypted.",
    orderSummary: "Order Summary",
    returnToStore: "Return to Store",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    country: "Country",
    city: "City",
    address: "Address",
    apartment: "Apartment",
    postalCode: "Postal Code",
    deliveringTo: "Delivering to",
    edit: "Edit",
    totalAmount: "Total Amount",
    loadingPayment: "Loading payment gateway...",
    backToShipping: "Back to shipping info",
    shippingPartners: "Shipping Partners",
    shipping: "The Shipping",
    currency: "SAR",
    aboutTitleSection: "About 4seven's",
    aboutDesc1: "We are a store specializing in offering the finest selection of modern and elegant hoodies. We believe that fashion should be both comfortable and practical at the same time.",
    aboutDesc2: "All our products are made from the highest quality premium cotton fabrics, with attention to the finest details to ensure your comfort and complete satisfaction.",
    highQuality: "High Quality",
    premiumFabrics: "Premium fabrics",
    fastShipping: "Fast Shipping",
    freeDelivery: "Free delivery",
    elevateStyle: "Elevate Your Style",
    withPremium: "with Premium Pieces",
    completeStyle: "Complete your personal style",
    discoverCollection: "DISCOVER COLLECTION",
    essentialCollection: "ESSENTIAL COLLECTION",
    unisex: "unisex",
    featured: "FEATURED",
    special: "SPECIAL",
    delivery: "Delivery",
    emailNewsMsg: "Email me with news and offers",
    saveInfoMsg: "Save this information for next time",
    billingAddress: "Billing address",
    sameAsShipping: "Same as shipping address",
    differentBilling: "Use a different billing address",
    payNow: "Pay now",
    discountPlaceholder: "Discount code or gift card",
    apply: "Apply",
    refundPolicy: "Refund policy",
    region: "State",
    shippingRatesEmpty: "Enter your shipping address to view available shipping methods.",
    shippingCalculated: "Shipping calculated at checkout"
  },
  ar: {
    newsletterTitle: "كن جزءاً من مجتمع 7777",
    newsletterDesc: "اشترك للحصول على وصول مبكر وعروض حصرية ومعاينة لأحدث التصاميم.",
    newBadge: "جديد",

    emailPlaceholder: "بريدك الإلكتروني",
    subscribeBtn: "اشترك",
    aboutTitle: "عن 7777",
    contactUs: "اتصل بنا",
    termsConditions: "الشروط والأحكام",
    privacyPolicy: "سياسة الخصوصية",
    returnsExchanges: "الإرجاع والاستبدال",
    shippingPolicy: "سياسة الشحن",
    clientServicesTitle: "خدمات العملاء",
    onlineReturn: "الإرجاع عبر الإنترنت",
    storeLocator: "فروعنا",
    trackOrder: "تتبع طلبك",
    eGiftCard: "بطاقة هدايا إلكترونية",
    faq: "الأسئلة الشائعة",
    copyright: "© 2026 7777 أزياء.",
    alertMessage: "شكراً لانضمامك إلى مجتمع 7777!",
    // Header
    home: "الرئيسية",
    allProducts: "كل المنتجات",
    catalog: "الكتالوج",
    contact: "اتصل بنا",
    myAccount: "حسابي",
    login: "تسجيل الدخول",
    freeDeliveryMsg: "توصيل مجاني للطلبات فوق",
    freeDeliveryCongrats: "مبروك لقد حصلت على توصيل مجاني! 🎉",
    // Product
    addToCart: "أضف للسلة",
    buyItNow: "شراء الآن",
    description: "الوصف",
    careAndMaintenance: "العناية والصيانة",
    youMayAlsoLike: "قد يعجبك أيضاً",
    size: "المقاس",
    sizeGuide: "دليل المقاسات",
    // Cart
    shoppingCart: "سلة التسوق",
    checkout: "إتمام الشراء",
    subtotal: "المجموع الفرعي",
    cartEmpty: "سلة التسوق فارغة",
    continueShopping: "تابع التسوق",
    remove: "إزالة",
    orderNote: "ملاحظات الطلب",
    // Hero
    creativity: "الإبداع",
    creativitySub: "مع منتجات 4seven's",
    elegance: "أناقة",
    eleganceSub: "تألق مع مجموعتنا",
    preparation: "التحضير",
    preparationSub: "عانق مستقبلك",
    fashion: "أزياء",
    fashionSub: "تصميم فاخر من الجانب الآخر",
    shopNow: "تسوق الآن",
    scrollToExplore: "مرر للأسفل للاستكشاف",
    // Checkout
    shippingInfo: "معلومات الشحن",
    payment: "الدفع",
    contactInfo: "بيانات التواصل",
    shippingAddress: "عنوان التوصيل",
    shippingMethod: "طريقة الشحن",
    proceedToPayment: "متابعة للدفع الآمن",
    secureTransaction: "جميع المعاملات مشفرة وآمنة.",
    orderSummary: "ملخص الطلب",
    returnToStore: "العودة للمتجر",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    email: "البريد الإلكتروني",
    phone: "رقم الجوال",
    country: "الدولة",
    city: "المدينة",
    address: "العنوان (الشارع / الحي)",
    apartment: "الشقة / المبنى (اختياري)",
    postalCode: "الرمز البريدي",
    deliveringTo: "التوصيل إلى",
    edit: " تعديل",
    totalAmount: "المبلغ المستحق",
    loadingPayment: "جارٍ تحميل بوابة الدفع...",
    backToShipping: "العودة لمعلومات الشحن",
    shippingPartners: "شركاء الشحن",
    shipping: "الشحن",
    currency: "ريال",
    aboutTitleSection: "عن 4seven's",
    aboutDesc1: "نحن متجر متخصص في تقديم أفضل تشكيلة من الهوديز العصرية والأنيقة. نؤمن بأن الموضة يجب أن تكون مريحة وعملية في نفس الوقت.",
    aboutDesc2: "جميع منتجاتنا مصنوعة من أجود أنواع أقمشة القطن الممتازة، مع الاهتمام بأدق التفاصيل لضمان راحتك ورضاك التام.",
    highQuality: "جودة عالية",
    premiumFabrics: "أقمشة فاخرة",
    fastShipping: "شحن سريع",
    freeDelivery: "توصيل مجاني",
    elevateStyle: "ارتقِ بأسلوبك",
    withPremium: "بقطع حصرية وفاخرة",
    completeStyle: "اكمل مظهرك الخاص",
    discoverCollection: "اكتشف المجموعة",
    essentialCollection: "المجموعة الأساسية",
    unisex: "للجنسين",
    featured: "مميز",
    special: "خاص",
    delivery: "التوصيل",
    emailNewsMsg: "أرسل لي آخر الأخبار والعروض عبر البريد الإلكتروني",
    saveInfoMsg: "حفظ هذه المعلومات للمرة القادمة",
    billingAddress: "عنوان الفواتير",
    sameAsShipping: "نفس عنوان التوصيل",
    differentBilling: "استخدم عنوان فواتير مختلف",
    payNow: "الدفع الآن",
    discountPlaceholder: "رمز الخصم أو بطاقة الهدايا",
    apply: "تطبيق",
    refundPolicy: "سياسة الاسترجاع",
    region: "المنطقة / الولاية",
    shippingRatesEmpty: "أدخل عنوان التوصيل لعرض طرق الشحن المتاحة.",
    shippingCalculated: "الشحن يتم حسابه عند الدفع"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('SAR');

  const rates = {
    SAR: 1,
    GBP: 0.21,
    EUR: 0.25,
    USD: 0.27
  };

  const t = (key) => {
    const translation = translations[language][key];
    return translation || key;
  };

  const formatPrice = (amount) => {
    const converted = (amount * rates[currency]).toFixed(2);
    const symbols = {
      SAR: language === 'ar' ? 'ريال' : 'SAR',
      GBP: '£',
      EUR: '€',
      USD: '$'
    };
    return `${converted} ${symbols[currency]}`;
  };

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: toggleLanguage, 
      t, 
      currency, 
      setCurrency,
      formatPrice 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
