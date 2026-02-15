import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, Heart, Menu, ArrowLeft, ArrowRight } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Change style when scrolled past hero (100vh)
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show expanded menu when scrolled or menu clicked
  const showExpandedMenu = scrolled || menuOpen;

  return (
    <>
      {/* Compact Header - Shows in Hero */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showExpandedMenu ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${scrolled ? 'bg-black/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Right Side Icons (RTL - appears on left visually) */}
            <div className="flex items-center gap-6">
              <button className="header-icon" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
              <button className="header-icon" aria-label="User Account">
                <User className="w-5 h-5" />
              </button>
            </div>

            {/* Center Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-3xl font-bold tracking-wider logo-text">
                ٧٧٧٧
              </h1>
            </div>

            {/* Left Side Icons (RTL - appears on right visually) */}
            <div className="flex items-center gap-6">
              <button className="header-icon relative" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button className="header-icon relative" aria-label="Shopping Cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                className="header-icon lg:hidden" 
                aria-label="Menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Menu className="w-5 h-5" />
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
        <div className="border-b border-gray-200">
          {/* Top Navigation */}
          <div className="container mx-auto px-4 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              {/* Left Arrow */}
              <button className="text-black hover:text-gray-600 transition-colors">
                <ArrowLeft className="w-8 h-8" />
              </button>

              {/* Center Logo */}
              <h1 className="text-5xl font-bold tracking-wider text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
                ٧٧٧٧
              </h1>

              {/* Right Arrows */}
              <div className="flex items-center gap-4">
                <button className="text-black hover:text-gray-600 transition-colors">
                  <ArrowRight className="w-8 h-8" />
                </button>
                <button className="text-black hover:text-gray-600 transition-colors">
                  <ArrowRight className="w-8 h-8" />
                </button>
              </div>
            </div>
          </div>

          {/* Menu Items with Stretched Text Style */}
          <div className="bg-gray-50 py-8">
            <div className="container mx-auto px-4 lg:px-8">
              <nav className="flex items-center justify-center gap-12 flex-wrap">
                <a href="#" className="menu-item-stretched">WOMEN</a>
                <a href="#" className="menu-item-stretched">MEN</a>
                <a href="#" className="menu-item-stretched">KIDS</a>
                <a href="#" className="menu-item-stretched">NEW</a>
                <a href="#" className="menu-item-stretched">SALE</a>
                <a href="#" className="menu-item-stretched">BRANDS</a>
                <a href="#" className="menu-item-stretched">COLLECTIONS</a>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
