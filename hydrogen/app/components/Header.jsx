import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, Heart, Menu, ArrowLeft, ArrowRight, Instagram } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import logo from '../assest/logo/1.png';
import logo2 from '../assest/logo/2.png';
const Header = ({ onOpenAuth, onOpenSearch, onOpenAccount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { getCartCount, setIsCartOpen, cartItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Calculate free shipping progress
  const cartTotal = cartItems?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  const freeShippingThreshold = 475;
  const remainingForFreeShipping = freeShippingThreshold - cartTotal;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showExpandedMenu = scrolled || menuOpen;

  const handleUserClick = () => {
    if (isAuthenticated) {
      onOpenAccount();
    } else {
      onOpenAuth();
    }
  };

  const handleNavClick = (event, targetId) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Announcement Bar - Free Shipping */}
      <div 
        className={`fixed top-0 left-0 right-0 z-[60] h-10 bg-white text-black flex items-center justify-center text-sm font-medium transition-transform duration-300 ${
          scrolled ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {remainingForFreeShipping > 0 ? (
          <span>
            {t('freeDeliveryMsg')} <span style={{color: 'green'}}>475</span> SAR
          </span>
        ) : (
          <span className="text-green-600 font-bold flex items-center gap-2">
            {t('freeDeliveryCongrats')}
          </span>
        )}
      </div>

      {/* Compact Header - Shows in Hero */}
      <header 
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          showExpandedMenu ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${scrolled ? 'bg-black/80 backdrop-blur-xl shadow-lg top-0' : 'bg-transparent top-10'}`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Side Icons */}
            <div className="flex items-center gap-6">
              <button 
                className="header-icon relative" 
                aria-label="Shopping Cart"
                onClick={() => setIsCartOpen(true)}
                data-testid="header-cart-btn"
              >
                <ShoppingCart className="w-7 h-7" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {getCartCount()}
                  </span>
                )}
              </button>
              <button 
                className="header-icon" 
                aria-label="User Account"
                onClick={handleUserClick}
                data-testid="header-user-btn"
              >
                <User className="w-7 h-7" />
              </button>
            </div>

            {/* Center Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img src={logo} alt="Logo" className="w-24 h-auto object-contain" />
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-6">
              <button 
                className="header-icon" 
                aria-label="Search"
                onClick={onOpenSearch}
                data-testid="header-search-btn"
              >
                <Search className="w-7 h-7" />
              </button>
              <button 
                className="header-icon lg:hidden" 
                aria-label="Menu"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Expanded Menu - Shows when scrolled or clicked */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white ${
          showExpandedMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="border-b-2 border-black">
          {/* Top Navigation */}
          <div className="container mx-auto px-4 lg:px-8 py-4 border-b-2 border-black">
            <div className="flex items-center justify-between">
              {/* Left - Icon Group with Labels */}
              <div className="flex items-center gap-6">
                 <button 
                  className="icon-with-label relative"
                  onClick={() => setIsCartOpen(true)}
                  data-testid="expanded-header-cart-btn"
                >
                  <ShoppingCart className="w-6 h-6 mb-1" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center" style={{ fontSize: '0.65rem' }}>
                      {getCartCount()}
                    </span>
                  )}
                </button>
                <button 
                  className="icon-with-label"
                  onClick={handleUserClick}
                  data-testid="expanded-user-btn"
                >
                  <User className="w-6 h-6 mb-1" />
                  <span className="text-xs">
                    {isAuthenticated ? user?.name?.split(' ')[0] : ''}
                  </span>
                </button>
              </div>

              {/* Center Logo */}
              <div className="flex justify-center items-center">
                 <img src={logo2} alt="Logo" className="w-24 h-auto object-contain" />
              </div>

              {/* Right - Icons */}
              <div className="flex items-center gap-6">
                 <button 
                  className="icon-with-label"
                  onClick={onOpenSearch}
                  data-testid="expanded-search-btn"
                >
                  <Search className="w-6 h-6 mb-1" />
                </button>

                <button 
                  className="icon-with-label lg:hidden" 
                  aria-label="Menu"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="w-6 h-6 mb-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Menu Items with Stretched Text Style - Smaller */}
          {/* <div className="bg-gray-50 py-4 hidden lg:block">
            <div className="container mx-auto px-4 lg:px-8">
              <nav className="flex items-center justify-center gap-8 flex-wrap">
                <a href="#women" className="menu-item-stretched-small">WOMEN</a>
                <a href="#men" className="menu-item-stretched-small">MEN</a>
                <a href="#kids" className="menu-item-stretched-small">KIDS</a>
                <a href="#new" className="menu-item-stretched-small">NEW</a>
                <a href="#sale" className="menu-item-stretched-small">SALE</a>
                <a href="#brands" className="menu-item-stretched-small">BRANDS</a>
                <a href="#collections" className="menu-item-stretched-small">COLLECTIONS</a>
              </nav>
            </div>
          </div> */}
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white text-black p-0 border-l border-gray-200">
            <div className="flex flex-col h-full">
                <div className="px-6 py-8 space-y-6 flex-1 overflow-y-auto">
                    <nav className="flex flex-col space-y-6 text-lg tracking-wide font-light">
                        <a
                          href="#hero"
                          onClick={(e) => handleNavClick(e, 'hero')}
                          className="block hover:text-gray-600 transition-colors"
                        >
                          {t('home')}
                        </a>
                        <a
                          href="#product-grid"
                          onClick={(e) => handleNavClick(e, 'product-grid')}
                          className="block hover:text-gray-600 transition-colors"
                        >
                          {t('allProducts')}
                        </a>
                        <a
                          href="#catalog"
                          onClick={(e) => handleNavClick(e, 'catalog')}
                          className="block hover:text-gray-600 transition-colors"
                        >
                          {t('catalog')}
                        </a>
                        <a
                          href="#contact"
                          onClick={(e) => handleNavClick(e, 'contact')}
                          className="block hover:text-gray-600 transition-colors"
                        >
                          {t('contact')}
                        </a>
                    </nav>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                     <div className="space-y-6">
                        <button onClick={handleUserClick} className="flex items-center gap-3 text-sm hover:text-gray-600 transition-colors w-full">
                            <User className="w-5 h-5" />
                            <span>{isAuthenticated ? t('myAccount') : t('login')}</span>
                        </button>
                     </div>

                     <div className="mt-8 flex items-center justify-between">
                         <a href="https://instagram.com/4sevens.sa" className="text-black hover:text-gray-600 transition-colors">
                            <Instagram className="w-6 h-6" />
                         </a>       
                     </div>
                </div>
            </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Header;
